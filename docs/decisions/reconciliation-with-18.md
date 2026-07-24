# Reconciliation with folder `18. Latenca` — migration map

**Purpose:** folder 18 (`latenca_v2`, mockup phase, design-complete) holds Latenca's mature **LOCKED** product architecture (DECISIONS D-001…D-051 + a separate commerce track D1–D11 in `audit-wall.md`, VISION, PRODUCT_BIBLE, mockups, its own competitor Analizy). Folder 20 is the clean shadcn rebuild. **18's strategy governs the product; 20 delivers the engineered rebuild + fresh 2026 evidence.** This is the migration map → then `dev-plan`.

**Status:** complete (full 18 review done 2026-07-24). One-liner: *the strategy transfers wholesale; the display/AI-ambition layer has an internal fault line that Artur's 2026-07-24 clarifications resolve in favor of the later locks.*

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
- **Mockup patterns → rebuild as shadcn (not copied HTML):** `05-wall` (v35, design-complete: product-page-IS-the-wall, N=1–12 cm-true preset layouts, slot dictates position+shape, no drag — D-050/D-051, 27 layouts) · `04-advisor` (one persistent panel — D-046) · 3-screen MVP (catalogue-landing / product+advisor / cart — D-038) · no-breadcrumbs (D-048) · warm shadow system (D-043) · single-sourced shell/CSS discipline (D-040/D-041) · component-reuse RULE #1 (`components.md`). Palette is lavender-on-cream — **recolor is folder-20's last step anyway**, so copy structure, retune later.

## ALREADY SUPERSEDED — do NOT carry forward
- `PRODUCT-BLUEPRINT-single-session.md` as written (photo-composite-onto-room spine — dead per D-021/D-031/D-033 + clarification b). Keep only its interaction philosophy (opinion-first, react-only, price-once-at-end, sets-as-implementation).
- `ai/AI_SYSTEM.md` v0.1 (confidence-%, style-naming, persistent learning loop — all killed by RETHINK + D-024/D-026).
- `ROADMAP.md` v0.1 (mentions AR, confidence scoring, room scanner). Replace with VISION's ladder + D-030.
- `SCREEN_MAP.md` (retired 8-step wizard + AR) — rewrite after D-047.
- Superseded decisions: D-016 Stitch→D-032 · D-034 two-state→D-046 · D-001/D-012 framing→D-022.
- Project-15 drag-canvas wall-builder (discarded attempt).
- ⚠️ The 4 `Analizy/` teardowns frame "in-your-room visualization/inpainting" as the #1 wedge — **contradicts D-021/D-031/D-033 + clarification (b); ignore that rec.** Mine them only for the OTHER patterns: Fy! (curator-not-generator, per-piece rationale, no-login fingerprint sessions, every turn ends in a concrete output) · Mixtiles (neutral-mockup composition, live per-tile pricing, ready-made Gallery Walls that fill slots without dragging) · Displate (pricing-rules engine, sets, quantity discounts) · Ideogram (deferred generation rung — steal Magic-Prompt/seed only if/when generation is added). *(20's own fresh teardowns + best-2026 add: OpenAI-killed-Instant-Checkout → guest-first+own-checkout; Displate PDP pickers; DROOL all-to-cart.)*

## GAPS — open forks to decide in folder 20
1. **D-047 (THE fork): single artwork vs variable-N wall as the MVP unit.** Drives SCREEN_MAP + the SET/WALL cart engine. Artur's clarification (c) = entry/flow open → **decide this first.**
2. **Entry / chooser mechanics** — 4-approach chooser vs "product-page-is-the-wall" vs catalogue-first. Principle kept (never a gate, D-022); surface open. *(Artur asked me to propose here — open items #3/#4.)*
3. **Advisor proposal surface** — flat wall + presets; express "surprising-yet-inevitable" via curation/composition, not room compositing.
4. **Validation never run** — the Wizard-of-Oz test (does opinion-first land with strangers) was proposed, never recorded as run.
5. Visual accent / customization set / margin% / market / paper — 🟡 in PRODUCT_BIBLE §11 (recolor is 20's last step).
6. No home yet for: B2B (parked as separate product), gifts, reverse-image "more like this", returns/account/reorder.

## Next
- Fix CLAUDE.md "D1–D11" wording.
- Tackle **D-047 + entry/advisor surface** (Artur's open items) → a concrete proposal grounded in USER-INTENTS §8 + the wall-presets model + D-022/D-046.
- Then `dev-plan` on the BRING list + the data model + audit D1–D11 backend work-order.

## Related
`../../18. Latenca/docs/DECISIONS.md` (product source of truth) · `unified-flow-architecture.md` (v1 — reconciled here) · `CONCEPTS.md`.
