# North-star — Unified flow architecture (one system, many entry goals → cart)

**Status:** EXPLORING — this is the target we're synthesizing from teardowns (Mixtiles/Displate/iamfy + best-2026 research). Not decided yet. It will become Latenca's definitive IA/flow map once the evidence is in. Date started: 2026-07-24.

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

## The unifying idea (hypothesis, to validate)
A **goal-router entry** (state intent, or let the advisor infer it) → the right tool for that goal → a **shared wall-builder canvas** (where any source — curated / generated / uploaded — lands and gets sized/framed/placed) → **one cart → checkout → POD**. The **advisor** is the spine that can move a customer between goals ("actually, generate something for that empty slot") without a context switch. The point: the *silos become modes inside one flow*, not separate destinations.

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

## Related
`docs/teardowns/mixtiles.md` (+ displate, iamfy) · `docs/decisions/auth-onboarding.md` (identity moment sits inside this flow) · `docs/CONCEPTS.md` (wall-builder, advisor).
