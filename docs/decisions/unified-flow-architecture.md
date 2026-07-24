# North-star — Unified flow architecture (one system, many entry goals → cart)

**Status:** **PROPOSED v1** — synthesized from 3 live teardowns (Mixtiles/Displate/iamfy) + best-2026 research. Evidence-grounded; **awaiting Artur's review**. Supersedes the earlier EXPLORING draft. Date: 2026-07-24. → definitive architecture in the section **"Definitive architecture v1"** below.

## The problem (what to beat)
Competitors fragment "creating wall art" into **disconnected silos** — each goal is a different door (URL, sometimes a different subdomain), with its own builder. Mixtiles (teardown confirmed): Frame-your-photos `/photos`, Canvas `/canvas`, Pet/Family photo→AI `/photo-to-art`, Kids `kids.mixtiles.com`, Places `places.mixtiles.com`, Ready-made walls `/browse`, curated Art Collection `/collection`. The customer must **know which door to enter**; the flows don't converge. This is 2016-era architecture.

## The goal (Latenca)
**ONE logical system** where the customer's **starting goal** — whatever it is — is routed through a **single coherent, guided flow to the cart**. No "go here to build a wall, there to upload a photo, elsewhere to generate AI art." Everything is arranged so the flow works for **every entry case** and they all reach the same cart/checkout.

## Entry goals to unify (jobs-to-be-done)
> **PRELIMINARY & OPEN — not a closed list** (Artur). These are candidate customer intents to seed thinking; discover and refine the real set from teardowns + best-2026 research + real customer language. Expect additions/merges.

- **"I want curated AI art"** — browse Latenca's curated collection (our core).
- **"I want to generate art"** — AI generation, guided.
- **"I have a photo"** — upload → frame / canvas / stylize.
- **"I want to build a gallery wall"** — wall composition (Mixtiles's signature; our shared canvas).
- **"Help me decide"** — the **AI advisor** leads (our differentiator; the connective tissue between goals).
- **"It's a gift"** — gifting path.

## The unifying idea (hypothesis — now part-VALIDATED by Fy!/iamfy)
A **goal-router entry** (state intent, or let the advisor infer it) → the right tool for that goal → a **shared wall-builder canvas** (where any source — curated / generated / uploaded — lands and gets sized/framed/placed) → **one cart → checkout → POD**. The **advisor** is the spine that can move a customer between goals ("actually, generate something for that empty slot") without a context switch. The *silos become modes inside one flow*, not separate destinations.

**Fy!/iamfy validates this is real & current (2026):** their home IS an advisor ("Tell us about your wall. We'll do the rest. Free, no signup.") with three coexisting on-ramps into **one catalog + one cart**:
- **Advisor brief** — open natural-language box ("calm bedroom, warm neutrals") + "Add photo" → curated **boards**. De-risked with clickable **"Try a brief"** examples.
- **Style Quiz** — structured alternative on-ramp.
- **Multi-lens browse** — by Style / Room / Trend / Gallery-Wall / Frame — many doors, one catalog.
All **guest-first** (no signup to start) — consistent with `auth-onboarding.md`.

**Latenca's concrete target (draft):** the same three on-ramps, but the advisor is **generation-capable** (curated AI art + on-demand generation, not just artist curation), and boards land in a **deeper Mixtiles-grade wall-builder** where **each slot accepts any source** (curated / AI / photo). Displate supplies the **PDP/commerce spine** (material+size pickers, social proof, cart/checkout) for the single-piece path. So: **Fy!'s advisor-led unified entry + Mixtiles's wall canvas & slot-fill + Displate's PDP/commerce spine + our AI generation** = the synthesis.

## Definitive architecture v1 (PROPOSED — evidence-grounded)

### Principles (from best-2026 evidence)
1. **Intent-led IA, not category-led** — organize around *how* the customer shops (by room / mood / style / use-case / goal), not a catalog tree. (Algolia, Foundit.)
2. **Advisor = a routing LAYER placed in 3 spots, never one monolithic bot.** (Algolia agentic-UI.)
3. **Guest-first + OUR OWN checkout.** Hard signal: **OpenAI killed ChatGPT Instant Checkout after ~5 months** (CNBC 2026-03-24) — customers *discover* via AI but pay in the retailer's own, familiar checkout. So: advisor drives discovery; Stripe checkout stays internal, guest-first. Agentic-checkout (ACP/UCP/AP2) is immature — build feed/PDP so we *can* expose to agents later, don't depend on it.
4. **Preview-in-context (in-room / AR) is the heart**, not a feature — the #1 return-reducer for wall art.
5. **Configurator = steps, broad→detail, price always visible (sticky, real-time), progress + clear endpoint.** Never all options at once; never hide price. (Vervaunt: Tylko, Interior Define.)
6. **Every advisor/handoff ends in a concrete CTA** (card → PDP → Add; quiz → composition → Add; wall → Add-all). Conversation without a conversion path = anti-pattern. Results are **product-card-heavy**, not walls of text.
7. **Speak human, not "configure your product"** (Nike By You critique) — the advisor is a personal art consultant.

### The shape
**On-ramps (open list — different doors, one engine):** `curated browse` · `generate AI art` · `"I have a photo"` · `gallery-wall builder` · `gift` · `"advise me"`. Each is a homepage entry tile; all feed the **same advisor context + same cart**.

**Advisor — 3 placements (not a silo):**
1. **AI Mode in search/hero** — "describe what you want" ("something warm above the sofa"); catches fuzzy intent, output = **product cards** (Fy!'s "tell us about your wall → boards", de-risked with "Try a brief" examples).
2. **Lightweight Quiz on-ramp** for "advise me"/gift (room → style/mood → budget → single-or-wall), then flips to **open chat** for follow-ups. (Quiz wins on structured prefs; open chat on ambiguity — hybrid.)
3. **Q&A agent on the PDP + inside the wall-builder** (frame/size/material/in-room questions, grounded in real product data; suggested questions as buttons).

**Shared canvas (the unification seam):** ONE "room/wall canvas" with in-room + AR preview (upload your wall photo OR curated room mockup), **shared by single-piece and wall-composition** — they are two *views of the same canvas*, not separate products. The advisor can **escalate "one piece" → "build a wall" without a context reset**. **Every slot accepts any source** — curated art / AI-generated / uploaded photo. (Mixtiles slot-fill, made multi-source; DROOL "template → swap art → in-room → all-to-cart one click".)

**Commerce spine (from Displate):** single-piece **PDP** = material + size **segmented pickers**, social proof (rating + review count), volume/discount tiers, artist/collection attribution, in-room thumbnails, **Add to Cart**; wall-composition = the canvas with a sticky real-time **set price** + **Add-all-to-cart**. **One cart → Stripe guest checkout → POD** (Gelato; POD = source of truth for price/shipping — see `pod-fulfillment`).

### The flow (every entry → one cart)
```
Entry tile / hero  →  Advisor (AI-mode | quiz | browse lens)  →  product cards / boards
      │                                                              │
      ├─ single piece ─────────────► PDP (pickers, preview) ────────┤
      ├─ "build a wall" / board ───► shared wall canvas (slot-fill:  │
      │                               curated / AI-gen / photo;      │
      │                               frame/size; in-room/AR) ───────┤
      └─ "generate" ──────────────► guided generation (style/theme) ─┘
                                     lands a slot on the canvas
                                                                     ▼
                                              ONE cart → Stripe (guest) → POD (Gelato)
```
Advisor is the connective tissue across all of it; checkout is ours.

### What Latenca does that none of the three do
Curated **AI art + on-demand generation** as first-class sources inside the *same* advisor-led flow and the *same* wall canvas — Fy! curates artist art only, Mixtiles is your-photos-only + siloed, Displate is a flat catalog. Our edge = advisor + generation + multi-source wall canvas, unified.

### Anti-patterns we explicitly avoid
Monolithic support-widget bot · conversation with no Add-to-Cart · hidden/late price in the configurator · walls of text over product cards · separate silos/subdomains per goal · depending on external agentic checkout as the main path.

### Open / to decide next
- Exact on-ramp set (open list) + homepage entry design.
- Generation UX: templated/guided (Mixtiles-style themes) vs open-prompt vs both.
- AR depth (full AR vs upload-photo mockup) for v1.
- Auth method still open (`auth-onboarding.md`) — sits inside this guest-first flow.
- Then → `dev-brainstorm`/`dev-plan` to build, screen by screen, on the `_shell` design base.

## What each teardown must extract (to fill this doc)
Per source (Mixtiles ▸ Displate ▸ iamfy ▸ others):
1. How they capture/route **intent** at entry (or don't).
2. Every **creation path** and where it lives — do any converge? where do they diverge?
3. The **wall-builder / configurator** mechanics (add art, arrange, preview-in-room, size/frame/material).
4. How each path **reaches the cart** — shared or separate?
5. Friction/seams a unified flow would remove.
Then: research **best-in-class 2026** unified creation→commerce flows, guided configurators, JTBD onboarding — beyond these three (standing rule).

## Output
When synthesized: this doc holds Latenca's **definitive unified IA + flow map** (entry-goals → routing → shared canvas → cart), with the reasoning and the evidence, as the best-possible 2026 architecture. Then it feeds `dev-plan` for the build.

## Evidence sources (best-2026 research, 2026-07-24)
Algolia *Agentic UI for ecommerce* (advisor patterns, handoff, anti-patterns) · Vervaunt *product-builder UX* (Tylko, Interior Define, Nike By You) · DROOL Gallery Wall Builder + ArtPlacer/Wall Art Viewer (AR, template→swap→all-to-cart) · **CNBC 2026-03-24 — OpenAI kills ChatGPT Instant Checkout** + The Drum (discovery vs retailer-owned checkout) · Digital Applied (ACP/UCP/AP2 immaturity) · Baymard product-finding (67–90% vs 17–33% abandonment by toolset quality) · Alhena/Adobe (conversion — vendor/secondary, directional). Full links in the research output.

## Related
`docs/teardowns/{mixtiles,displate,iamfy}.md` · `docs/decisions/auth-onboarding.md` (identity moment sits inside this guest-first flow) · `docs/CONCEPTS.md` (wall-builder, advisor, unified-flow) · `pod-fulfillment` + `payments` skills (commerce spine).
