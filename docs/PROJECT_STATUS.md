# Latenca — Project Status / Resume Point

**Updated:** 2026-07-23 · **Repo:** `sellab-git/latenca_v3` (public, `main`, auto-push) · **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui

> **New session? Read this file + `CLAUDE.md` first, then continue.** This repo is the single source of truth — everything you need is here (memory does not carry over between folders).

## What Latenca is
Curated AI wall-art shop with an AI advisor. Solo founder (Artur), non-developer — communicate in **Polish**; code/UI/commits in **English**; UI/prices English/USD/global.

## Where we are now
**Pilot: static layout is 1:1; interaction states are NOT yet.** The Ideogram single-image-detail screen is rebuilt on shadcn at `src/app/pilot/image-detail/page.tsx`, verified against the real Ideogram across 390/430/768/1024/1440/1920 + dark theme (faithful, zero overflow, clean console, static-prerenders). Polish landed in `47ca6ea`.

**BUT** a 2026-07-23 live-capture pass (Playwright driving the real Ideogram) found the **interactive** states were missed — the first pass only matched static frames. Full findings with exact measured values are in **`docs/ideogram/image-detail.md` §6 "Interaction inventory"**. This is now the **immediate next work** (before design-system extraction). The 9 gaps Artur flagged, all verified:
1. Sidebar bottom = **2 buttons** (account + bell), not one combined.
2. Right panel = **full-height card** (320×780, radius 30, bg `--card`, actions pinned bottom via `mt-auto`) — ours is a short block that only grows when prompt expands.
3. `•••` menu needs **icons on every item + submenus** (Add to collection ▸, Report ▸) — ours is text-only.
4. Account menu (bottom) is **rich** (profile+email, Free/credits, Upgrade plan, View profile, Help, Manage muted, Delete account, API, Log out) with a **segmented Light/Dark/Auto at the foot** — that's where theme lives, not standalone checkmark items. **Use a placeholder email, never commit Artur's real one.**
5. Tools **"More" = inline expander** (adds Styles/Characters/Canvas/Batch, flips to "Less"), not a popup.
6. **Collections** nav: hover → `›` expander → sub-collections.
7. Sidebar **collapse** toggle by the logo; hover on the collapsed/logo area swaps the mark.
8. **"Personal"** (top) = workspace-switcher dropdown.
9. Prompt-row **Copy prompt / Use prompt (+)** actions (wire later).

Artur's call on sequencing was pending when we stopped for the day (options offered: all-at-once 1:1 vs structural-first vs prioritize). **Recommended next: do the interaction pass, verifying each state against the live app (open the real menu, measure, rebuild, re-check) — same pipeline as the static pass.** Live Ideogram is reachable via Playwright MCP (image-detail is a modal over `/explore`; its URL pattern is `ideogram.ai/g/<id>/<n>`; the sidebar is the shared app shell, so sidebar menus can be captured on `/explore` too). **Claude Chrome is NOT needed** — Playwright reaches the logged-in app and reads exact pixels/DOM.

Run it: `pnpm dev` → http://localhost:3000/pilot/image-detail (narrow the window to see the 900px mobile/desktop switch).

## The build pipeline (how we work — proven in the pilot)
1. **Extract via Playwright** — Playwright MCP reaches the REAL logged-in Ideogram on Artur's own session and sets any viewport exactly. So Claude Code does the whole extraction itself: screenshot each breakpoint + read computed styles (`browser_evaluate`). No Claude Chrome, no manual DevTools. (Claude Design was dropped: it refused 1:1 on IP grounds and is read-only/HTML-only.)
2. **Build shadcn 1:1** — reconstruct the screen faithfully with shadcn components + measured values.
3. **Verify via Playwright** — screenshot the local build at each breakpoint, compare side-by-side to the real Ideogram, fix until it matches.
4. **Commit + push** (auto-push this repo).
5. **Recolor + remap — LATER, separate steps.**

## Immediate plan (Artur's chosen order: 1 → 3 → 2)
1. **Polish the pilot screen to 100%.**
   - **[DONE] static layout** — all 6 breakpoints + dark theme verified (`47ca6ea`). Nit: top thumbnail-strip alignment on mobile (spec says centered; live looks slightly left) — pending Artur's eyeball on a real phone.
   - **[← RESUME HERE] interaction 1:1 pass** — implement the 9 interaction gaps in `docs/ideogram/image-detail.md` §6 (see the "Where we are now" list above). Verify each state against the live app. Use a placeholder email. This is the active task; Artur will pick sequencing (all-at-once vs structural-first) next session.
2. **[AFTER] Extract shared blocks into our design system** — pull sidebar, search pill, detail panel, action-grid, thumbnail strip, icon-circle, etc. into reusable components. (Started: `PromptBlock` + `DetailRows` already extracted and shared desktop↔mobile.)
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
