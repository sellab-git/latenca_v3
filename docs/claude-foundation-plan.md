# Latenca — Claude Foundation (adapting `claude-code-starter` to OUR stack)

**Goal:** build Latenca's own `.claude/` system **on the base of** `AIBiz-Automatyzacje/claude-code-starter` — adapt everything they propose to our stack so we have ONE complete foundation, not a partial copy. This file is the **completeness contract**: every workstream is listed with a checklist; nothing ships half-done and forgotten.

**Branch:** `chore/claude-foundation`. **Base vendored:** starter `.claude/` copied in raw (agents, skills, rules, workflows, docs, hooks, templates); their `settings.json` kept as `settings.json.starter-ref` only (not activated — adapted deliberately in workstream E).

## Principles
- **Their brain, our body.** Adopt their process/knowledge/review/SQL; keep our framework (Next 16 App Router), deploy (Vercel), E2E (Playwright MCP), design base (`src/app/pilot/_shell/`).
- **Global rules win.** `~/.claude/rules/` (autonomous-workflow, code-quality, verify-before-done, user-preferences, infrastructure) is the top policy layer. Project `.claude/rules/coding-rules.md` composes under it; on conflict, global wins.
- **Complete, not partial.** Track every workstream here; a piece is "done" only when adapted + verified, not when copied.
- **Fork, don't blind-sync.** This becomes OUR system. `sync-template` (blind upstream overwrite) is DISABLED; we cherry-pick upstream improvements manually (workstream F).

## Product decisions — feed the schema + knowledge base
**Locked (2026-07-24):**
- **Fulfillment = Print-on-demand** (Gelato/Printful). Products/prices/variants/shipping/availability come from the POD API (never invented). Supabase holds orders + customers, not stock.
- **Payments = Stripe now, behind a `PaymentProvider` abstraction.** Must allow adding other gateways later without a rewrite. No hardcoded Stripe in business logic.

**OPEN — idea only, do NOT implement:**
- **Auth / onboarding model = UNDECIDED.** Candidate: progressive email-gate (Mixtiles-style). Needs research against multiple industry examples + best 2026 wall-art / e-commerce standards before we build. Tracked as a research task (part of Phase B teardowns). Do not wire auth until decided.

## The crux: Next 16 App Router ≠ Vite SPA
Every UI/skill/agent that assumes Vite must be translated:

| Concept | Starter (Vite) | Latenca (Next 16) |
|---|---|---|
| Rendering | client SPA, `use client` everywhere | **Server Components default**; `"use client"` only for hooks/handlers |
| Data | React Query in browser | server fetch / Server Actions; client libs only where needed |
| Supabase client | PKCE `onAuthStateChange` (browser) | **`@supabase/ssr`** (cookies, server client, session refresh in middleware) |
| Env | `import.meta.env.VITE_*` | `process.env` + `NEXT_PUBLIC_*`; `import "server-only"` for secrets |
| Security/CSP | Vite CSP | Next `middleware.ts` + headers (OWASP) |
| Sentry | `@sentry/vite-plugin` | `@sentry/nextjs` |
| Dev server / E2E | `agent-browser` on `:5173` | **Playwright MCP** on `:3000` |
| Deploy | Coolify | **Vercel** (`[deploy]` tag discipline) |

## Workstreams (the checklist)

### A — Rules & CLAUDE.md (foundation)
- [ ] Merge `coding-rules.md` with our global rules; add "global wins" note.
- [ ] Reconcile testing boundary: **TDD on logic/data** (cart math, Zod, Supabase, POD/Stripe adapters) ✅; **light on React components** (our rule) — no forced UI tests.
- [ ] Add project conventions block: Next 16 App Router, Vercel, Stripe-abstracted, POD, `_shell` design base, auto-push.
- [ ] Update project `CLAUDE.md` to point at this system + doc index.

### B — Knowledge base (compounding = the fix for "repeats mistakes")
- [ ] `docs/CONCEPTS.md` — seed domain glossary: POD, progressive-email-auth, PaymentProvider, wall-builder, advisor, Ideogram-1:1, `_shell`, recolor-step.
- [ ] `docs/solutions/` — adopt structure (categories); seed with solved items from this project (overflow fix, ESLint set-state, competitor-screenshot gitignore incident).
- [ ] `learned-patterns.md` — seed with our durable rules (reuse `_shell`; verify live via Playwright; placeholder persona; 1:1 includes interactions).
- [ ] Bridge with `PROJECT_STATUS.md` (single source of truth for status).

### C — Technical skills → Next 16
- [ ] `tailwind-react-guidelines` → rewrite for Next App Router + Server Components + shadcn (keep React 19 / Tailwind v4 / Zod v4 parts).
- [ ] **NEW `next-guidelines`** skill — Next 16 specifics (Turbopack, App Router, Server Actions, caching, `AGENTS.md` "read node_modules docs" rule, deprecations).
- [ ] `supabase-dev-guidelines` → add `@supabase/ssr` Next section (server/client helpers, middleware refresh, RLS with progressive-auth model).
- [ ] `security` → Next headers/middleware/CSP (drop Vite CSP).
- [ ] `sentry-integration` → `@sentry/nextjs`.
- [ ] **NEW `payments`** skill — `PaymentProvider` abstraction, Stripe first (Checkout/webhooks), pluggable.
- [ ] **NEW `pod-fulfillment`** skill — POD conventions (Gelato/Printful: catalog/quote/order, sync job, real-time shipping).
- [ ] Keep as-is (stack-agnostic): `code-quality`, `code-review` (retarget checklist to Next), `bugfix`, `ux-ui-guidelines`.

### D — Pipeline + agents → Next
- [ ] Keep dev-* pipeline + workflows (`dev-autopilot-wf` etc.).
- [ ] Retarget builders (`feature-builder-*`) to Next App Router + server-first + our `_shell`.
- [ ] `feature-tester-e2e` → Playwright MCP on `:3000` (not agent-browser/:5173); keep visual-diff-vs-Ideogram idea.
- [ ] Reviewers: keep 8 + adversarial; `security-sentinel`/`kieran-ts`/`architecture` — add Next notes.

### E — Deploy, hooks, settings
- [ ] Drop `coolify-manager` (we're Vercel). Keep our `/deploy` + `[deploy]` discipline.
- [ ] Adapt `stop-build-check` hook → Next (`next build` / typecheck) — decide if Stop-hook build is wanted (heavy) or typecheck-only.
- [ ] Build `.claude/settings.json` (from `.starter-ref`): keep useful hooks/statusLine, drop what doesn't fit; don't clobber `settings.local.json`/`launch.json`.
- [ ] Keep `coderabbit-setup`, `freshness-audit`, `gemini`.

### F — Sync strategy
- [ ] Decide: fork cleanly (no auto-sync). Document how to cherry-pick upstream starter improvements manually.
- [ ] Remove/neuter `sync-template` blind overwrite for this repo.

## Status — Phase-adaptation DONE (branch `chore/claude-foundation`)
- **A ✅** `latenca-overrides.md` (precedence + stack facts + testing boundary) + CLAUDE.md wiring.
- **B ✅** `CONCEPTS.md`, `learned-patterns.md` (6 rules), `docs/solutions/` seed, PROJECT_STATUS bridge.
- **C ✅** `next-guidelines`, `payments`, `pod-fulfillment` (new), Supabase Next-SSR resource + pointer; security/sentry governed by overrides; grounded in live 2026 docs (caught: Next 16 `middleware`→`proxy`, `auth-helpers-nextjs` deprecated).
- **D ✅** builders (`feature-builder-{ui,data,fullstack}`) now auto-load `next-guidelines`; `feature-tester-e2e` retargeted to Next `:3000` + Playwright MCP. Reviewers read code + overrides.
- **E ✅** `coolify-manager` removed (we're Vercel → global `/deploy` + `[deploy]` discipline). **Decision: Stop-hooks + statusLine NOT auto-activated** (opt-in) to avoid disrupting sessions; the starter's hook scripts remain in `.claude/hooks/` but are unwired — enable later with a Next-appropriate fast check (`tsc --noEmit && eslint`, not full `next build`). `settings.json.starter-ref` removed.
- **F ✅** This is a **fork**. `sync-template` guarded OFF (would clobber our adaptations) — see its SKILL.md. Upstream improvements come via manual cherry-pick from a scratchpad clone, never blind overwrite.

**Next:** merge `chore/claude-foundation` → `main`, then the foundation guides Phase B (teardowns + commerce spine). Research task #13 (auth model) still open.
