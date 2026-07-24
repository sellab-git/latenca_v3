# Latenca — Flow & Screens Design Spec (v1)

**Date:** 2026-07-24 · **Status:** DRAFT for Artur's review · **Supersedes for build:** consolidates `reconciliation-with-18.md` (D-047 refined), `unified-flow-architecture.md`, `auth-onboarding.md`, and the 6 live teardowns (`docs/teardowns/`). Feeds `dev-plan` / writing-plans.

> This is the definitive spec for the fresh flow + screens pass, built on the Ideogram/shadcn `_shell`. It reflects everything decided in the 2026-07-24 brainstorm + market research (Mixtiles, iamfy, Displate, Redbubble, Juniqe, Andy okay — all driven live).

---

## 0. Scope & guiding priority

- **PRIMARY PATH = single artwork (N=1).** Most buyers get ONE piece (memory `single-piece-is-primary-path`; confirmed across all 6 teardowns — the single-piece PDP is every player's spine; nobody does curated composition). The single-piece path must be **first-class, clean, and shortest to cart.**
- **Wall composer = differentiator / optional layer**, done well and modernly — but **N=1 pays no complexity tax** for the multi-piece machinery.
- **MVP boundary (D-030):** shop spine + advisor. The advisor is the ONLY AI moment. **Recolor (warm/gallery) is the LAST step.**
- **Non-negotiables:** shadcn from day 1 · reuse `_shell`, grep before authoring · guest-first · POD = source of truth · Stripe behind `PaymentProvider` · no AR · no open AI generation in MVP (generation = future seam via `ArtworkSource`) · no free drag.

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
- **Pickers:** Material · Size (· Frame) — segmented (`SegmentedControl`). **Live price on size**; **variants availability-gated** per POD × destination (unavailable = disabled).
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
- **Deterministic ranking (not LLM)** for the pick order, grounded in real product data. AI = discovery + composition; **checkout stays ours** (OpenAI killed Instant Checkout → discover via AI, pay in our own checkout).

---

## 4. Data model (DAY 1 — retrofit = full rewrite)

`ARTIST` (first-class, even if attribution-only) · `ARTWORK` (`source` + `collection`, hi-res master, tags, `allowed_tones`/`allowed_crops`, **no price**) · `DERIVATIVE` (appearance recipe) · `PRODUCT/VARIANT` (virtual SKU = artwork × size × material × mat × frame, **price computed**) · `SET/WALL` (packages N pieces — the Project) · `ORDER/ORDER_LINE` (frozen at purchase) · `PAYOUT/MODERATION` (phase-2 seam). Keep the **generation seam** (`ArtworkSource` / D-020 vendor abstraction) unused in MVP.

**Pricing:** gross-up `net = (Gelato_cost + fixed) ÷ (1 − margin% − artist% − commission%)`; **Gelato = source of truth per SKU** (fetched at build); each extra piece ships ~€0.29 (sets economics); USA ≈ 2× EU margin; artist cap ~40%, margin floor.

---

## 5. Commerce work-order (audit D1–D11 = MVP backend)

Shared **Catalog Engine** (⚠️ Home filters are a verified MOCK — must be built) · **live Gelato shipping quote** (no flat rate) · **Stripe Tax** (tax-exclusive) · **availability per variant × destination** · **deterministic pick ranking** (not LLM) · zero-results always has an exit · **max 12 pieces** · itemized cart, no cross-sell spam · context-scoped chat-chip registry (wall/piece/pick).

---

## 6. Conversion patterns (from the 6-source scan → apply on the single-piece path)

Decision-guidance labels ("Most Popular"/"Best Value") · progressive config (frame later) · social proof (rating + reviews) · tasteful urgency (limited/countdown — not spammy) · cross-sell / volume incentive · premium material ladder (→ Gelato substrates) · geo delivery estimate · (optional, on-brand) an **artist story / cause-impact** angle. **These levers — not the wall builder — carry most single-piece conversions.**

---

## 7. Explicitly OUT (MVP)

No AR / room compositing · no open AI generation (advisor only; generation = future seam) · no free drag · no forced account · no multi-address (→ separate orders) · not a Redbubble-style design-on-everything · not a maximalist wall builder before the single-piece path is excellent.

---

## 8. Open items (decide / parameterize later — do NOT fabricate)

- **Preset layout library:** which N are supported, how many curated layouts per N — must be **curated + verified**, not invented (I fabricated a subset earlier; corrected).
- Grid curation level; per-piece vs wall material/frame granularity edge cases.
- Multi-address (future); cause/impact angle (optional, on-brand); B2B/gifts homes.
- **Auth account method** (social / password / OTP — **magic-link excluded**, memory `no-magic-link-auth`); still guest-first regardless.
- Recolor palette (warm/gallery) — the LAST step.

---

## 9. Build sequence (decomposition — each phase = its own dev-plan)

1. **Single-piece path** (PRIORITY): catalogue → PDP → cart → guest checkout, with the **data model + POD (Gelato) + payments (`PaymentProvider`/Stripe)** wired. This alone is a shippable shop for the 80% case.
2. **Wall builder + advisor:** the tray, curated layouts, per-slot quick-edit, advisor-composes-into-slots. The differentiator layer.
3. **Recolor** (warm/gallery) — swap `globals.css` CSS variables.

Each phase: `dev-plan` → build on `_shell` → verify in browser (Playwright/`pnpm build`) → auto-push.

---

## Related
`reconciliation-with-18.md` (D-047 + migration map) · `unified-flow-architecture.md` · `auth-onboarding.md` · `docs/teardowns/{mixtiles,iamfy,displate,market-scan}.md` · `docs/CONCEPTS.md` · skills `pod-fulfillment` + `payments` + `next-guidelines`.
