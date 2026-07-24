# Latenca — Project Status / Resume Point

**Updated:** 2026-07-24 · **Repo:** `sellab-git/latenca_v3` (public, `main`, auto-push) · **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui

> **New session? Read this file + `CLAUDE.md` first, then continue.** This repo is the single source of truth — everything you need is here (memory does not carry over between folders).

## What Latenca is
Curated AI wall-art shop with an AI advisor. Solo founder (Artur), non-developer — communicate in **Polish**; code/UI/commits in **English**; UI/prices English/USD/global.

## Pilot & design base (Phase A — done; see "Immediate plan" below for current status)
> Current status/resume-point is in **"Immediate plan"** further down. This section records the Phase-A pilot + `_shell`.

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
**DONE so far:** Phase A (Ideogram 1:1 pilot + `_shell` design base) · the `.claude/` **foundation** (starter adapted to our stack — see `docs/claude-foundation-plan.md`, skills `next-guidelines`/`payments`/`pod-fulfillment`, Supabase-SSR) · **Phase B** (live teardowns Mixtiles/Displate/iamfy → `docs/teardowns/`, best-2026 research, architecture v1) · **reconciliation with `18. Latenca`** (migration map).

**Product direction is now settled at the strategy level** (read these before any build):
- `docs/decisions/reconciliation-with-18.md` — **the migration map + GOVERNING RULE.** 18's strategy/decisions (D-001…D-051 + commerce D1–D11), data model, pricing, commerce logic **transfer as SPEC**; 18's **flow/screens/UX/mockups are IDEAS only — re-think fresh** on our Ideogram/shadcn `_shell` (memory `folder-18-is-ideas-not-copy`).
- `docs/decisions/unified-flow-architecture.md` — v1 synthesis (reconciled down to 18's locks: NOT a generator in MVP / flat wall + presets, no AR / one flow / advisor = front door never a gate / sell confidence not choice).
- `docs/decisions/auth-onboarding.md` — guest-first; account method OPEN (magic-link excluded, memory `no-magic-link-auth`).

**[← RESUME HERE] Fresh flow + screens design pass**, on `_shell`, using 18-as-spec + teardowns + best-2026 as INPUTS (not copies):
1. ✅ **D-047 DECIDED + REFINED (2026-07-24): builder holds N=1..12 independently-configurable pieces; wall composition is an OPTIONAL layer.** Per-piece config (art/orientation/size/material/frame) is always free; only opting into a **designed wall** constrains per-piece size (→ whole-wall scale). Two states: **Free** (independent items — e.g. 10 different gifts — or a tidy grid; full per-piece control; list-vs-grid = view toggle) vs **Designed wall** (curated composition, wall-scale sizing). One builder/one project for all — never a new project per piece; no free drag; layout gallery per N spans designed↔grids. Advisor = one persistent panel (D-046), never a gate (D-022). One order = one address (multi-address → separate orders, parked). Beats Mixtiles' two-builder split (verified live — `docs/teardowns/mixtiles.md`).
2. ✅ **Flow + screens SPEC written (2026-07-24): `docs/decisions/flow-screens-spec.md`** — the definitive spec. Consolidates D-047 (builder holds N pieces, wall = optional layer; Free vs Designed states), the 3 screens (catalogue · single-piece PDP · wall builder) + cart, the advisor surface (composes into curated slots, not a list), data model, D1–D11 commerce, and conversion patterns. **Grounded in 6 live teardowns** (Mixtiles/iamfy/Displate/Redbubble/Juniqe/Andy okay → `docs/teardowns/`). **Priority: single-piece path is PRIMARY** (most buyers get 1 artwork — memory `single-piece-is-primary-path`); wall composer = differentiator/optional layer, never taxes N=1.
3. ✅ **Spec + Phase-1 plan written + scale/AI/perf-validated** (see plan `docs/plans/2026-07-24-001-…-plan.md`, 12 IUs; `scale-and-future-proofing.md`).
4. ✅ **Unit 1 core landed (2026-07-24):** Supabase SSR clients (`src/lib/supabase/*`), Next-16 `proxy.ts` (session refresh), `api-response`+`validation`(+test), Vitest, `.env.example`, `typecheck`/`test` scripts. **typecheck + test(2/2) + build all green; `src/app/pilot/**` untouched.**
5. **[← RESUME HERE] Finish Unit 1 seams** (quick — in plan §Scale/Unit 1): enable `cacheComponents`, Sentry, `analytics` + `ModelProvider`/AI-gateway seams, `rate-limit` port, light CI. **Then Unit 2 (migrations) — do it against Artur's REAL Supabase project** (catalog/variants/orders-partitioned/webhooks/RLS-template/fulfillment_jobs/search_index_outbox/two-record-assets/ai_usage). Then Units 3–11 per plan. **Artur's homework:** create Supabase project + Stripe (Stripe Tax) + Gelato (API key, sandbox) → fill `.env.local` from `.env.example`.
   Phase 2 = wall builder + advisor. Phase 3 = recolor. Generation seam (D-020) unused in MVP.

MVP boundary (D-030): shop spine + advisor; advisor = the only AI moment. Recolor (warm/gallery) is the last step.

Small Phase-A follow-ups (optional, low priority): wire account menu to the mobile Account tab; extract account menu into its own shared component; image-detail interaction items #6–#9.

## Locked rules
- **shadcn = the foundation, from day one.** Never re-surface as a question.
- **Palette lives as CSS variables** in `src/app/globals.css` (`:root` = Ideogram light, measured; `.dark` = Ideogram dark, from spec). **Recolor = swap these variables.** So copying Ideogram's palette now is harmless.
- **Reuse components, never reinvent** — grep the UI library before authoring anything new (see `docs/components.md` philosophy; the single most repeated mistake historically).
- **1:1 first → recolor → remap.** Don't invent a Latenca layout during the rebuild; don't recolor early.
- **Competitor screenshots (Ideogram) are NEVER committed** — kept in a local scratchpad only. The repo holds only our derived values/spec.
- **Verify, don't assert** — measure with Playwright, don't guess; **see the real thing, don't reconstruct from memory**.
- Commit freely; **ask before `git push`** is waived here (auto-push), but never add a `[deploy]` tag unless Artur explicitly says deploy.

## Key files
- **`docs/decisions/flow-screens-spec.md` — THE build spec (v1). Read this + `reconciliation-with-18.md` before any build.**
- **`docs/decisions/prior-art-reuse.md` — port map: the backend (~80%) is portable from Artur's earlier Gelato/POD projects (Motowalls/Printly/Pawtraits). Read before writing ANY backend code. Also 2 strategic warnings: distribution/CAC is the real constraint; prior attempts all died at over-planning.**
- **`docs/decisions/scale-and-future-proofing.md` — MANDATORY scale seams (validated 2026, 5 research passes). Plan is ~85% scale-ready; foundation doesn't force a rewrite. 1 rewrite-class fix (enqueue-then-fulfill, not inline webhook) + ~20 cheap seams (cacheComponents, pooler, partitioned orders, keyset, RLS template, SearchProvider+outbox, AssetStore/ImageDelivery/ingest + two-record assets, stateless cart, currency). Scale targets: Typesense · R2+Cloudflare Images · Vercel Cron→Queues. Build Phase 1 simple WITH these seams.**
- **`docs/plans/2026-07-24-001-feat-phase1-single-piece-shop-plan.md` — THE Phase-1 build plan (12 IUs, port-first, scale-validated). Read §Scale.**
- `docs/teardowns/{mixtiles,iamfy,displate,market-scan}.md` — 6 competitors torn down live (single-piece PDP patterns, advisor surface, guest checkout, conversion levers).
- `CLAUDE.md` — project instructions + RULE #1 (reuse) + doc index.
- `docs/ideogram/image-detail.md` — the pilot screen's full extraction spec (tokens → shadcn vars, component inventory, per-breakpoint blueprints, states, sample content).
- `src/app/pilot/image-detail/page.tsx` — the rebuilt pilot screen.
- `src/app/globals.css` — Ideogram palette as CSS variables (the recolor target).
- `src/components/ui/` — shadcn components (the future design-system blocks).
- `docs/claude-foundation-plan.md` — the `.claude/` system adaptation (starter → our stack), workstreams A–F.
- `docs/CONCEPTS.md` — domain glossary (locked decisions: POD, Stripe-abstracted; auth = OPEN). `.claude/rules/learned-patterns.md` + `docs/solutions/` — knowledge base (grows via `/dev-compound`).
