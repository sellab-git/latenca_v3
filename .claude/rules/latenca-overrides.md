# Latenca overrides — read FIRST, before `coding-rules.md`

This project runs the `claude-code-starter` machinery **adapted to Latenca's stack**. `coding-rules.md` (from the starter) still applies, but this file overrides it where they differ, and the user's global `~/.claude/rules/` overrides both.

## Rule precedence (highest → lowest)
1. **Global `~/.claude/rules/`** — `autonomous-workflow`, `code-quality`, `verify-before-done`, `user-preferences`, `infrastructure`. Always win.
2. **This file** (`latenca-overrides.md`) — project-specific stack facts.
3. **`coding-rules.md`** — starter defaults (compose under the above).

## Stack facts that override starter assumptions (starter is Vite/Coolify; we are NOT)
- **Framework = Next.js 16 App Router**, not Vite. **Server Components by default**; add `"use client"` only for hooks/handlers. Data via server fetch / Server Actions, not browser React Query by default. Read `node_modules/next/dist/docs/` before writing Next code (see `AGENTS.md`) — Next 16 has breaking changes.
- **Env** = `process.env` + `NEXT_PUBLIC_*` (never `import.meta.env`/`VITE_*`). `import "server-only"` in files with secrets/DB.
- **Supabase client** = `@supabase/ssr` (cookie-based server client + session refresh in `middleware.ts`), NOT the SPA `onAuthStateChange` PKCE pattern.
- **Security** = Next `middleware.ts` + OWASP headers, not Vite CSP.
- **Sentry** = `@sentry/nextjs`, not `@sentry/vite-plugin`.
- **Deploy = Vercel.** Ignore `coolify-manager`. Use the global `/deploy` flow; `[deploy]` tag ONLY when the user explicitly says deploy. Commit freely and **auto-push** (standing rule for `latenca_v3`).
- **Dev server / E2E** = Next on `:3000`, driven by **Playwright MCP** (reaches the real logged-in app; already proven). Not `agent-browser` on `:5173`.

## Testing boundary (reconciles starter TDD with our global rule)
- **TDD on logic/data** — cart/pricing math, Zod schemas, Supabase queries/RLS, POD + payment adapters: happy path + error case, behavior not internals. (Starter rules #2 apply here in full.)
- **Light on React components** — do NOT force UI unit tests (global `code-quality.md`). UI is verified in the browser (Playwright), not RTL, unless the user asks.
- Everything else from starter rule #2 holds: never weaken assertions, never edit a test to make it pass, fix the code not the test/linter.

## Product architecture (see `docs/CONCEPTS.md`)
**Locked (2026-07-24):**
- **Fulfillment = Print-on-demand** (Gelato/Printful). Product data/prices/shipping come from the POD API; never invent them. Supabase holds orders + customers, not stock.
- **Payments = Stripe now, behind a `PaymentProvider` abstraction** — no hardcoded Stripe in business logic; other gateways must be addable without a rewrite.

**OPEN — do NOT implement yet:**
- **Auth / onboarding model = UNDECIDED.** Candidate idea only: progressive email-gate (Mixtiles-style — email to start building a wall / checkout, full account optional later). Must be validated against multiple industry examples + best 2026 e-commerce/wall-art standards before we build it. Tracked as a research task; do not wire auth until it's decided.
- **Design base = `src/app/pilot/_shell/`** — reuse these components; grep before authoring new UI (reuse is rule #1).
- **1:1 → recolor → remap** — don't invent layout during the Ideogram rebuild; recolor (warm/gallery) and business-logic remap are later steps.

## Foundation status
This `.claude/` system is mid-adaptation from the starter. Map + checklist: `docs/claude-foundation-plan.md`. Don't assume a starter skill is Next-ready until its workstream (C/D) is ticked there.
