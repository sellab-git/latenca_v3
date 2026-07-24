# Teardown — Displate (catalog art marketplace)

**Date:** 2026-07-24 · driven live (Playwright, desktop 1440). Screenshots local only. Angle: the **unified commerce shop** + **canonical product detail** (the opposite of Mixtiles's silos).

## IA — one coherent shop (contrast to Mixtiles)
Persistent **top-nav on every page**: `Explore ▾` · `Custom Displates` · `Limited Editions` · `Displate Club` · big **search** · **Wishlist** · **Cart** · **Join** (account, optional). Promo bar with **countdown timer** + code (urgency). Catalog: 2M+ art, licensed fandoms.
**Key contrast:** Displate is **one unified shop** (single search, one Explore, one cart, always visible) — NOT fragmented silos like Mixtiles. Its weakness: it's a **flat catalog** — no wall-building, no composition, no guidance/advisor.

## Personalization (taste onboarding)
Browse shows an interstitial: *"Searching for the perfect poster? Pick your favorite themes to unlock a personalized gallery curated just for you"* → multi-select theme tiles (heart) → **"Go to my recommendations"**. A lightweight **taste-based personalization** (relevant to our advisor, but simpler — theme picker, not conversation).

## Product detail (PDP) — the canonical commerce pattern ★
The reference Latenca needs (Ideogram has none of this):
- **Breadcrumb** with deep taxonomy (Home › Franchise › Collection › Item).
- **Left:** big image + **thumbnail gallery** (multiple **in-room/context** shots) + wishlist + zoom + **"Drag to move"** (interactive tilt/3D preview) + "Discover more".
- **Right buy-box:**
  - Artist/license line: *"Avatar: The Last Airbender · Officially licensed · 99 Artworks"* (attribution + collection link).
  - Title + description ("Read more").
  - **Social proof:** ★ **4.7/5 · 18,250 store reviews**.
  - **Select product type:** Matte / Gloss / Textra — **material picker** (segmented).
  - **Choose size:** M 45×32cm / L / XL — **size picker** (segmented; unavailable greyed).
  - **Price** + **volume-discount tiers** with countdown: $39.99 for 1 (−20%), $37.49 for 2 (−25%), $34.99 for 3+ (−30%), "Use code GEEK" (urgency + quantity incentive).
  - **ADD TO CART** (big primary).
  - **Geo delivery estimate:** "5–6 business days delivery to Thailand".
- **No forced login** to reach PDP or add-to-cart (guest-first; "Join" optional) → confirms guest-first shell.

## What Latenca takes from Displate
- **Unified shop shell** (persistent nav + one search + one cart) — the coherence Mixtiles lacks.
- **Canonical PDP**: material + size **segmented pickers**, price + volume tiers, social proof (rating + review count), artist/collection attribution, in-room thumbnails + interactive preview, geo delivery, add-to-cart.
- Taste-based personalization as a lightweight advisor on-ramp.
- (For a POD shop, the pickers map to Gelato variants; social-proof + urgency are conversion levers.)

## The emerging synthesis (each competitor has half)
- **Displate:** unified commerce spine + deep catalog + PDP pickers/checkout — but **flat**, no composition, no guidance.
- **Mixtiles:** wall-building + emotional onboarding + in-room preview + slot-fill — but **fragmented silos**, single-source.
- **Latenca = Displate's unified shop spine + Mixtiles's wall canvas + our AI advisor as the guide**, with slot-fill accepting any source (curated/AI/photo). → `docs/decisions/unified-flow-architecture.md`.

## PDP — DEEP verified live (2026-07-24, interacted: changed size/material, added to cart)
The single-piece PDP is **Latenca's priority reference** (most buyers get ONE piece — see memory `single-piece-is-primary-path`). Verified behavior on `/displate/7941958`:
- **Pickers = radix radio groups:** **Material** (Matte / Gloss / Textra) · **Size** (M 45×32 / L 67.5×48 / XL) · **Add frame** (None / Natural / Graphite / White / Black). Frame = optional add-on *(couldn't confirm exact price delta — swatch has a hover-anim overlay that blocked the click; not asserting a number)*.
- **Size drives price LIVE:** M = **$39.99** → selecting L = **$87.99** (base $49.99 → $109.99); volume tiers recompute with it.
- **Availability gating per artwork:** **XL was `disabled`** for this piece (`data-disabled`, aria-checked false) → sizes are gated by what's available for that art. Maps directly to our "availability per variant×destination" rule.
- **Volume-discount tiers** (quantity, not composition): 1 = −20%, 2 = −25%, 3+ = −30%, code GEEK, countdown timer. **This is Displate's entire multi-piece play — buy MORE of anything for a bigger discount; there is NO curated composition / gallery-wall builder.**
- Social proof **4.7/5 · 18,256 reviews**; attribution ("Officially licensed · 99 Artworks"); **"Drag to move"** 3D tilt; in-room/context thumbnails; **geo delivery** ("5–6 business days to Thailand"); breadcrumb taxonomy.

## Cart → checkout → identity — verified
- **Add to cart** → modal ("Proceed to cart / Continue shopping") → **/cart**.
- Cart: line item with in-cart **Edit** (change size/material), **"Frequently Bought Together"** cross-sell, volume-discount reminder, **transparent shipping ($24.99) + "customs fee may apply"**, **Displate Club** upsell ($9.99/mo → free shipping), CHECKOUT.
- Checkout = **own custom checkout (not Shopify), guest-first** (`forcedLogin=false`): email + shipping address, express **PayPal / Google Pay**, SSL + 100-day returns. → confirms **guest-first + own checkout** (matches `auth-onboarding.md`; same stance as iamfy).

## What this sharpens for Latenca
- **The single-piece PDP is the mature pattern to match** for our priority path: material/size(/frame) segmented pickers, **live price on size**, availability-gated variants, social proof, volume tiers, geo delivery, add-to-cart — all guest. Our pickers map to Gelato variants; keep the picker UX, drop metal-only specifics.
- **Even Displate — a 2M-item mature marketplace — has NO composition.** Its multi-buy driver is a **quantity discount**, not a curated wall. Reinforces: single-piece is the unit; nobody does curated layouts → our differentiator, but the single-piece path must be excellent first.
- Cross-sell ("Frequently Bought Together") + quantity discount are the conversion levers on the single-piece path — cheaper than a composer, and where most volume is.

## Still to map (lower value)
Custom Displates (their upload-your-own path — future for us) · the browse taste-picker interstitial (noted above) · mobile · empty/error states.
