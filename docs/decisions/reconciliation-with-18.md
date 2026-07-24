# Reconciliation with folder `18. Latenca` — migration map

**Purpose:** folder 18 (`latenca_v2`, mockup phase, design-complete) holds Latenca's mature **LOCKED** product architecture (DECISIONS D-001…D-051 + a separate commerce track D1–D11 in `audit-wall.md`, VISION, PRODUCT_BIBLE, mockups, its own competitor Analizy). Folder 20 is the clean shadcn rebuild. **18's strategy governs the product; 20 delivers the engineered rebuild + fresh 2026 evidence.** This is the migration map → then `dev-plan`.

**Status:** complete (full 18 review done 2026-07-24). One-liner: *the strategy transfers wholesale; the display/AI-ambition layer has an internal fault line that Artur's 2026-07-24 clarifications resolve in favor of the later locks.*

## ⛔ GOVERNING RULE — how to treat folder 18 (Artur, 2026-07-24)
**18 is an IDEA / input, NOT a 1:1 copy target.** Artur is not confident in 18's actual *output* — its **flow, screen-to-screen switching, design decisions, UX/UI**. So:
- **Transfers as SPEC (durable, proven):** strategy + decisions (D-0XX) · data model · pricing formula · commerce logic (audit D1–D11) · KB approach. These are load-bearing and re-usable.
- **Treated as IDEAS ONLY (re-think fresh):** the flow, the screens, screen-switching, UX/UI, the mockups (`05-wall`/`04-advisor`). **Harvest for ideas, never replicate 1:1.**
- **The whole flow + screens + UX must be re-thought from scratch under:** (a) our *current* flow decisions, (b) the **new Ideogram-derived shadcn design system** (`src/app/pilot/_shell/`) — 18's lavender-on-cream HTML mockups are a different system, (c) everything we've since decided. Where this doc says "bring mockup patterns," it means *as input to a fresh design*, not as files to port.

> **Doc-numbering note:** `DECISIONS.md` runs **D-001…D-051** (no D-047 — reserved for the still-open "single artwork vs N-piece wall" question). A **separate** track **D1–D11** lives in `docs/audit-wall.md` (commerce: shipping/tax/cart/catalog-engine). Folder-20 `CLAUDE.md`'s "decisions D1–D11" refers to that commerce track; the big registry is D-0XX. (CLAUDE.md wording to fix.)

## Artur's clarifications (2026-07-24) — reconciled vs 18
| Clarification | 18's stance | Verdict |
|---|---|---|
| **(a) MVP AI = advisor; keep a SEAM for future generation** (Mixtiles-style templated OR full external engine → buyable print) | D-020 (swap-able vendor abstraction) + VISION Krok 3/4 + LOCKS backlog already hold exactly this seam; generation is explicitly not-MVP | ✅ **Fully aligned** — the seam is already a principle. Carry `source`/`ArtworkSource` + model-abstraction boundary into folder 20 from day 1; don't build generation for MVP. |
| **(b) NO AR / no compositing on customer photos; surface = flat wall with PRESETS** | D-021 + D-031 + D-033 say exactly this | ✅ Aligned with the **locks** — but ⚠️ **conflicts with 3 unrewritten docs** (`PRODUCT-BLUEPRINT-single-session`, `ai/AI_SYSTEM`, `ROADMAP`) + the Analizy teardowns, which still push "wow-on-your-real-room". **Do not carry those forward.** |
| **(c) entry/flow + advisor-as-front-door = OPEN** | D-022 locks "front door, never a gate"; the *mechanics* are genuinely unresolved (D-047 open; USER-INTENTS §8 is a live map) | ✅ Keep the *principle* (never a gate); the *surface/mechanics* are open — 18 agrees. |
| **(d) advisor + product = one screen, two states = keep** | D-034 established two-state; **D-046 superseded it → ONE persistent panel** (advisor primary + docked buy strip) | ✅ Keep the concept; the final form is **D-046's single persistent panel**, not an XOR toggle. |
| **(e) positioning "sell confidence, not choice" = OK** | Core of VISION + D-001/D-003 | ✅ Fully aligned. |

## ⚠️ The fault line (resolve explicitly so 20 doesn't inherit it)
18 has two layers never fully reconciled:
- **Layer A — `ai/` "opinion-first" ambition:** the RETHINK v1→v5 series (react-don't-specify · single-session · designer-reasoning thesis-first · Resolution×Revelation · readiness-gate-not-%) — **great product thinking**, BUT its entry fantasy is "AI shows a bold complete wall *on your room* at true scale". That render is **dead** (D-021/D-031/D-033 + clarification b).
- **Layer B — shipped commerce/display (later locks + mockups):** flat wall + preset cm-true layouts, one persistent panel, slot-dictates-shape/no-drag. **This is what we build.**
**Resolution:** keep Layer A's *reasoning* (opinion-first, react-only, thesis-first, inevitability) but the advisor's **proposal surface = flat wall + presets**; "surprising-yet-inevitable" is expressed through **curation/composition**, not room compositing.

## BRING INTO FOLDER 20 (proven, load-bearing)
- **Decisions (near-verbatim):** D-002 trust-before-sales · D-003 recommendations-before-catalog · D-004 AI-as-designer-not-salesperson · D-005 mobile-first · D-006 wall/set first-class · D-020 orchestrate-external-AI · D-022 shop=floor/advisor=front-door-never-gate · D-023 one-flow-project-type-param · D-024 pool-level-learning/KB-is-memory · D-025 moat=Catalog×Designer×Outcome×Distribution (none today) · D-026 no-confidence-%/qualitative-readiness · D-027 distribution-is-product · D-029 design-outcome≠commercial-outcome · D-030 MVP=shop-spine+advisor.
- **Data model (DAY 1 — retrofit = full rewrite):** `ARTIST` (first-class from day 1, even if only attribution) · `ARTWORK` (`source`+`collection`, hi-res master, tags, allowed_tones/crops, no price) · `DERIVATIVE` (appearance recipe) · `PRODUCT/VARIANT` (virtual SKU = artwork×size×material×mat×frame, price computed) · `SET/WALL` (packages N pieces — the central object) · `ORDER/ORDER_LINE` (frozen at purchase) · `PAYOUT/MODERATION` (phase-2-ready seam).
- **Pricing:** gross-up `net=(Gelato_cost+fixed)÷(1−margin%−artist%−commission%)`; Gelato = source of truth (per-SKU at build); **each extra piece ships ~€0.29 → sets are the entire economics**; USA ≈ 2× EU margin; artist cap ~40%, margin floor.
- **Commerce architecture (audit D1–D11) = MVP backend work-order:** one shared **Catalog Engine** (⚠️ Home's filters are a verified MOCK — must be built) · live Gelato shipping quote (no flat rate) · Stripe Tax (tax-exclusive) · availability per variant×destination · deterministic pick ranking (not LLM) · zero-results always has an exit · max 12 pieces · itemized cart no cross-sell · context-scoped chat-chip registry (wall/piece/pick).
- **KB (advisor day-1 quality condition):** build layers **A rules / B heuristics / D patterns** now; **E case-studies / F effectiveness** need volume; **log every session's cost + decisions from turn 1** (can't reconstruct later).
- **Mockup patterns = IDEAS to re-think fresh (per the governing rule), NOT files to port:** `05-wall` (product-page-IS-the-wall, N=1–12 cm-true preset layouts, slot dictates position+shape, no drag — D-050/D-051) and `04-advisor` (one persistent panel — D-046) are *concept references* for the wall + advisor surfaces. Also as ideas: 3-screen MVP (catalogue / product+advisor / cart — D-038), no-breadcrumbs (D-048), context chips (D11). **Re-design all of this fresh on our Ideogram/shadcn `_shell`** under current flow decisions — 18's flow/screen-switching/UX is uncertain and lavender-on-cream, not a target. Keep RULE #1 (reuse `_shell`, grep before authoring).

## ALREADY SUPERSEDED — do NOT carry forward
- `PRODUCT-BLUEPRINT-single-session.md` as written (photo-composite-onto-room spine — dead per D-021/D-031/D-033 + clarification b). Keep only its interaction philosophy (opinion-first, react-only, price-once-at-end, sets-as-implementation).
- `ai/AI_SYSTEM.md` v0.1 (confidence-%, style-naming, persistent learning loop — all killed by RETHINK + D-024/D-026).
- `ROADMAP.md` v0.1 (mentions AR, confidence scoring, room scanner). Replace with VISION's ladder + D-030.
- `SCREEN_MAP.md` (retired 8-step wizard + AR) — rewrite after D-047.
- Superseded decisions: D-016 Stitch→D-032 · D-034 two-state→D-046 · D-001/D-012 framing→D-022.
- Project-15 drag-canvas wall-builder (discarded attempt).
- ⚠️ The 4 `Analizy/` teardowns frame "in-your-room visualization/inpainting" as the #1 wedge — **contradicts D-021/D-031/D-033 + clarification (b); ignore that rec.** Mine them only for the OTHER patterns: Fy! (curator-not-generator, per-piece rationale, no-login fingerprint sessions, every turn ends in a concrete output) · Mixtiles (neutral-mockup composition, live per-tile pricing, ready-made Gallery Walls that fill slots without dragging) · Displate (pricing-rules engine, sets, quantity discounts) · Ideogram (deferred generation rung — steal Magic-Prompt/seed only if/when generation is added). *(20's own fresh teardowns + best-2026 add: OpenAI-killed-Instant-Checkout → guest-first+own-checkout; Displate PDP pickers; DROOL all-to-cart.)*

## GAPS — open forks to decide in folder 20
1. **D-047 — ✅ DECIDED + REFINED 2026-07-24.** The builder holds **N independently-configurable pieces (N=1..12); wall composition is an OPTIONAL layer, not a mandatory frame.** Per-piece config (art · orientation · size · material · frame) is **ALWAYS fully free**; the ONLY thing that ever constrains per-piece size is opting into a **designed wall composition** (curated cm-true layout → size becomes whole-wall scale, per-piece keeps material/frame). A set of pieces can be in one of two states:
   - **Free** (default) — every piece fully independent. Shown either as a **list/gallery of single items** (e.g. 10 different gifts: 3 portrait / 4 landscape / 3 square, each own size/frame) OR as a **tidy grid on one wall** (e.g. 10 verticals @ 50×70). List-vs-grid is a **view** toggle; per-piece control is full in both.
   - **Designed wall** (opt-in) — curated composition; size = whole-wall scale, per-piece = material/frame only. Chosen when the customer wants us to arrange a beautiful wall.
   One builder, one project handles all of it — **never a new project per piece.** Layout gallery per N spans **designed compositions ↔ grids**; **no free drag** (slot/layout dictates geometry). Enter via catalogue/search OR advisor; advisor = one persistent panel (D-046), never a gate (D-022). Rationale: sets are the margin (each extra piece ships ~€0.29) so the wall is first-class — but **forcing composition would exclude the decisive / bulk / multi-gift buyer**, so composition is optional. This beats Mixtiles (which needs TWO separate builders — free tile-grid vs curated wall — verified live; see `teardowns/mixtiles.md`): we unify both in ONE builder where per-piece freedom follows the chosen arrangement, not the URL. **One order = one shipping address** (want 3 addresses → 3 orders; multi-address parked as future, not MVP). Design fresh on `_shell` — do NOT copy 18's mockups.
2. **Entry / chooser mechanics** — 4-approach chooser vs "product-page-is-the-wall" vs catalogue-first. Principle kept (never a gate, D-022); surface open. *(Artur asked me to propose here — open items #3/#4.)*
3. **Advisor proposal surface** — flat wall + presets; express "surprising-yet-inevitable" via curation/composition, not room compositing.
4. **Validation never run** — the Wizard-of-Oz test (does opinion-first land with strangers) was proposed, never recorded as run.
5. Visual accent / customization set / margin% / market / paper — 🟡 in PRODUCT_BIBLE §11 (recolor is 20's last step).
6. No home yet for: B2B (parked as separate product), gifts, reverse-image "more like this", returns/account/reorder.

## Next
- ✅ D-047 decided (variable-N, "product page IS the wall") — 2026-07-24.
- **Now: fresh flow + core-screens design pass** (catalogue/landing · product+advisor+wall · cart) via `dev-brainstorm` → `dev-plan`, on `_shell`, under D-047 + D-022/D-046. Resolve remaining GAP forks #2 (entry/chooser mechanics) + #3 (advisor proposal surface) inside this pass.
- Then `dev-plan` on the BRING list + the data model + audit D1–D11 backend work-order.

## Related
`../../18. Latenca/docs/DECISIONS.md` (product source of truth) · `unified-flow-architecture.md` (v1 — reconciled here) · `CONCEPTS.md`.
