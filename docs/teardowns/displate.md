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

## Still to map
Displate cart/checkout + identity/payment method; Custom Displates (their upload path); then **iamfy.co** + best-2026 research → synthesize.
