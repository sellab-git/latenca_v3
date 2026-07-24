# Teardown — Mixtiles (partial: onboarding / identity moment)

**Date:** 2026-07-24 · driven live (Playwright, desktop 1440). Competitor screenshots kept local only (never committed). Status: **PARTIAL** — onboarding/identity captured; browse, wall-builder, cart, checkout still to map.

## Entry & onboarding flow (captured)
Home (`mixtiles.com`) → single emotional hero "Photo Walls Reinvented" + one CTA **"Shop Now"** (minimal nav: hamburger + chat). Then:
1. **`/getstarted` — "Who's it for?"** — intent segmentation: **For myself** (decorating my home) vs **For someone else** (buying a gift). Two big illustrated cards. No identity ask yet — engagement first.
2. **`/getstarted/name` — "Let's get to know you"** — asks for **name** ("What's your name?") + Continue. **Before any product is shown.**
3. (next, not submitted) — the whole `/getstarted` step is wrapped in a DOM node **`id="EmailCapturePage"`** → the onboarding's purpose is **name + email capture up front**, dressed as a friendly conversational quiz.

## Key insight (answers "is Mixtiles a good pattern?")
**Mixtiles captures name + email UP FRONT, before showing any product**, betting engagement + retargeting data > checkout friction. This is **against general 2026 best practice**: Baymard puts forced early identity among top conversion killers; guest-first + identity-at-checkout converts better (~64% vs 52% for delayed vs forced). So Mixtiles is a **deliberate data-capture-first play (powers abandoned-cart email), NOT a conversion-optimal default** — an example of *a* way, not necessarily the best for us.

**Implication for Latenca auth (see `docs/decisions/auth-onboarding.md`):** do NOT copy Mixtiles's upfront name+email gate as-is. Evidence still favors **guest-first, identity at checkout**. Mixtiles's engaging intent-segmentation ("who's it for" → personalize/gift path) is worth borrowing as UX *without* the early data gate — e.g. segment intent to tailor the advisor, but don't block on name/email.

## Menu / IA — the fragmentation (THE core finding for Latenca)
Full menu enumerated live. The "create" goals are **separate silos**, each its own URL — two even on **separate subdomains**:

| Menu item | URL | Goal / input | Type |
|---|---|---|---|
| Frame Your Photos | `/photos` | upload your photos → frame | user-upload |
| Canvas Prints | `/en-US/canvas` | your photo on canvas | user-upload (format) |
| Pet Portraits | `/photo-to-art` | pet photo → AI/stylized art | **photo→AI** |
| Family Portraits | `/photo-to-art/family` | family photo → art | **photo→AI** |
| Kids Wall Art | **`kids.mixtiles.com`** | kids art | **separate subdomain** |
| Places Art | **`places.mixtiles.com`** | map/places art | **separate subdomain** |
| Ready Made Walls | `/browse` | pre-designed wall sets | curated wall |
| Art Collection | `/collection/home` | browse curated art | curated browse |
| Gift Card / For Business | `/gift`, `/for-business` | — | commerce side |

Account: **"Login or Sign Up"** in the menu, framed *"Sign up to save your progress & track orders"* — **optional**, not forced. Utility: My Orders, Promo Codes, Help, Chat, email-capture field.

**Diagnosis (Artur's point, confirmed):** every *goal* (upload / canvas / photo→AI / kids / places / ready-made / curated) is a **disconnected entry silo** — different URL, sometimes different subdomain, its own builder. There is **no single guided flow** that takes "what do you want?" → the right tool → wall → cart. This is the 2016-era architecture to beat.

**Latenca opportunity:** one **unified goal-router** — the customer states intent (I have a photo / build a wall / generate AI art / browse curated / it's a gift) and is led through *one coherent system* to the cart, with the wall-builder as the shared canvas and the advisor as the guide. North-star: `docs/decisions/unified-flow-architecture.md`.

## Ready-Made Walls + wall-builder / configurator (drilled — the signature)
`/browse` = **"Gallery Walls"**: pre-designed wall SETS as products, filter by size (Small/Medium/Large), each card shown **in-room**, "BEST SELLER" badge, "From US$X" with strikethrough (discounted), dimensions (e.g. 122cm×79cm). **The wall composition IS the product.**

Wall detail (`/photo-walls/<slug>`) = the **configurator**:
- **Left:** the layout previewed **in the room** (empty frames in position) + **Zoom** + edit (pencil/ruler) button.
- **Right:** config panel — **tabs `Frame | Border | Effect | Photos(7)`**; Frame tab = swatch grid (Frameless / Black selected / White / Oak +$21 / Wide Black +$42 / Wide Walnut +$42 / Earthy Blend +$21 / Harmony Mix +$12…), each a mini-preview + **price delta**. Set price with strikethrough.
- **CTA: "Add 7 Photos"** — the layout defines the **slot count**; you fill the slots.

Patterns to reuse: wall = **N-slot product template** (sold by size, discounted); **tabbed config dimensions with swatch options + price deltas**; **in-room preview**; **slot-fill CTA**.

**★ Convergence insight for Latenca:** Mixtiles's "Add 7 Photos" is single-source (your photos). **Our unification point = the slot-fill:** a Latenca layout slot should accept **any source — curated art / AI-generated / uploaded photo** — so all entry goals meet at the shared wall canvas. That is the seam that turns Mixtiles's silos into one flow. → `docs/decisions/unified-flow-architecture.md`.

## Curated Art Collection (`/collection/home`) — drilled
"Decorate Your Walls in Minutes — Easily frame & hang the art you love." A gallery of **curated art pieces shown pre-framed** (various frame styles) → CTA **"Browse Art"**. Yet another **separate landing** from `/browse` (gallery walls) and `/photos` (upload). Maps to Latenca's curated core. Simple: browse curated → frame → hang.

## AI generation (`/photo-to-art`, "Pet Portraits") — drilled
Their "AI" silo is **template-driven, NOT open-prompt**: pick a themed template ("Bath time", "The Photoshoot", "Sleepy"…), each shown as a finished **themed multi-frame wall of AI-stylized results**, with a **"Create"** button. Flow = pick theme → upload photo → AI stylizes into that theme → presented as a ready wall set. Also a separate silo.
**For Latenca:** a **guided/templated** generate path (pick a style/theme → generate) is friendlier than a raw prompt box, and fits the unified flow — but it must live *inside* the one flow, not as a walled subdomain.

## The 4 entry paths — how each manages size/frame/material (verified live 2026-07-24)
Artur's question: each path configures size/frame/material differently — *why, and can we unify?* Drilled all four live (past the `/getstarted` gate — Artur supplied name/email, Claude did not).

| Path | Unit | Entry | Builder used | Size lives… | Layout |
|---|---|---|---|---|---|
| **Frame Your Photos** `/photos` | your photos → tiles | upload-first | **Tile builder** | **per-tile** (+ Bulk Edit) | loose grid, add tiles freely |
| **Art Collection** `/collection/browse` | curated art | **select many → Next** | **funnels into the SAME `/photos` tile builder** | per-tile (+ Bulk) | loose grid |
| **Gallery Walls** `/browse` → `/photo-walls` | a wall = product | browse, filter S/M/L, real cm | **Wall configurator** (separate) | **wall-level** (S/M/L) | fixed curated layout, slot-fill |
| **Pet Portraits** `/photo-to-art` | AI art in a theme | **theme-first** → Create → upload → AI | (→ tile builder after gen) | after generation | preset theme |

**Tile builder (`/photos`) — verified controls:** a control bar **Frame · Size · Effect · Border** each acting **per-tile**, plus **Bulk Edit** (apply to all). **Size options (real cm, priced "each"):** 21×21 $19 · 32×32 $55 · 50×50 $125 (square) · 21×28 / 32×42 / 50×69 (portrait, $33/$55/$125) · 28×21 / 42×32 / 69×50 (landscape). So size = **3 orientations × 3 scales**, data-driven, per-tile.

**Tile builder — interactions (verified live 2026-07-24, drove clone/delete):**
- **Click a tile → per-tile edit modal:** `Drag to adjust crop` (reposition image in frame) + Frame/Size/Effect/Border + **Clone** + **Delete**.
- **Add (Clone or upload):** tile appends to a **single horizontal row**; the whole row **re-centers**. 5 tiles = one row overflowing the viewport → **horizontal scroll. NO grid-wrap, NO composition** — the builder does not arrange a gallery wall, just lines tiles up.
- **Delete:** tile removed, row **closes the gap + re-centers** (no empty slot persists). Price recomputes live ($55→$110→$206→$165).
- **Takeaway for Latenca:** reuse the **click-tile→edit-modal** pattern (crop-drag, swap, per-piece material/frame, clone, delete) and **live price**; **reject the flat-row no-composition arrangement** — Latenca add/remove re-flows to a **curated layout for N** (remove → curated N−1 layout, not a row gap-close). Their Clone is global; our duplicates only on explicit user action.

**THE finding — Mixtiles runs TWO OPPOSITE freedom models in one company:**
- **Tile builder:** loose grid, size/frame/border **per-tile** → max freedom, but **a nice composition is NOT guaranteed** (easy to look messy).
- **Wall configurator:** curated fixed layout, config **wall-level** → always looks good, but **zero arrangement freedom**, size only S/M/L.
- **Neither offers "curated layout + reasonable per-piece control."** That gap = **exactly Latenca's "medium freedom"** (curated layouts per N *and* per-slot art/material/frame). Validates Artur's medium-freedom call.

**Why the paths differ:** historical silo accretion (each product line built separately: photos → walls → AI → curated → kids/places subdomains), NOT a domain requirement. The domain unifies cleanly under **{one wall object · source-agnostic slot · one configurator}**; paths differ only by (a) which source fills the slots and (b) start-blank vs start-from-preset-layout. → this is the concrete evidence behind `unified-flow-architecture.md`.

## Mixtiles teardown — status: COMPLETE (4 paths + configurators verified)
Covered: onboarding/identity, full menu/IA, ready-made-walls + configurator, curated collection, AI (photo-to-art), **and the 4-path size/frame/material management (above)**. Remaining minor: cart/checkout + payment method (does everything share ONE cart? — verify in a checkout pass). Net picture: **many separate silos + two opposite builders, never unified.**

## Next sources
Same angles on **Displate** (catalog art marketplace — size/material/frame, filters, checkout) and **iamfy.co** (personalized art) + **best-2026** unified-flow research. Then synthesize → `docs/decisions/unified-flow-architecture.md`.

## Nice patterns worth borrowing
- **Intent segmentation first** ("For myself / For someone else") — cheap, engaging, personalizes the path (gift vs self). Good fit for our AI advisor entry.
- **Single-CTA, emotional, distraction-free** entry; conversational one-question-per-screen onboarding (low cognitive load).

## Still to map (next passes)
- Product/wall selection + **wall builder** (their signature — the Latenca wall-builder reference).
- Cart, shipping, **checkout + exact payment/account method** (does the upfront email become the account? password/social/OTP?).
- Pricing model, size/frame pickers, "see it on your wall" preview.

## Cross-source plan
Compare the same angles on **Displate** and **iamfy.co**, and research best-in-class 2026 patterns per problem (not just these three) — standing rule per memory `research-best-2026-not-anchor`.
