# Supabase + Next.js 16 App Router (Latenca — AUTHORITATIVE)

> **last-verified:** 2026-07-24 · `@supabase/ssr` (getAll/setAll API, v0.4+ — old get/set/remove removed) · `@supabase/supabase-js` v2 · Next.js 16.2. Verified vs live Supabase docs + `supabase/supabase` example `examples/auth/nextjs`. **`@supabase/auth-helpers-nextjs` is DEPRECATED — do not use.** Auth method still undecided for Latenca — this plumbing is method-agnostic (email/OAuth/magic-link identical).

## Two Next 16 facts that break old tutorials
- **`middleware.ts` → `proxy.ts`** (renamed/deprecated in Next 16.0.0). Export a function named `proxy`. `config.matcher` unchanged. Codemod: `npx @next/codemod@canary middleware-to-proxy .`
- **`cookies()` is async** — `const cookieStore = await cookies()`.

## 1. Clients
Browser — `src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
```
Server — `src/lib/supabase/server.ts` (Server Components, Route Handlers, Server Actions):
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch { /* Server Component: read-only cookies. OK when proxy.ts refreshes sessions. */ }
        },
    } },
  )
}
```
**Only ever implement `getAll`/`setAll`.** The old `get`/`set`/`remove` triad is removed and breaks session sync silently.

## 2. Session refresh — `src/proxy.ts` (REQUIRED)
Server Components can't write cookies, so a refreshed token never reaches the browser without this. Skipping it = random logouts.
```ts
// src/lib/supabase/proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
export async function updateSession(request: NextRequest) {
  let res = NextResponse.next({ request })
  const supabase = createServerClient(  // per-request; NEVER a module global (Fluid compute)
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          res = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
    } },
  )
  // Do NOT put code between createServerClient and getClaims(), and do NOT remove getClaims() — either causes random logouts under SSR.
  const { data } = await supabase.auth.getClaims()
  // optional: redirect unauthenticated users here
  return res  // return unmodified; if you build a new response, copy cookies: newRes.cookies.setAll(res.cookies.getAll())
}
```
```ts
// src/proxy.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
export async function proxy(request: NextRequest) { return await updateSession(request) }
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
```

## 3. Reading the user server-side
| Method | Does | Use for | Safe? |
|---|---|---|---|
| **`getClaims()`** | verifies JWT locally (WebCrypto + cached JWKS on asymmetric keys, default for projects after 2025-05-01) | **gate pages/data — default**, fast, no DB round-trip | ✅ |
| **`getUser()`** | network call to Auth server, freshest record | when freshness matters (banned/deleted/role changed) | ✅ |
| **`getSession()`** | reads cookies **without validating** | only to get raw tokens | ❌ never authorize on it |
Rule: **`getClaims` to gate**, `getUser` for freshness, `getSession` never for authz. `data.claims.sub` = trustworthy userId.

## 4. RLS best practices
- **Enable RLS on every `public` table.** No exceptions.
- **Wrap `auth.*` in a subselect** → `(select auth.uid())` (evaluated once/statement, ~180ms→~9ms).
- **`TO authenticated` is NOT authorization** — always pair with an ownership predicate (BOLA/IDOR):
  ```sql
  create policy "orders_select_own" on orders for select to authenticated
    using ( (select auth.uid()) = customer_id );
  ```
- **UPDATE needs `USING` + `WITH CHECK`** (else a user can reassign a row to someone else). No SELECT policy → UPDATE returns 0 rows silently.
- **Roles/authz data → `app_metadata`, NEVER `user_metadata`** (user-editable → privilege escalation). JWT claims aren't fresh until token refresh.
- **`auth.role()` deprecated** — use `TO`. Breaks with anonymous sign-ins.
- **`SECURITY DEFINER` = last resort**, bypasses RLS and is PUBLIC-executable in `public`. If needed: put in a non-exposed schema, `set search_path = ''`, include an `auth.uid()` check. Prefer `SECURITY INVOKER`. Views: `WITH (security_invoker = true)` (PG15+).

## 5. Env vars
```bash
# .env.local — client-safe
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # new format; legacy anon key = compat fallback
# SERVER ONLY — never NEXT_PUBLIC
SUPABASE_SECRET_KEY=sb_secret_...                         # new format; replaces service_role; bypasses RLS
```
Frontend uses **publishable** key (RLS is the real access control). Secret key = server-only, Route Handlers / Server Actions only (POD/order admin writes). Guard secret modules with `import "server-only"`. Add every secret to `.env.example` (no values) + Vercel. Per Latenca infra: **each project has its OWN Supabase project**.

## 6. Top deprecations to avoid
1. `@supabase/auth-helpers-nextjs` is dead → `@supabase/ssr`.
2. `middleware.ts` doesn't exist in Next 16 → `proxy.ts` (`export function proxy`); run the codemod.
3. Never `get/set/remove` cookies — only `getAll`/`setAll`.
4. Never authorize on `getSession()` server-side — use `getClaims()`/`getUser()`.
5. Never roles in `user_metadata`; never expose secret/service_role key to the browser; create the Supabase client per-request (Fluid compute), never as a module global.

**Sources:** Supabase docs (creating-a-client, server-side/nextjs, RLS, getClaims), `supabase/supabase` example `examples/auth/nextjs`, Next.js proxy file-convention docs, Supabase api-keys 2025 rollout + getClaims/asymmetric-keys changelog.
