# Scale & future-proofing — validated 2026 architecture (seam register)

**Date:** 2026-07-24 · **Status:** validated via 5 parallel best-practices research passes (dated 2025–2026 sources). **Mandate (Artur):** architect for **millions of users / artworks / visits**; nothing may block future scale; no rewrite-every-few-months. **Guardrail:** build Phase 1 SIMPLE, but bake in the seams so scaling is *additive*.

> **Verdict:** the port-first plan (`flow-screens-spec.md` + `prior-art-reuse.md`) is **~85% scale-ready**. Foundation (Supabase/Postgres + Vercel/Next 16 + Stripe + Gelato) is correct for a **read-dominated POD shop** (millions of visits/artworks, tiny write volume = orders). Every scale lever is **additive within this stack** — nothing here structurally forces a rewrite. Required: **1 rewrite-class fix + ~20 cheap seams**, all in Phase 1.

---

## ⛔ The ONE rewrite-class defect to fix in Phase 1
**Inline `podProvider.createOrder` inside the Stripe paid-webhook → change to ENQUEUE-THEN-FULFILL.** This contradicts Stripe's own guidance (a webhook must only *verify → persist/enqueue → 2xx*; a hung Gelato call risks Stripe timeout → retries → load amplification; a "DLQ status column" is not a queue). Fix (cheap, additive):
- **`fulfillment_jobs` table** = the outbox AND the DLQ (`order_id` unique, `status` pending/running/done/failed, `attempts`, `next_attempt_at`, `last_error`). Insert the job **in the same DB transaction as `markOrderPaid`** — closes the dual-write hole (paid-but-never-fulfilled).
- **Webhook** returns 200 after two fast DB writes (dedupe insert + order-paid+job in one txn).
- **Worker** drains it: Phase-1 = **Vercel Cron → Route Handler** polling `SELECT … WHERE status='pending' AND next_attempt_at<=now() FOR UPDATE SKIP LOCKED LIMIT n`, exponential backoff, `failed` terminal state; calls the idempotent `podProvider.createOrder`. **Swap the drain to Vercel Queues later** (still beta + DLQ-less in 2026) — worker-internal change, not a rewrite.
- Keep BOTH: `webhook_events` unique-insert (Stripe redelivery dedupe) AND `fulfillment_jobs` (dual-write durability) — different problems. Keep idempotent Gelato createOrder by stored `vendor_order_id`. Keep the reconciliation cron (belt-and-suspenders; Gelato retries only 3×/5s).
- Sources: Stripe.dev queue-based reconciliation + resilient-webhook-DLQ blogs; AWS transactional-outbox guidance; Vercel Queues docs (2026-06-30).

---

## Seam register — Phase-1 impl → scale target (all additive)

### A. Read-path (Next 16 + Vercel) — catalogue + PDP are highest-traffic
| Seam (Phase 1) | Scale target | Why |
|---|---|---|
| `cacheComponents: true` in `next.config.ts` **day 1** | PPR/CDN static shell | flips whole app to Partial-Prerender model → caching later is a directive, not a refactor |
| Catalog reads carry **`use cache` + `cacheTag('catalog',\`product-${id}\`)` + `cacheLife`**, return **plain serializable DTOs** | `use cache: remote` / Vercel Runtime Cache | DTO seam lets cache tier move in-memory→remote→CDN without touching callers |
| **`revalidateCatalog(tags)`** + a protected route, **stubbed**, wired to the price/stock sync job | tag-based global purge (~300ms) | invalidate on price/stock change, not TTL guessing |
| **All read-path DB via Supabase transaction pooler (6543)** — never direct 5432 | Fluid Compute `attachDatabasePool` | connection-exhaustion is THE serverless-Postgres failure; one-line guard |

### B. Supabase / Postgres
| Seam (Phase 1) | Scale target | Why |
|---|---|---|
| `DATABASE_URL` = **pooler 6543 (transaction mode)**; `DIRECT_URL` = 5432 (migrations only) | dedicated PgBouncer | tx mode = no prepared statements (configure query builder) |
| **`orders`/`order_items` partitioned by month (RANGE on `created_at`) from day 1** (pg_partman later) | detach-old-partition archival | converting a live multi-M-row table later is painful; free now |
| **Keyset pagination + composite `(sort_col, id)` indexes** baked into the data layer (never OFFSET); **FTS GIN index** on artworks | flat latency at any depth | OFFSET page-10k = 8200ms vs keyset ~flat |
| **RLS policy template:** `(select auth.uid())`, `TO authenticated`/`anon`, indexed predicate; `get_advisors` pre-deploy gate | — | naive RLS = per-row function over millions; wrapped = 178,000ms→12ms. Orders = `service_role` (bypasses RLS) |
| **Read/write client split** (`dbRead`/`dbWrite`) in the data layer | Read Replicas + geo-routing (dashboard toggle) | enabling replicas later = config, not code sweep |
| Write ceiling = single primary → 16XL, then **Multigres** (far future) | — | irrelevant for order volume for years; escape hatch is inside Supabase |

### C. Search & discovery
| Seam (Phase 1) | Scale target | Why |
|---|---|---|
| **`SearchProvider` interface** (mirror `PaymentProvider`/`PodProvider`); Phase-1 **`PostgresSearchProvider`** (stored `tsvector` GIN + `pg_trgm` fuzzy + facets via GROUP BY; **populate the `facets` field** even if simple) | **Typesense** (hybrid keyword+vector) | FTS is capacity-fine to tens of millions of rows but hits a **feature** wall early (no BM25/IDF ranking, no typo tolerance, weak facets) — and browse-by-style/room/mood **is** faceting |
| **Dormant index-sync outbox** (`enqueueIndexSync(artworkId, op)` — no-op/log or `search_index_outbox`) | CDC/outbox → Typesense index | Postgres stays source of truth; index is a projection |
| **`similarTo` reserved in `SearchQuery` type** → `NotImplemented` now | pgvector (HNSW, enough to ~100M) **or** Typesense vector | "more like this" / NL search is an additive column/provider swap |
> **Decision recorded:** target engine = **Typesense** (built-in hybrid keyword+vector, ~95% cheaper than Algolia, self-hostable). **NOT** Algolia (cost explodes at millions of searches) or Elastic/OpenSearch (ops-heavy). **Supabase does NOT support ParadeDB/`pg_search`** → path is `tsvector → external engine`, not in-Postgres BM25.

### D. Images / assets (was the biggest under-spec — latent rewrite risk, now sealed)
| Seam (Phase 1) | Scale target | Why |
|---|---|---|
| **Two records per artwork:** `print_master` {url permanent+public, format tiff/png/jpeg **never webp**, w/h px, dpi, color_space} + `web_source` — opaque keys, not vendor URLs | — | print path (permanent public, Gelato fetches at order/reprint) and web path (optimize/rewrite) have **opposite** requirements; fusing them broke the museum CDN. `print_master` is the ONLY thing `PodProvider` reads — never through an optimizer |
| **`AssetStore` interface** (put/get/publicUrl/signedUrl), S3-shaped; Phase-1 `SupabaseAssetStore` | `R2AssetStore` (S3-API drop-in) | R2 = **$0 egress** (S3 egress = the cost bomb for a public catalogue); business logic never calls `supabase.storage` directly |
| **`ImageDelivery.derivativeUrl(key,{w,h,fit,format,quality})`** — single choke point for EVERY web `<img>`/PDP-zoom/thumb/in-room; Phase-1 = trivial Next custom `loader` | **Cloudflare Images** (R2 origin, bill per unique transform) | **do NOT use Vercel's default `<Image>` optimizer as delivery** — documented cost blow-up, teams cut 80% moving off it |
| **`ingest(assetId)` enqueue-shaped** from day 1 (Phase-1 = inline/one worker); pipeline `validate(res/DPI/format)→optional upscale→derive→publish master→ready`; **content-addressed keys (sha256)**; **dead-letter/`ingest_failed` state** | Cloudflare Queues + workers | CAS = idempotent/resumable + dedupe; never synchronous on request path at scale |
> **Decision recorded:** target = **Cloudflare R2 (masters + web originals, public custom domain) + Cloudflare Images (transforms)**; Supabase Storage stays for **user-private/auth-scoped** uploads only. Phase 1 needn't deploy R2 — it must not build anything that assumes it won't.

### E. Commerce spine (global-ready)
| Seam (Phase 1) | Scale target | Why |
|---|---|---|
| **Enqueue-then-fulfill + `fulfillment_jobs` outbox + cron worker** (the ⛔ fix above) | Vercel Queues | the one rewrite-class fix |
| **Stateless client-side cart** (localStorage: `{pod_product_uid, qty}` only, **never prices**); server **revalidates price+shipping via live Gelato quote at checkout**; **NO `guest_carts` table** | — | server-side per-guest rows = table bloat at millions, zero conversion benefit; trustless-by-design cart |
| Order carries **`email` + nullable `user_id`** (account later back-fills `user_id` where email matches) | progressive account | guest→account with no data loss |
| **Explicit `currency` column** per order/line (+ integer minor units); regional POD UID columns (`_us`/`_au`) | Stripe Adaptive Pricing + multi-settlement | don't bake USD into semantics → EU/AU expansion = config toggle, not migration |
| `PaymentProvider`/`PodProvider` = **3-event normalized dictionary**, Stripe-specifics (raw-body verify, session, `apiVersion` pin) stay **concrete inside the impl** | swap Przelewy24/Printful | right seam, not over-abstraction; don't abstract the webhook route itself |

---

## AI — architecture & evolution (validated 2026-07-24)
**Almost all AI in Latenca enters through TWO chokepoints + one shared gateway** — keep those clean and AI's evolution is additive, not a rewrite.
- **Chokepoint 1 — Advisor provider seam** (`BriefParserPort` / advisor provider): everything conversational/discovery. **Thin → full is a dial-up, not a rewrite:** today the LLM only parses the brief and a **deterministic ranker** does the work; going "100% API" (Claude etc.) = the LLM becomes a **tool-calling agent over the SAME deterministic functions (`rank`/`fill_wall`), which become its tools.** The thin-AI investment is the tool layer full-LLM sits on — nothing wasted. Even "full LLM" for a shop stays **grounded via tool-calling** (never invents products/prices — tools/POD/DB are the source of truth; 2026 best practice). What changes = cost/latency/ops (managed by credits/limits/streaming), not the foundation.
- **Chokepoint 2 — `ingest` pipeline**: everything about creating/understanding art — **generation** (templated → full engine, via `ArtworkSource`/D-020), **auto-tagging** (style/mood/room/color via vision model — essential for a millions-artwork catalogue), **embeddings** (CLIP → pgvector/Typesense for semantic + "more like this", `similarTo` reserved in `SearchProvider`), **moderation/IP-safety**, **upscaling** (AI-print quality gate). A generated image is just another asset flowing through `ingest` + `AssetStore` (R2) — async queue, not the hot path. Adding writes/assets/cost goes through scale-designed pipelines, not the millions-of-reads path.

**Two cheap AI seams to NAME in Phase 1 (not build):**
1. **`ModelProvider` / AI-gateway** — route ALL model calls (chat, vision-tagging, generation, embeddings, copy) through ONE managed door (Vercel AI Gateway: swappable `"provider/model"`, fallbacks, rate limits, cost tracking). Mirrors `PaymentProvider`/`PodProvider`/`AssetStore`. Without it, each future AI use scatters keys + cost across the codebase.
2. **`ai_usage` / `generation_logs` table** — per-operation/per-order AI cost visibility (Artur's cross-project convention). Cheap now, essential at scale.

**Maturity ladder & readiness:** MVP = thin advisor (✅ seam) · Near = auto-tag + embeddings + semantic search + full tool-calling advisor (✅ ingest stages + SearchProvider + advisor seam) · Later = generation (templated→engine) + personalized generation (✅ ArtworkSource + ingest) · Frontier = multimodal advisor (photo-as-analytical-input, NOT AR) ⚠️ needs a vision-input seam parallel to brief-parse · **agentic commerce** (external AI agents discover us, checkout stays ours) ⚠️ needs a structured product feed later (data model is the substrate) · ML-ranking ⚠️ **needs behavior-event logging started when we want it** (can't backfill history) — decide when.

**Verdict:** AI concentrates into advisor + `ingest` + a model-gateway → evolution = flip a seam + add a pipeline stage + manage cost, never a rewrite. Naming the two seams above makes it airtight.

## Explicitly DEFERRED (do NOT build in Phase 1 — additive later, seams already in place)
`use cache: remote` / Runtime Cache · `generateStaticParams` prerender lists · per-user `<Suspense>` price/cart splits · Read Replicas provisioning · Typesense cluster · pgvector/semantic search · R2 + Cloudflare Images deployment · async ingest queue + workers · Vercel Queues drain · Adaptive Pricing / multi-currency settlement · Multigres. **Each slots in on top of a Phase-1 seam — none require touching business logic.**

## Net
Phase 1 stays simple; it just ships with: `cacheComponents` on + tagged cacheable DTO reads + invalidation stub · pooler URL + partitioned orders + keyset/indexes + RLS template + read/write split · `SearchProvider` + dormant index outbox · `AssetStore`+`ImageDelivery`+`ingest` seams + two-record assets · **enqueue-then-fulfill + `fulfillment_jobs` outbox + cron worker** · stateless client cart · explicit `currency`. That converts "scale to millions" from a rewrite into config + additive workers.

## Related
`flow-screens-spec.md` · `prior-art-reuse.md` · plan `docs/plans/2026-07-24-001-feat-phase1-single-piece-shop-plan.md` (§Scale) · skills `pod-fulfillment`/`payments`/`next-guidelines`/`supabase-dev-guidelines`.
