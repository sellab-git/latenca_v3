# Teardown — iamfy.co (Fy!) — the closest to Latenca's vision

**Date:** 2026-07-24 · driven live (Playwright, desktop 1440). Screenshots local only. **This is the most important teardown** — Fy! is essentially a real 2026 execution of the advisor-led, unified, guest-first model Latenca is aiming for.

## The entry = an AI ADVISOR, guest-first (the headline finding)
Homepage hero **IS the advisor**, not a catalog:
- **"Tell us about your wall. We'll do the rest."** + **"Free, no signup."** (guest-first, stated explicitly).
- **Natural-language brief box** (placeholder *"All my plants die but I like plants."*) + **"Add photo"** (of your wall) → **"Get my boards"** (AI curates recommendation **boards** for your brief). Badge: **ADVISOR — IN BETA**; social proof *"1,247 walls solved this week"*, *"1M+ happy customers"*.
- **"TRY A BRIEF"** — clickable example prompts that de-risk the blank box: *"Calm bedroom, warm neutrals, mid-century"*, *"Above the sofa, big statement, color"*, *"Kitchen, food-themed but not corny"*, *"Kid's room — playful, not babyish"*, *"Hallway gallery, 6 small pieces"*. (Open-text intent — richer than Mixtiles's two-card segmentation.)

## Unified shop, multiple browse lenses (one catalog, many doors — the RIGHT way)
Persistent top-nav: **Shop · Style · Room · Trends · Gallery Walls · Frames · + Style Quiz** · search ("Search for anything") · Account · Wishlist · region (GB) · Cart. So you can enter by **advisor brief**, **Style Quiz** (structured), or **browse by Style / Room / Trend / Gallery-Wall / Frame** — all lenses into ONE catalog + ONE cart. This is exactly "many entry goals → one system" — the opposite of Mixtiles's separate silos/subdomains.

## What Latenca takes from Fy!
- **Advisor-first entry that is guest-first** ("free, no signup") — validates our differentiator AND the auth stance (no identity to start). Our advisor can be conversational + generation-capable (Fy! curates existing artist art; we add curated AI + generation).
- **Brief examples / "Try a brief"** to overcome blank-box friction; **Style Quiz** as a structured alternative on-ramp.
- **"Boards"** as the advisor's output unit (a curated set for your brief) — maps to our wall/board.
- **"Add photo" of your wall** early (context), without gating signup.
- **Multi-lens browse** (by Style / Room / Trend) over one catalog — the unified IA.

## Where Latenca goes beyond Fy!
- Fy! curates **independent-artist** art; Latenca = **curated AI art + on-demand generation** in the same flow.
- Deeper **wall-builder / slot-fill** (Mixtiles-grade) where advisor boards, curated art, generated art, and uploads all land.
- The advisor as **connective tissue between goals + into the wall + to cart**, not just a recommender.

## Advisor flow — DRILLED live (2026-07-24, typed a real brief + added a pick)
Drove `/a/advisor/discover/...`: greeting *"Tell me where you're hanging, and I'll start composing in the wall canvas. The wall fills in as we talk."* Typed brief *"Calm bedroom, warm neutrals, above the bed — I like abstract shapes"* → submit spawns a fresh advisor session.

> **⚠️ CORRECTION (deeper 2nd pass, screenshots): an earlier version of this section claimed "the wall never composes" — that was WRONG, from a shallow 1-click glance. The wall DOES compose visually.** The error: I only clicked the ❤ (shortlist); the wall-add is a *different* action. Corrected findings below.

**Two distinct add-actions (the thing the glance missed):**
- **❤ "Save to shortlist"** (the heart on each card) → saves to SHORTLIST (for later).
- **Click the artwork itself → "ON WALL"** → adds it to the **composed wall** ("Your wall, N pieces, £X").

**The wall DOES compose — verified with screenshots (3 + 6 pieces):**
- Pieces render **framed on a flat neutral wall at real relative sizes** (a 60×80 is visibly bigger than a 28×28). Toolbar: **Measure**, **Grid**, and a **Flat ↔ "See it on your wall" (AR)** toggle (default = Flat).
- **Arrangement modes:** default = a **single horizontal row** (overflows → scroll); **Grid** = a tidy **multi-row grid** (2×3 for 6). **BUT still only uniform row/grid — NOT a curated asymmetric designed gallery wall.** *(Whether Gallery-Walls lens / Curations offer designed compositions = still to check — do NOT conclude yet.)*
- **Per-piece QUICK EDIT** (click a wall piece): **STYLE** variants (crops — "The Bold" / "The Pure") · **SIZE** grid, **orientation-appropriate** (square artwork → 12×12…40×40 square only — confirms orientation-driven sizing) · **"Swap position — tap another slot"** (reorder by tap-swap, **no free drag**) · **View details** (→ PDP) · **Remove from wall**. Each piece has own frame + size + price.
- **Live total + Add to cart**; "Your wall · £X" drawer lists every piece (title / frame / size / price).

**Conversational refinement (verified — real, iterative):** refine quick-chips **regenerate every turn**, **keep running context** (calm/warm/neutral/bedroom) while applying the new lens, and always include a **negative escape** ("Not quite right"). Past turns **collapse** showing "· N loved". Extracted **ROOM chip** + **named curation** ("Soft Neutral Abstractions"). Per-piece rationale + Advisor's-Pick hero each turn.

**TAKE (good, current patterns):** two-action model (save-for-later vs put-on-wall) · **framed wall at real sizes + Measure + Flat default** · **per-piece quick-edit** (style / size-by-orientation / **swap-by-tap** / remove) — excellent reference for our per-slot editor, and **tap-swap reorder fits our no-drag rule** · contextual conversational refinement with regenerating chips + negative escape · per-piece rationale · Advisor's-Pick hero · room chip · named curation.

**REJECT / OUR EDGE:** their arrangements are **row / grid (uniform) only — no curated balanced designed layouts** → our edge = **curated layouts per N** (the designed composition they lack; row+grid we also cover as our "Free/grid" state). AR "see it on your wall" — out (D-021/D-033); their "Flat" default aligns with us. Saving model is fragmented (Shortlist vs Curations vs For You). Feeds GAP #3 (advisor proposal surface) in `reconciliation-with-18.md`.

**Gallery Wall SETS as products (verified — confirms our edge):** iamfy sells pre-made sets by piece count: `/collections/{2,3}-print-gallery-wall-sets`, `/collections/gallery-walls`, 24+ named sets ("Wabi Sabi Serenity", "Quiet Contemplation", "Geometric Gold"… from £229.95). A set PDP (`/products/wabi-sabi-serenity`): **Wall Size dropdown** (197×81 cm — scales the whole set, in/cm toggle) + **3 FRAMES**, each print with its own **Frame + Border pickers** (£122.90 ea), "Limited edition, made to order in the UK, by <artist>". **BUT the composition is a straight ROW of 3 equal 60×80 prints (verified in the PDP render) — a curated ART PAIRING, not an asymmetric designed LAYOUT.**
- **★ Confirms Latenca's edge, precisely:** across the advisor wall (row/grid) AND the pre-made sets (row), **nobody does asymmetric balanced gallery compositions with varied sizes/positions.** They curate *which art goes together*; the *arrangement* is always uniform. Our edge = **curated LAYOUTS per N** (asymmetric, cm-true, varied) — the designed composition the whole category skips.
- **★ Validates our size model:** set PDP = **wall-level Size (scales all) + per-piece Frame/Border** — exactly our "designed wall = wall-scale sizing, per-piece material/frame" rule.
- The advisor wall and the shop share **ONE cart** (advisor pieces showed as cart count 6 on shop pages).

**Cart → checkout → identity (verified — validates our auth stance):** cart CTA = **"Checkout securely"**; sign-in is **optional** ("Have a saved cart? Sign in to restore it"). Checkout = **Shopify hosted, guest-first**: Express (Shop Pay / PayPal / Klarna), then **email or phone** (+ optional "Sign in", marketing opt-in), then delivery (country / first name *optional* / last name / address / city / postcode). **`forcedAccount = false`** — no account required, identity = just an email at the end. → validates `auth-onboarding.md`: **guest-first + own checkout + express wallets**, identity at checkout only.

**Still to verify (genuinely lower value — diminishing returns):** Style Quiz on-ramp · "Try a brief" · room upload/AR (we reject AR anyway) · what creates a **Curation** (stayed 0) · single-artwork PDP pickers (set PDP already showed the picker model) · mobile · empty/error states.

## Still to map
Fy! PDP (pickers/frames), cart/checkout + identity/payment method.
