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

## Nice patterns worth borrowing
- **Intent segmentation first** ("For myself / For someone else") — cheap, engaging, personalizes the path (gift vs self). Good fit for our AI advisor entry.
- **Single-CTA, emotional, distraction-free** entry; conversational one-question-per-screen onboarding (low cognitive load).

## Still to map (next passes)
- Product/wall selection + **wall builder** (their signature — the Latenca wall-builder reference).
- Cart, shipping, **checkout + exact payment/account method** (does the upfront email become the account? password/social/OTP?).
- Pricing model, size/frame pickers, "see it on your wall" preview.

## Cross-source plan
Compare the same angles on **Displate** and **iamfy.co**, and research best-in-class 2026 patterns per problem (not just these three) — standing rule per memory `research-best-2026-not-anchor`.
