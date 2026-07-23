# Latenca — Project Status / Resume Point

**Updated:** 2026-07-23 · **Repo:** `sellab-git/latenca_v3` (public, `main`, auto-push) · **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui

> **New session? Read this file + `CLAUDE.md` first, then continue.** This repo is the single source of truth — everything you need is here (memory does not carry over between folders).

## What Latenca is
Curated AI wall-art shop with an AI advisor. Solo founder (Artur), non-developer — communicate in **Polish**; code/UI/commits in **English**; UI/prices English/USD/global.

## Where we are now
**Pilot SUCCEEDED + polished to 1:1.** The Ideogram single-image-detail screen is rebuilt **1:1 on shadcn** at `src/app/pilot/image-detail/page.tsx`. Verified in Playwright against the real Ideogram across 390/430/768/1024/1440/1920 + dark theme: faithful, zero horizontal overflow, clean console, `pnpm build` static-prerenders it. Polish landed in commit `47ca6ea` (dark theme via account menu, 1024 overflow fix, sidebar label truncation, mobile "Image details | Similar images" switcher measured 1:1 off live Ideogram).

Run it: `pnpm dev` → http://localhost:3000/pilot/image-detail (narrow the window to see the 900px mobile/desktop switch).

## The build pipeline (how we work — proven in the pilot)
1. **Extract via Playwright** — Playwright MCP reaches the REAL logged-in Ideogram on Artur's own session and sets any viewport exactly. So Claude Code does the whole extraction itself: screenshot each breakpoint + read computed styles (`browser_evaluate`). No Claude Chrome, no manual DevTools. (Claude Design was dropped: it refused 1:1 on IP grounds and is read-only/HTML-only.)
2. **Build shadcn 1:1** — reconstruct the screen faithfully with shadcn components + measured values.
3. **Verify via Playwright** — screenshot the local build at each breakpoint, compare side-by-side to the real Ideogram, fix until it matches.
4. **Commit + push** (auto-push this repo).
5. **Recolor + remap — LATER, separate steps.**

## Immediate plan (Artur's chosen order: 1 → 3 → 2)
1. **[DONE] Polish the pilot screen to 100%** — all 6 breakpoints + dark theme done and verified (commit `47ca6ea`). Only remaining nit if we want it: top thumbnail-strip alignment on mobile (spec says centered; live Ideogram looks slightly left) — left as-is pending Artur's eyeball on a real phone.
2. **[NEXT] Extract shared blocks into our design system** — pull sidebar, search pill, detail panel, action-grid, thumbnail strip, icon-circle, etc. out of the pilot page into reusable components before duplicates appear. (Started: `PromptBlock` + `DetailRows` already extracted and shared desktop↔mobile.)
3. **Then the next screens** (Home / My images / generator …) built fast from those blocks.

Only after the shadcn system + screens exist do we **recolor** (warm/gallery) and **remap to our business logic** (wall composition / slot pick / advisor chat / cart-checkout — the product thinking lives in the read-only `18. Latenca` repo + its decisions D1–D11).

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
