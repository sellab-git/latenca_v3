# Decision record — Auth / onboarding / checkout-entry model

**Status:** PROPOSED — awaiting Artur's approval. **Do NOT implement until approved.** Date: 2026-07-24. Research task #13.

## The decision to make
When (if ever) does a curated AI-wall-art shop (POD, global, USD) ask a visitor for identity, and how? Currently UNDECIDED. Mixtiles-style progressive email-gate was a candidate idea only.

## Evidence (2026 standards)
- **Forced account creation = ~24% of checkout abandonments** (Baymard) — largest fixable friction after surprise shipping (47%).
- Registered users convert higher (~64% vs ~52% guest) and repeat more → data capture matters, but forcing it upfront costs sales.
- **Winning pattern = guest checkout + account creation AFTER purchase** (on confirmation you already hold email/name/address → "just set a password / magic link").
- **Passwordless (magic-link/OTP) is the 2026 default** — ~19% abandon on forgotten passwords; magic-link doubles as "recover my order".

## How competitors handle the identity moment
| Shop | When asked | Guest? | Method |
|---|---|---|---|
| Mixtiles | build freely → email/account at order step (poss. early nudge for abandoned-cart) | build: yes; order: email required | email-first account |
| Etsy | at checkout | **yes** ("continue as guest") | guest email; link to account later |
| Displate / Society6 / Desenio | at checkout | yes | guest email; account optional |
| Shopify (Printful/Gelato) | configurable, guest default | yes | email-only/passwordless "stealth" accounts + magic-link |

(Mixtiles's *exact* email timing unconfirmed by research — will verify by driving their live app in the teardown.)

## Recommendation (proposed)
**Model A (UX) on Model C (mechanics) — hybrid.**
- **UX:** anyone builds the wall / picks slots / chats with the advisor and reaches checkout with **zero login**. Email entered once at checkout. Confirmation page offers a **passwordless (magic-link) account** ("track your order / reorder"). Optional skippable wall-save email-gate can be A/B'd later for abandoned-cart — ship without it.
- **Mechanics:** **Supabase anonymous sign-in** on first meaningful action (add to wall / open cart). Every guest gets a stable `auth.users` UID → wall/cart/order are RLS-owned from click one, and converting to a real account **keeps the same UID (data carries over free)**.

### Supabase implications (if approved)
- Guests = **anonymous sign-in**, not a parallel guest table.
- `orders` row stores `email` directly (receipt/Stripe/POD source of truth) + `user_id → auth.users` → an order is valid **email-only** even without a password.
- **RLS:** one ownership rule `user_id = (select auth.uid())` covers anon + permanent. Use `is_anonymous` claim only to gate converted-account-only actions (e.g. cross-session order history).
- **Decide once:** anon cart-holder signs into a *pre-existing* account (different UID) → **merge anon cart into existing account** (write the reconciliation once).
- **Housekeeping:** cron-cleanup stale anonymous users with no order; enable CAPTCHA on anonymous sign-in (Supabase security guidance).

## Rejected
- **Forced account before checkout** — triggers the 24% abandonment, no upside for an impulse-leaning POD shop.

## Sources
Baymard checkout-usability; Corbado guest-vs-forced-login; Krepling 2026; MojoAuth passwordless; Etsy guest+link help; Supabase anonymous sign-ins (docs + announcement + security); PhotographyTalk Mixtiles 2026; Shopify guest-checkout guide. (Full links in research output / task #13.)

## Next
1. Artur approves / adjusts this model.
2. Verify Mixtiles's exact email timing in the teardown (fills the one gap).
3. Only then implement (Supabase anonymous auth + orders schema) — via the `dev-*` pipeline.
