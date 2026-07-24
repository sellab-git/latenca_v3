# Latenca — Flow & Screens Design Spec (v1)

**Date:** 2026-07-24 · **Status:** DRAFT for Artur's review · **Supersedes for build:** consolidates `reconciliation-with-18.md` (D-047 refined), `unified-flow-architecture.md`, `auth-onboarding.md`, and the 6 live teardowns (`docs/teardowns/`). Feeds `dev-plan` / writing-plans.

> This is the definitive spec for the fresh flow + screens pass, built on the Ideogram/shadcn `_shell`. It reflects everything decided in the 2026-07-24 brainstorm + market research (Mixtiles, iamfy, Displate, Redbubble, Juniqe, Andy okay — all driven live).

---

## 0. Scope & guiding priority

- **PRIMARY PATH = single artwork (N=1).** Most buyers get ONE piece (memory `single-piece-is-primary-path`; confirmed across all 6 teardowns — the single-piece PDP is every player's spine; nobody does curated composition). The single-piece path must be **first-class, clean, and shortest to cart.**
- **Wall composer = differentiator / optional layer**, done well and modernly — but **N=1 pays no complexity tax** for the multi-piece machinery.
- **MVP boundary (D-030):** shop spine + advisor. The advisor is the ONLY AI moment. **Recolor (warm/gallery) is the LAST step.**
- **Non-negotiables:** shadcn from day 1 · reuse `_shell`, grep before authoring · guest-first · POD = source of truth · Stripe behind `PaymentProvider` · no AR · no open AI generation in MVP (generation = future seam via `ArtworkSource`) · no free drag.
- **★ Strategic guardrails (from prior-art review — `prior-art-reuse.md`):**
  - **The real constraint is DISTRIBUTION / CAC, not the product.** Cold CAC ~$60–80 > ~$40 single-print margin = loss per order; only bundles/whole-walls turn positive. The build is necessary but NOT sufficient — a distribution plan + the sets economics are the survival questions. Don't treat the build as validated demand.
  - **Ship the spine FAST; every prior Latenca/Printly/DoradcAI attempt died at over-planning, zero shipped.** Resist schema-for-every-future-pivot. Phase 1 = a working single-piece shop, nothing more.
  - **The backend is NOT greenfield — port ~80% from `prior-art-reuse.md`** (Motowalls Gelato+Pricing Engine, Printly orders/webhooks/verification-log, Pawtraits production plumbing). Re-anchor EUR/VAT → USD + Stripe Tax.

---

## 1. Product model — the builder (D-047, refined)

The builder holds **N = 1…12 independently-configurable pieces; the wall composition is an OPTIONAL layer, not a mandatory frame.**

### 1.1 Two states a set of pieces can be in
- **Free (default):** every piece fully independent. Shown as a **list/gallery of single items** (e.g. 10 different gifts) OR a **tidy grid on one wall** (e.g. 10 verticals @ one size). List-vs-grid = a *view* toggle; **full per-piece control** in both.
- **Designed wall (opt-in):** a curated cm-true layout. **Size = whole-wall scale; per-piece = material/frame only.** Chosen when the customer wants us to arrange a beautiful wall.

### 1.2 Per-piece configuration (always free)
Art · orientation · **size** · material · frame — each piece independent. The ONLY constraint: choosing a **designed wall** moves size to wall-scale.
- **Size** = real POD dimensions (never hardcoded, no "S/M/L" tier names in code — actual cm/in from Gelato). **N=1 → free size pick from the full available list** (this IS the single-print size picker). N≥2 designed → wall scale; grid → per-piece.
- **Orientation fitting rule:** Portrait art → portrait or square slot · Landscape → landscape or square · Square → square only. **`allowed_crops` (per-artwork metadata) is the final gate** (a portrait with no good 1:1 crop can't take a square slot).

### 1.3 Layouts & arrangement (designed-wall state)
- **★ PORT folder 18's layout engine (decided 2026-07-24).** `18. Latenca/prototypes/mockups/shared/wall-layouts.js` = a complete, cm-true, **27-layout** engine (counts 3–12, 2–3 named curated presets each: Triptych / Hero & Stack / The Joyful Five / grids…), authored in its own cm grid from Mixtiles *ideas* (not copied geometry), with generator `gen-wall-layouts.py` and **frozen rules `18/docs/wall-spec.md`** (D1 size, D4 counts, D5 orientation — the origin of our rules). It's **data + logic (not UX), so it transfers as SPEC** (governing rule). **To do on port:** add N=1 & N=2, add the frames/materials layer (18 parked it — we want full Gelato), expand presets per N via the generator, map its **9-size vocabulary** (Portrait/Landscape/Square × 3 tiers) onto real Gelato sizes. Our **Free state (§1.1) sits alongside** this engine.
- **Curated layouts per N**, spanning **designed compositions ↔ grids**. **No free drag** (layout dictates geometry).
- **"+" (add slot)** = additive/safe (existing pieces stay; appends one) → no surprise re-flow. **"Browse layouts / change arrangement"** = shows all curated layouts for the target N (incl. non-additive) and re-flows *by explicit choice*.
- **Reorder = tap-swap** ("swap position, tap another slot" — from iamfy), never drag.
- **Remove slot** → re-flow to the curated N−1 layout; the removed artwork → **History** (not Liked — intent not implied).
- Best-fit mapping on re-flow: artworks map to compatible slots by orientation; an artwork with **no compatible slot → returned to the tray (History), slot left empty, gentle notice.**

### 1.4 Sources — one "+" affordance, many tabs
A single **"Add to wall"** control opens the **tray**: **Catalogue · Liked ❤ · Collections · Recommended · History · [AI-generate — future] · [Upload — future]** + **Clone**. New sources become new tabs, never a new builder. **Duplicates allowed only on explicit user action** (system/AI never suggest the same piece twice).

### 1.5 Projects & cart
- Each wall = a **Project** (resumable; "Your projects"). **One order = one shipping address** (want 3 addresses → 3 orders; multi-address parked).
- **One cart**, multiple projects/pieces, itemized.

---

## 2. The screens

Three core surfaces + a detail overlay. All on `_shell` (AppSidebar, MobileNav, Composer, SegmentedControl, ImageActionsMenu, theme). **Grep `_shell` before authoring any new component.**

### 2.1 Catalogue / Landing (Home)
- **Catalogue-forward** + search on top; **advisor = a docked, persistent, openable panel — never a gate** (D-022/D-046). "Shop is the floor, advisor is the front door."
- **Browse lenses** (room / style / mood / collection). Every card is **likable ❤**. Click a card → **detail overlay** (§2.2).
- **Personalization:** a persistent **taste profile**, fed by EITHER a free-text brief OR a structured quiz (both guest, no account) — surfaces a "Your style" context.

### 2.2 Single-piece PDP — the PRIORITY (detail overlay = reuse `image-detail`)
The mature pattern matched from Displate/Andy okay/Juniqe, on our design:
- Big image + context/room shots + **"drag to move" tilt**; **Flat default, NO AR**.
- **Pickers:** Material (**all Gelato substrates: paper · canvas · wood · metal · acrylic · foam** — A2) · Size · (· Frame) — segmented (`SegmentedControl`). **Live price on size/material** (Pricing Engine, §4); **variants availability-gated** per POD × destination (unavailable = disabled). Single-piece PDP may offer a wider size range than the wall's 9-size layout vocabulary.
- **Decision-guidance labels** on sizes ("Most Popular" / "Best Value") — literal "sell confidence, not choice."
- **Progressive config** — keep the PDP clean; frame/extras can be a secondary step.
- **Social proof** (rating + review count) · **artist / collection attribution + story**.
- **Cross-sell** ("frequently bought together") + **volume/quantity incentive**.
- **Geo delivery estimate** (live Gelato). **Add to cart** (guest).
- **Optional escalation:** "Build a wall with this" → opens the wall builder with this piece as N=1. The single-piece buyer never has to touch the builder.

### 2.3 Wall builder (differentiator, optional)
- **"The product page IS the wall."** Enter with N=1 (from a PDP) or an empty slot.
- **Tray (§1.4) + slots + curated layouts + advisor docked.** Sticky **live set price**; **Add-all-to-cart**.
- Per-slot **QUICK EDIT** (from iamfy, on our design): swap art · size-by-orientation · material/frame per piece · tap-swap position · remove. Crop = drag-to-adjust within `allowed_crops`.

### 2.4 Cart → checkout
- One cart (multiple projects/pieces), **itemized, no aggressive cross-sell spam** (one tasteful module).
- **Guest-first, OUR OWN checkout** behind `PaymentProvider` (Stripe first) — express wallets, **live Gelato shipping**, **Stripe Tax** (tax-exclusive). **Identity = email at checkout only** (no forced account). Fulfillment on webhook, not redirect.

---

## 3. The advisor (surface spec — resolves GAP #3)

- **One persistent docked panel** (D-046), **never a gate** (D-022). Present on catalogue AND builder.
- **Two entry modes:** free-text brief + structured quiz → a **persistent guest taste profile**.
- **Output = a wall taking shape, NOT a list.** The advisor's picks **LAND in the curated slots** (hero slot first, supporting next) — delivering the composition iamfy only promises. Each placed piece carries a **one-line "why"** (advisor-as-designer). Refine via **regenerating chips incl. a negative escape**; visible **context chips** (room/style) editable.
- **Rules-based, NOT full intelligent AI (decided 2026-07-24 — B2):** the advisor **suggests from the available pool + fills slots** via **deterministic ranking/filtering** (taste profile + orientation/availability + curation rules), grounded in real product data. Full LLM composition = **too complex/expensive to maintain → out of MVP** (a light LLM only for parsing the free-text brief, optional). AI = discovery + slot-fill; **checkout stays ours** (OpenAI killed Instant Checkout → discover via AI, pay in our own checkout).

---

## 4. Data model (DAY 1 — retrofit = full rewrite)

`ARTIST` (first-class, even if attribution-only) · `ARTWORK` (`source` + `collection`, hi-res master, **`source_image_url` + pixel dims** for DPI→print-size, `allowed_tones`/`allowed_crops`, orientation, **no price**) · `DERIVATIVE` (appearance recipe) · **`VARIANT` = ONE GLOBAL table** keyed by (size × material × frame × extras), ~40–100 rows **not per-artwork** (port Motowalls `gelato_products`, `006_*.sql`), with **`pod_product_uid` + regional `_us`/`_au` stored per row (NEVER constructed — per-material UID formats are irregular)**, `production_cost_cents`, computed `display_price`; ARTWORK just supplies the print file + orientation · `SET/WALL` (packages N pieces — the Project) · `ORDER/ORDER_LINE` (two-table, **immutable snapshot columns**, dual status enums, tracked-only CHECK — port Printly `0020/0021`) + `order_costs` (real Gelato receipt for true margin) · `PAYOUT/MODERATION` (phase-2 seam, **drop for MVP** — we're single-seller not a marketplace). Keep the **generation seam** (`ArtworkSource` / D-020 vendor abstraction) unused in MVP. **All schema/plumbing: port from `prior-art-reuse.md`, don't re-author.**

**Pricing = an internal Pricing Engine (decided 2026-07-24 — A3). PORT `07. Motowalls/lib/pricing.ts` + `margin-config.ts` + `margin-calculator.ts`** (the one prior project that actually built it — Printly & Pawtraits only stubbed it; see `prior-art-reuse.md`). Formula: `netto = productionCost ÷ (1 − stripe% − returns% − marketing% − fixed% − targetMargin%)` → round UP to a **NICE_PRICE_GRID** (19/24/29…). Cost constants (Motowalls defaults): Stripe 3.5% / returns 5% / marketing 10% / fixed 10%; per-catalog target margin (posters/canvas 30%, premium 20%) — **all % are tunable, computed/validated from real Gelato costs, never fabricated.** **★ RE-ANCHOR EUR→USD:** drop the VAT-inclusive `×(1+VAT)` step → **pre-tax retail + Stripe Tax at checkout**; USA ≈ 2× EU margin. **Cost source (reconciled):** store per-variant `production_cost_cents` + a shipping table, refreshed by an **offline sync job**, and **verify with `POST /v4/orders:quote` at order time** (returns cost + shipping together) — never block the cart on a request-time price call (Gelato price API returns null for framed-canvas; no public flat shipping API). **Gelato = source of truth per SKU.** Materials = **ALL Gelato substrates (A2): paper · canvas · wood · metal · acrylic · foam.**

---

## 5. Commerce work-order (audit D1–D11 = MVP backend)

Shared **Catalog Engine** (⚠️ Home filters are a verified MOCK — must be built) · **Pricing Engine** (live Gelato product+print+ship costs → gross-up, §4) · **live Gelato shipping quote** (no flat rate) · **Stripe Tax** (tax-exclusive) · **availability per variant × destination** · **deterministic pick ranking** (not LLM) · **Wall layout engine** (ported from 18, §1.3) · **content-import pipeline** (source-agnostic — A1) · zero-results always has an exit · **max 12 pieces** · itemized cart, no cross-sell spam · context-scoped chat-chip registry (wall/piece/pick).

---

## 6. Conversion patterns (from the 6-source scan → apply on the single-piece path)

Decision-guidance labels ("Most Popular"/"Best Value") · progressive config (frame later) · social proof (rating + reviews) · tasteful urgency (limited/countdown — not spammy) · cross-sell / volume incentive · premium material ladder (→ Gelato substrates) · geo delivery estimate · (optional, on-brand) an **artist story / cause-impact** angle. **These levers — not the wall builder — carry most single-piece conversions.**

---

## 7. Explicitly OUT (MVP)

No AR / room compositing · no open AI generation (advisor only; generation = future seam) · no free drag · no forced account · no multi-address (→ separate orders) · not a Redbubble-style design-on-everything · not a maximalist wall builder before the single-piece path is excellent.

---

## 8. Decisions locked 2026-07-24 (Artur) + what stays open

**Locked this round:**
- **A1 — Content source = SOURCE-AGNOSTIC by design.** Undecided which first (artist partners / public-domain / self-generated), so the **data model MUST support multiple sources AND multiple add-methods** (`ARTWORK.source` + import pipelines). Don't hardcode one origin.
- **A2 — Materials = ALL Gelato substrates from day 1:** paper · canvas · wood · metal · acrylic · foam (whatever Gelato offers), driven from the Gelato catalog.
- **A3 — Pricing = an internal Pricing Engine** built on **real Gelato API costs (product + print + shipping)** grossed up (§4). The **% split (margin/artist/commission) TBD — computed from real prices, never fabricated.**
- **A4 — Auth = simple standard best-practice: social login + normal email/password** (guest-first until checkout; **magic-link excluded**, memory `no-magic-link-auth`). Confirm exact best-2026 pattern when building auth (Phase 1b); not blocking Phase 1.
- **B1 — Wall layout engine = PORT folder 18's `wall-layouts.js` + rules** (§1.3) — assessed, it's a strong start.
- **B2 — Advisor = rules-based** (suggest-from-pool + slot-fill), not full LLM (§3).
- **B3 — Wizard-of-Oz validation = dropped** (not needed for a rules-based advisor).
- **C1 — NO charity/cause angle.** · **C2 — Artist story = very small** (short bio max). · **C3 — Urgency = tasteful, not spammy.** · **C4 — Recolor = maybe revisit 18's lavender/violet later (TBD, LAST step).**
- **D — Parked (later):** multi-address (→ separate orders) · B2B · gifts · AI generation (future seam) · user uploads.

**Still genuinely open (parameterize when building, do NOT fabricate):**
- Pricing % values (margin/artist/commission) — tune from real Gelato costs (Motowalls defaults as starting point).
- Layout presets: add N=1/2, expand count per N via the generator, add frames/materials layer to the ported engine; map 18's 9-size vocab ↔ Gelato sizes.
- Exact auth provider set (Google/Apple/…); grid curation level; recolor palette.
- **⚠️ AI-print quality (if A1 self-generated):** does AI art at 70×100 @300 DPI look good on paper? Never tested in prior attempts → needs an upscaler in the pipeline **+ a real ~$25 test print before relying on AI as a source.**
- **Distribution / CAC plan** — the actual survival question (strategic guardrail §0); not a build task, but must not be ignored.

## 10. Prior-art reuse — the backend is ~80% portable
See **`prior-art-reuse.md`** (full port map from 5 prior projects). Headlines: **PodProvider** (Motowalls `lib/gelato.ts` bodies + Printly `lib/fulfillment/provider.ts` interface) · **Pricing Engine** (Motowalls `lib/pricing.ts`, re-anchor USD) · **variant table** (Motowalls `gelato_products`) · **orders schema + webhooks + idempotency** (Printly `0020/0021` + Motowalls webhooks) · **checkout hardening + circuit-breaker + plumbing** (Pawtraits) · **advisor rank/match** (DoradcAI) · **content seed** (17's CC0 catalog) · **Gelato empirical quirks** (Printly's 63-draft-order verification log — WEBP rejected, no auto-rotate, 4mm bleed, store-not-construct UIDs, permanent public print files). Fold these into the `pod-fulfillment` + `payments` skills before Phase-1 build.

---

## 9. Build sequence (decomposition — each phase = its own dev-plan)

1. **Single-piece path** (PRIORITY): catalogue → PDP → cart → guest checkout, with the **data model + POD (Gelato) + payments (`PaymentProvider`/Stripe)** wired. This alone is a shippable shop for the 80% case.
2. **Wall builder + advisor:** the tray, curated layouts, per-slot quick-edit, advisor-composes-into-slots. The differentiator layer.
3. **Recolor** (warm/gallery) — swap `globals.css` CSS variables.

Each phase: `dev-plan` → build on `_shell` → verify in browser (Playwright/`pnpm build`) → auto-push.

---

## Related
`reconciliation-with-18.md` (D-047 + migration map) · `unified-flow-architecture.md` · `auth-onboarding.md` · `docs/teardowns/{mixtiles,iamfy,displate,market-scan}.md` · `docs/CONCEPTS.md` · skills `pod-fulfillment` + `payments` + `next-guidelines`.
