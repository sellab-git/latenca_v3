# Reconciliation with folder `18. Latenca` — migration map (in progress)

**Purpose:** folder 18 holds Latenca's mature, LOCKED product architecture (DECISIONS D-001…D-037+, VISION, PRODUCT_ARCHITECTURE, PRODUCT_BIBLE, mockups, its own competitor Analizy). Folder 20 (this repo) is the clean rebuild. This doc reconciles the two: **18's locks govern the product; 20 supplies the engineered rebuild + fresh 2026 evidence.** Output = a migration map (what moves to 20, what's already superseded, gaps) → then `dev-plan`.

**Status:** seeded with Artur's clarifications (2026-07-24). Full 18 review pending (agent).

## Artur's clarifications on the 18 locks (2026-07-24)
1. **Generation — MVP AI = advisor (adopt D-030), but keep the SEAM open as a future path.** Not a generator in MVP. Architecture must leave a clean seam for AI image generation later, in two possible modes:
   - **(a) Mixtiles-style templated:** ready-made presets transformed by AI in the background → a buyable image (print).
   - **(b) Full external generation engine** plugged in later → buyable print.
   Treat as **possibility / potential path**, not an MVP feature. Vendor-abstraction (D-020) + source-agnostic catalog (D-011) already support this — make the seam explicit; don't build it for MVP. *Refines D-030's framing (from "not a generator, full stop" to "advisor-only in MVP; generation is a designed-in future path").*
2. **No AR, no compositing on customer photos** (confirms D-021/D-031/D-033). **Our surface = a flat wall with PRESETS of art layouts** (single / pair / gallery arrangements). Simpler to build + maintain. This is the display model.
3. **Entry / flow (on-ramps vs one flow) = OPEN.** Re-think carefully — neither my 6-on-ramp v1 nor a bare restatement of D-023 is assumed. Design question to work through against 18's USER-INTENTS + RETHINK series.
4. **Advisor as front door = OPEN.** Artur invites a better proposal (tie to #3). Don't assume "advisor = the entry"; propose the strongest option.
5. **Two states (advisor + product = one screen, two states) = KEEP** (D-034; already designed in 18).
6. **Positioning "sell confidence, not choice" = OK** (VISION).

## Plan
1. **Full review of folder 18** (agent): all decisions D-001…end, VISION, PRODUCT_ARCHITECTURE, PRODUCT_BIBLE, USER-INTENTS(+catalog), CONCEPT-the-wall, PRODUCT-BLUEPRINT-single-session, SCREEN_MAP, ai/DESIGN_INTELLIGENCE + AI_SYSTEM, the RETHINK-* series, ROADMAP, LOCKS, Analizy/*, and the mockups inventory. → structured digest.
2. **Migration map:** what moves to folder 20 (decisions, mockups, data model, pricing, KB), what's superseded, gaps, + where 20's fresh 2026 evidence adds (Instant-Checkout → guest-first+own-checkout, Displate PDP patterns, DROOL all-to-cart).
3. **Re-think entry/flow + advisor-entry** (open items #3/#4) — a concrete proposal grounded in 18's USER-INTENTS/RETHINK + the wall-with-presets model.
4. **`dev-plan`** on 18's locks + Artur's clarifications + the foundation.

## Related
`docs/decisions/unified-flow-architecture.md` (v1 — reconcile per this doc) · folder `../../18. Latenca/docs/DECISIONS.md` (source of truth for product) · `docs/CONCEPTS.md`.
