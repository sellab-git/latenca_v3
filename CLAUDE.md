@AGENTS.md

# Latenca — new version (folder 20)

Curated AI-wall-art shop with an AI advisor. This folder is the **clean rebuild** on a real **shadcn/ui** foundation. UI/copy **English**, prices **USD**, global market.

## Why this folder exists
`18. Latenca` (the previous version) is now a **read-only reference** — it holds the finished wall/product mockups, business logic, and the mature **LOCKED decision log** (`docs/DECISIONS.md` D-001…D-051, plus a commerce track D1–D11 in `docs/audit-wall.md`). Migration map: `docs/decisions/reconciliation-with-18.md`. Nothing is copied blindly; important pieces migrate here only after the rebuild path is proven. Don't edit 18 from here.

## GitHub = the backbone (no manual copy-paste)
Repo: **`sellab-git/latenca_v3`** (public, `main`) — https://github.com/sellab-git/latenca_v3. Everything flows through GitHub: Claude Design imports the codebase FROM GitHub and its output comes back through git, not hand-pasting. **Auto-push this repo** (Artur's standing hands-off rule, same as latenca_v2); `private/` never committed.

## The rebuild pipeline (locked)
1. **Claude for Chrome** extracts Ideogram 1:1 → exact-value TEXT spec (tokens, component inventory, page blueprints, all states, mobile-first breakpoints). Screenshots don't transfer out of Chrome — the text values are the source of truth.
2. **Claude Design** imports this shadcn codebase **from GitHub (`sellab-git/latenca_v3`)** + the Chrome spec + its own web capture → rebuilds Ideogram's components AND pages 1:1 as shadcn, checking against our design system.
3. **Handoff via git / DesignSync (`/design-sync`)** brings the result back into this repo, component by component; I pull and verify.
4. **Claude Code (me)** remaps the 1:1 pages onto our business logic (wall composition, slot pick, advisor chat, cart/checkout).
5. **Recolor last** — retune palette toward warm, gallery-like only after the system + pages exist.

**Pilot first:** prove steps 1→3 on ONE screen (Ideogram single-image detail) before scaling to all screens. Tests two unverified Claude Design capabilities: mobile-first responsive output, and full-page 1:1 rebuild.

## Non-negotiables (never re-surface as questions)
- **shadcn = the foundation, from day one.** Decided long ago.
- **Claude Design ≠ Stitch.** Hand-built hi-fi in code is preferred over Stitch mockups.
- **Reuse components, never reinvent** — the single most repeated mistake. Grep the UI library before authoring anything new.
- **Recolor is the LAST step**, so copying Ideogram's dark palette during rebuild is harmless.

## Stack
Next.js 16 · React 19 · Tailwind v4 · shadcn/ui (style `radix-nova`, Lucide icons, CSS variables, base color neutral). Base components in `src/components/ui/`.

## Conventions
- Verify in the browser (Playwright / `pnpm build`) before claiming done.
- Commit freely and **auto-push** (Artur's standing hands-off rule for `latenca_v3` — don't ask). No `[deploy]` tag unless Artur explicitly says deploy.
- `private/` (costs/keys) is never committed.

## Claude system (`.claude/`)
This repo runs the `claude-code-starter` machinery (pipeline `dev-*`, review agents, tech skills, knowledge base) **adapted to our stack**. It is mid-adaptation on branch `chore/claude-foundation`.
- **Read `.claude/rules/latenca-overrides.md` FIRST** — it states rule precedence (global `~/.claude/rules/` win → overrides → starter `coding-rules.md`) and the Next-16/Vercel/Supabase-SSR/Stripe-abstracted/POD stack facts that override the starter's Vite/Coolify assumptions.
- **`docs/claude-foundation-plan.md`** — the completeness contract: 6 workstreams (A–F) with a checklist; a starter skill isn't Next-ready until its box is ticked.
- Locked product decisions live in `docs/CONCEPTS.md`.
