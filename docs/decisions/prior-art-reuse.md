# Prior-art reuse — port map from Artur's earlier projects (2026-07-24)

**Purpose:** 5 prior projects mined (parallel agents) for **Phase-1 backend reuse** for Latenca v3. Verdict: **the commerce spine is NOT greenfield** — ~80% is portable from three prior Gelato/POD codebases in our exact stack. Two strategic warnings converged across projects (below) — read first.

> **⚠️ Aspirational-docs caveat:** these projects' own `CLAUDE.md`/specialist docs drifted from their code, and several claim "LIVE/production" that isn't true. **Trust the `lib/` + routes + migrations, not the prose.** Verify any transplant with a real Gelato-sandbox call before relying on it.

---

## ⚠️ Two strategic warnings (non-technical, apply to US)

1. **The binding constraint is DISTRIBUTION / CAC, not the product.** `16. Photolio/WERDYKT-2026-07-17.md` explicitly names Latenca as one of "**5 doors to the same category & the same wall**" and argues the moat is access to concentrated buyers, not the idea; print is a structurally decaying category; follower→buyer conversion ~0.01–0.15%. `15. Latenca/docs/00-status-strategiczny.md`: cold-traffic CAC ~$60–80 vs ~$40 margin on a single $59 print = **loss per order; only 3× bundles turn it positive.** → No code fixes this. Don't treat the build as validated demand; the sets/whole-wall economics + a real distribution plan are the actual survival questions.
2. **Every prior attempt stalled at PLANNING — zero shipped to production.** DoradcAI = rich docs + 3 code files. Ink&Say = Phase-0 scaffold. Book-About-You = "no code yet." 17. Latenca died after building only Home. Printly (3 iterations) never shipped. **The failure mode is over-planning / over-abstraction before the product exists.** → For v3: ship the single-piece commerce spine FAST, resist schema-for-every-future-pivot.

**Unverified technical risk (still open):** does AI-generated art at 70×100 @300 DPI actually look good on paper? Native AI ~1–4 MP vs ~98 MP needed; the "€25 test print" was deferred in 15 & 17 and never done. If A1 uses self-generated art → needs an upscaler in the pipeline **and a real test print before relying on it.**

---

## Prior-art map (what each is)

| Project | What it is | Value |
|---|---|---|
| **07. Motowalls** | **Near-production Gelato POD WALL-ART shop — our exact domain.** EUR/VAT, E2E-validated (Stripe→Gelato→shipped), paused. | ★ PRIMARY template — has the real **Pricing Engine** |
| **12. Printly** | Mature marketplace codebase (60 migrations, providers, tests), parked for v3. EUR. Marketplace (artist/royalty/moderation) = out of scope. | ★ Cleaner `PodProvider` abstraction + orders schema + **`GELATO_VERIFICATION_LOG` (63 draft orders)** |
| **01. Pawtraits** | Production POD (dog portraits), Przelewy24+Gelato, guest-first. Custom-generation flow; no variant-picker/cart. | Production-proven webhook/idempotency/circuit-breaker + **`POD_Fulfillment_Specialist.md`** (9 wall-art cats + UIDs) |
| **15. Latenca** | v1 — business/economics research + **real Gelato cost data (API 2026-07-17)** | Cost numbers for the Pricing Engine |
| **17. Latenca** | Next 16 app, Home only. **Source-agnostic catalog model + 16 CC0 museum artworks seed** | `lib/catalog.ts` shape + legal print-ready seed |
| **06. DoradcAI** | LLM-thin / deterministic-core advisor (docs) | `rank.ts`+`match.ts` template for our rules-based advisor |
| 13/14/19 | Book-About-You (ports-and-adapters, order state-machine), Ink&Say (harvest map, idempotent-webhook rules), 19 (scratch) | Arch patterns only |

---

## PORT MAP — what to lift, from where (all paths under `C:\AI biznes\`)

### PodProvider (Gelato behind our abstraction)
- **Bodies:** `07. Motowalls/motowalls/lib/gelato.ts` (current endpoints: order `order.gelatoapis.com/v4`, product `product.gelatoapis.com/v3`, `X-API-KEY`; `createGelatoOrder`/`getGelatoOrder`/`cancel`/`fetchGelatoPrices`/`searchGelatoCatalog`/`checkGelatoHealth`; **`resolveGelatoUid(product, country)`** for US/AU regional UID divergence). Pawtraits `01…/lib/gelato.ts` is a second confirmation.
- **Interface shape:** `12. Printly/printly/lib/fulfillment/provider.ts` (`FulfillmentProvider` = createOrder/getOrderStatus/cancel/getQuote + factory + shared exported `mapGelatoStage()` used by both poll & webhook; sandbox = `orderType:"draft"`; **quote-tier sort bug-fix: sort desc by qty, pick first ≤ requested**).
- **To do:** wrap the Motowalls bodies behind Printly's interface as `GelatoPodProvider`; add Printful as 2nd impl. None of the three actually had the abstraction — that seam is ours.

### Pricing Engine (the piece Printly & Pawtraits only stubbed)
- **Port `07. Motowalls/motowalls/lib/pricing.ts` + `lib/margin-config.ts` + `lib/margin-calculator.ts`.** Formula: `netto = productionCost / (1 − stripe − returns − marketing − fixed − targetMargin)` → round UP to a **NICE_PRICE_GRID** (19/24/29…). Cost constants: Stripe 3.5% / returns 5% / marketing 10% / fixed 10%; per-catalog target margin (posters/canvas 30%, premium 20%). `margin-calculator.ts` solves the free-shipping cart threshold algebraically.
- **★ RE-ANCHOR EUR→USD:** drop the VAT-inclusive `gross = netto×(1+VAT)` step → **pre-tax retail + Stripe Tax at checkout.** US ≈ 2× EU margin (15's data: cheaper print, no EU VAT on export).
- **Cost source (reconcile a real tension):** Motowalls uses `POST /v4/orders:quote` which returns **both production cost + shipping in one call** (with a `DEFAULT_ADDRESSES[country]` map to quote pre-address + region-bucketed fallback). BUT Pawtraits warns the older `product_prices` endpoint returns **null for framed-canvas** and there's **no public shipping API**. → **Resolution:** store per-variant `production_cost_cents` + a shipping table, refreshed by an **offline sync job** (harvest via Pawtraits `scripts/gelato-*.ts` / Motowalls approach), and **verify with `/v4/orders:quote` at order time**. Never block the cart on a request-time price call. Keep 15's real cost numbers as sanity checks.

### Variant model (virtual VARIANT with computed price)
- **Port `07. Motowalls/…/supabase/migrations/006_gelato_flat_pricing.sql`:** ONE global table (`gelato_products`) keyed by (size, material, frame, extras), ~40–100 rows (**NOT per-artwork**), columns `gelato_uid` + regional `_us`/`_au`, synced `gelato_cost*`, `markup_multiplier`, `display_price` (trigger-computed). ARTWORK only supplies the print file + orientation. Picker taxonomy: `07…/types/gelato-pricing.ts`; configurator read model: `lib/queries/configurator.ts`.
- **Store Gelato UIDs per variant, NEVER construct them** (Pawtraits: per-material UID formats are irregular — poster `flat_product_pf_…`, framed-canvas has `_ver_`, etc.). Add `size_cm` jsonb + `source_image_url` + pixel dims (for DPI→print-size).

### Orders schema + lifecycle
- **Port `12. Printly/…/migrations/0020_orders_baseline.sql` + `0021`:** two-table `orders`/`order_items`, integer cents, **dual orthogonal status enums** (`order_status` buyer-lifecycle vs `fulfillment_status` vendor), `fulfillment_metadata jsonb`, **immutable snapshot columns** on order_items (title/sku/size/material/frame/vendor_sku/unit_price frozen at checkout), `dispatch_after=now()+1h` grace, **tracked-only CHECK** (shipped/delivered ⇒ tracking_number present). Drop all `artist_*`/`payout_*`.
- Add Motowalls' **`order_costs`** table (real Gelato receipt: productsPrice/shippingPrice/vat/total) written after POD order = true-margin reporting.
- Multi-item cart: none of them had one (Pawtraits single-line) — design `orders`+`order_items` fresh.

### Checkout (security-critical — same rules in all 3)
- `import "server-only"` NOT `"use server"` (Printly bug: exposed every export as public POST bypassing consent).
- **Never trust client price** — server re-derives retail from variant/POD cost; client value = tripwire → `PRICE_MISMATCH`.
- `buyer_id` from Supabase session, **never client** (IDOR). Guest = `buyer_id NULL` + `customer_email`.
- Re-validate `gelato_uid` vs DB; **verify a real (non-mock) print_file_url exists** before allowing purchase; lock Stripe `allowed_countries` to the quoted country; cart in `metadata`.
- **Rate-limit the checkout endpoint before `sk_live`** (Printly's explicit unfixed gap).

### Webhooks (Stripe + Gelato)
- **Idempotency = unique-insert into a `*_webhook_events(event_id PK)` table, ON CONFLICT → ack** (all three). Printly's **`{count:"exact"}` race guard**: if the paid webhook beats the order-insert commit, throw 500 → Stripe retries (never silently drop a paid order).
- **Fulfillment on the paid webhook, not redirect.** Latenca (no generation gate) fires `podProvider.createOrder(...)` inside the webhook, in its own try/catch + DLQ/`ERROR` status so a Gelato failure never 500s Stripe. **Write-then-email** (never email-then-write → retry dup emails).
- **Gelato webhooks are NOT signed** → auth via **secret path param** (Motowalls `[secret]/route.ts`) or shared-secret header (Printly). Events `order_status_updated` + `order_item_tracking_code_updated`; once-only shipped email guard.

### Reusable plumbing (stack-matched Next 16 / Zod 4 — port day one)
`api-response.ts` (`apiOk/apiError/apiRateLimited`) · `validation.ts` + `validateBody` (Zod) · `rate-limit.ts` (+ Upstash Redis sliding-window w/ in-memory fallback) · `circuit-breaker.ts` (Pawtraits — wrap POD/payment providers) · `webhook-idempotency.ts` · `admin-auth.ts`/`admin-token.ts` (HMAC cookie) · cron `Bearer CRON_SECRET` · **money value objects** (integer minor units, `Money{amount,currency}`, throw on currency mismatch — Printly `lib/money/`). Present in Motowalls, Printly, and/or Pawtraits.

### Advisor (rules-based — DoradcAI template)
- `06. DoradcAI` split: pure **`lib/advisor/rank.ts`** (`rank(pool, params)→ordered[]`, deterministic, unit-tested) + **`lib/advisor/match.ts`** (`fill_wall(slots, pool, constraints)`), mirroring its `lib/banks/compare.ts`+`match.ts`. **LLM = ONE bounded, optional step** `parse_brief(text)→{style,palette,room,budget,slotCount}` behind a swappable `BriefParserPort`; everything downstream deterministic; falls back to structured UI inputs if the LLM is off/rate-limited. Rate-limit + cache the parse (Redis 24h). **Rule: the LLM never ranks/prices/invents art** — tools/POD/Supabase are the only source of facts.

### Content seed
- Port `17. Latenca/web/src/lib/catalog.ts` (source-agnostic `Artwork→Product`, `source`+`collection` tags, minor units, `slugify`) + seed dev catalog from `17…/catalog-demo/catalog.json` (16 Art Institute CC0 works, IIIF URLs, pixel dims, precomputed max print size). **Legal note:** free-stock (Unsplash/Pexels) forbids selling as prints; museum CC0 is safe; pure AI art has no copyright. **Museum CDN blocks `next/image`** → rehost seed images on our own Storage/CDN.

---

## Gelato empirical quirks (battle-tested — saves weeks)
From Printly `docs/architecture/GELATO_VERIFICATION_LOG.md` (63 draft orders) + Pawtraits `specialists/POD_Fulfillment_Specialist.md`:
- **WEBP silently rejected** (HTTP 200, 0 previews); AVIF/HEIC likely too → accept only JPEG/PNG/TIFF/PDF.
- **No auto-rotate** — print-file orientation MUST match SKU orientation (else silent band-crop).
- **Silent center-crop** on aspect mismatch; **silent auto-stretch** of undersized files (no DPI rejection at draft) → enforce min source resolution yourself.
- **~4 mm bleed** each edge (poster/foam/framed/metal): submit trim + 8 mm. **Canvas needs baked-in wrap** (slim 2 cm → +35 mm/side, thick 4 cm → +55 mm/side).
- **`orderReferenceId` NOT reliable for dedup** — Gelato creates dupes on retry; dedup by stored `vendor_order_id` before `createOrder`.
- Shipping quote needs a **separate endpoint with full address**; product-price endpoint returns cost only, shipping 0. **Framed-canvas price API returns null** — backfill from dashboard CSV.
- **Print-file URLs must be permanent + public** (fal.ai/Replicate URLs expire → failed order): persist the print asset first. Keep a high-res 300 DPI `print_file_url` distinct from the web preview.
- **Regional UID divergence** (US/AU) is real — plan `gelato_uid_us`/`_au` from day 1.

## Related
`flow-screens-spec.md` (§4/§5 reference this) · `pod-fulfillment` + `payments` skills (fold these patterns in) · `reconciliation-with-18.md`.
