# Latenca — Project Status / Resume Point

**Updated:** 2026-07-24 · **Repo:** `sellab-git/latenca_v3` (public, `main`, auto-push) · **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui

> **New session? Read this file + `CLAUDE.md` first, then continue.** This repo is the single source of truth — everything you need is here (memory does not carry over between folders).

## What Latenca is
Curated AI wall-art shop with an AI advisor. Solo founder (Artur), non-developer — communicate in **Polish**; code/UI/commits in **English**; UI/prices English/USD/global.

## Where we are now — Phase A (Ideogram 1:1) essentially DONE
Four screens rebuilt 1:1 on shadcn, verified live via Playwright (1440 + 390, clean console, tsc+eslint 0):
- **image-detail** `src/app/pilot/image-detail/page.tsx` — static layout (6 breakpoints + dark) **and** interactions: right panel is a full-height card (actions pinned bottom), `•••` menu with icons + submenus, rich account menu with a segmented Light/Dark/Auto, split account+bell.
- **Home** `/pilot/home` — hero + composer + filter row + masonry feed (FeedCard = ProductCard seed).
- **Styles** `/pilot/styles` — title + Explore/My-styles tabs + selectable named style cards (collections / shop-by-theme seed).
- **Canvas** `/pilot/canvas` — LIGHT: tool rail + floating composer + zoom/history cluster + blank canvas (full editor out of scope; wall-builder → Mixtiles later).

**Design base** (shared, reused — `src/app/pilot/_shell/`): `AppSidebar` (collapse + More→Less expander + rich account menu), `MobileNav` (bottom tab bar), `Composer`, `SegmentedControl`, `ImageActionsMenu`, `theme` hook. Plus in-screen seeds: `FeedCard`, `StyleCard`, tool rail, zoom cluster. **Reuse rule held** — Home/Styles/Canvas consume the shell, no duplication.

Why Ideogram at all (settled): it's the **skin** (visual language + primitives), not the **skeleton**. A shop needs a commerce spine Ideogram lacks (product detail w/ buy, wall builder, cart, checkout) — those blocks come from Phase B, not Ideogram.

Known small gaps: account menu isn't wired to the mobile nav's Account tab yet; interaction items #6 (Collections sub-nav), #7 (logo-hover swap), #8 (workspace switcher), #9 (copy-feedback) from `docs/ideogram/image-detail.md` §6 were deprioritized (app-specific, low shop value). NEW badge red vs purple = recolor-step detail.

Run it: `pnpm dev` → http://localhost:3000/pilot/home (also /styles, /canvas, /image-detail; narrow to 390 for mobile).

## The build pipeline (how we work — proven in the pilot)
1. **Extract via Playwright** — Playwright MCP reaches the REAL logged-in Ideogram on Artur's own session and sets any viewport exactly. So Claude Code does the whole extraction itself: screenshot each breakpoint + read computed styles (`browser_evaluate`). No Claude Chrome, no manual DevTools. (Claude Design was dropped: it refused 1:1 on IP grounds and is read-only/HTML-only.)
2. **Build shadcn 1:1** — reconstruct the screen faithfully with shadcn components + measured values.
3. **Verify via Playwright** — screenshot the local build at each breakpoint, compare side-by-side to the real Ideogram, fix until it matches.
4. **Commit + push** (auto-push this repo).
5. **Recolor + remap — LATER, separate steps.**

## Immediate plan
**Phase A (Ideogram 1:1) — DONE.** Four screens + design base shipped and pushed.

**[← RESUME HERE] Phase B — competitive teardown → commerce spine.** Ideogram gave us the skin; a shop needs the parts it doesn't have. Next:
1. **Teardown Mixtiles + Displate + iamfy.co** (Playwright, same pipeline) — 3 sources, each checked for different angles. Map entry paths, browse/filter, product detail, wall builder, cart/checkout, identity/auth moment, micro-interactions → matrix "who solves X best". **Standing rule:** named examples are starting points — for each problem also research best-in-class 2026 patterns in real sources, don't anchor on the three (see memory `research-best-2026-not-anchor`). Findings to `docs/teardowns/` (competitor screenshots stay local, never committed).
2. **Best-of synthesis + our IA/funnel** — per screen, pick the best pattern + where the AI advisor injects. Anchor to `18. Latenca` decisions D1–D11.
3. **Build the commerce blocks** Ideogram lacks (ProductCard-with-buy, size/frame/material picker, wall-builder canvas, cart line, checkout steps) into `_shell`/screens.

Small Phase-A follow-ups (optional, low priority): wire account menu to the mobile Account tab; extract account menu into its own shared component; interaction items #6–#9.

Only after the system + screens exist do we **recolor** (warm/gallery) and **remap to business logic** (wall composition / slot pick / advisor chat / cart-checkout — product thinking lives in read-only `18. Latenca` + decisions D1–D11).

## Locked rules
- **shadcn = the foundation, from day one.** Never re-surface as a question.
- **Palette lives as CSS variables** in `src/app/globals.css` (`:root` = Ideogram light, measured; `.dark` = Ideogram dark, from spec). **Recolor = swap these variables.** So copying Ideogram's palette now is harmless.
- **Reuse components, never reinvent** — grep the UI library before authoring anything new (see `docs/components.md` philosophy; the single most repeated mistake historically).
- **1:1 first → recolor → remap.** Don't invent a Latenca layout during the rebuild; don't recolor early.
- **Competitor screenshots (Ideogram) are NEVER committed** — kept in a local scratchpad only. The repo holds only our derived values/spec.
- **Verify, don't assert** — measure with Playwright, don't guess; **see the real thing, don't reconstruct from memory**.
- Commit freely; **ask before `git push`** is waived here (auto-push), but never add a `[deploy]` tag unless Artur explicitly says deploy.

## Key files
- `CLAUDE.md` — project instructions + RULE #1 (reuse) + doc index.
- `docs/ideogram/image-detail.md` — the pilot screen's full extraction spec (tokens → shadcn vars, component inventory, per-breakpoint blueprints, states, sample content).
- `src/app/pilot/image-detail/page.tsx` — the rebuilt pilot screen.
- `src/app/globals.css` — Ideogram palette as CSS variables (the recolor target).
- `src/components/ui/` — shadcn components (the future design-system blocks).
- `docs/claude-foundation-plan.md` — the `.claude/` system adaptation (starter → our stack), workstreams A–F.
- `docs/CONCEPTS.md` — domain glossary (locked decisions: POD, Stripe-abstracted; auth = OPEN). `.claude/rules/learned-patterns.md` + `docs/solutions/` — knowledge base (grows via `/dev-compound`).
