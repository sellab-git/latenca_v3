---
name: next-guidelines
description: "Wytyczne Next.js 16 App Router (Server Components, Server Actions, Route Handlers, Cache Components, env, struktura) dla Latenca. Używaj przy pisaniu/review dowolnego kodu Next w tym projekcie. Uzupełnia tailwind-react-guidelines (React 19/Tailwind v4/shadcn)."
---

# Next.js 16 App Router — wytyczne Latenca

**Stack:** Next.js 16.2 (Turbopack) · React 19 · Tailwind v4 · shadcn/ui. **To NIE jest Vite.** Starter zakłada Vite SPA — tu obowiązuje ten dokument.

> **Zawsze:** przy niepewności co do API Next 16 przeczytaj `node_modules/next/dist/docs/01-app/` (bundlowane docs) albo użyj context7 — Next 16 ma breaking changes vs starsze wersje. Nie pisz z pamięci.

## 1. Server Components domyślnie
- Komponenty w App Routerze są **Server Components** domyślnie. Renderują się na serwerze, mogą `await`-ować dane, nie trafiają do bundla klienta.
- Dodaj `"use client"` **tylko** gdy komponent używa: `useState/useEffect/useRef`, event handlerów (`onClick/onChange`), Context, browser API. Wyciągaj interaktywną część do małego Client Component zamiast oznaczać całą stronę.
- **Nigdy** `"use client"` na `layout.tsx`/`page.tsx` bez potrzeby — wyciągnij island.
- Nasze piloty (`src/app/pilot/*`) są `"use client"` bo to interaktywne ekrany; docelowe strony sklepu rób **server-first**, klient tylko tam gdzie interakcja.

## 2. Dane i mutacje
- **Fetch danych = w Server Components** (`const data = await getX()`), nie React Query w przeglądarce domyślnie. Client-side data tylko dla realnie interaktywnych/live fragmentów.
- **Mutacje = Server Actions** (`"use server"`) lub **Route Handlers** (`app/**/route.ts`). Walidacja inputu **Zod** na wejściu każdej akcji/handlera.
- **Webhooki** (Stripe, POD) = Route Handler `app/api/**/route.ts` (patrz skille `payments`, `pod-fulfillment`).

## 3. Caching — Cache Components (Next 16)
- Next 16 domyślnie **nie cache'uje** fetchy (inaczej niż stary App Router). Cache jest **opt-in** przez dyrektywę **`"use cache"`** (Cache Components).
- `cacheLife('minutes'|'hours'|...)` = czas życia; `cacheTag('products')` = tag; `updateTag('products')` / `revalidateTag` = inwalidacja on-demand.
- Wzorzec dla POD: dane produktu/ceny (z POD API) cache'uj z tagiem + krótkim `cacheLife`; koszt wysyłki licz **live** (bez cache) w koszyku. Szczegóły: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.

## 4. Env vars i sekrety
- `NEXT_PUBLIC_*` = eksponowane do przeglądarki (URL Supabase, publishable key). Wszystko inne = **tylko serwer** (service-role key, Stripe secret, POD API key).
- Pliki z sekretami/DB queries: `import "server-only"` na górze (zapobiega przypadkowemu importowi na kliencie).
- Nowy sekret → dodaj do `.env.example` (bez wartości) + powiadom Artura żeby ustawił w Vercel. Nigdy nie commituj `.env.local`.

## 5. Struktura i konwencje
- App Router: `src/app/**`. Współdzielone bloki UI: **`src/app/pilot/_shell/`** — reużywaj (`AppSidebar`, `MobileNav`, `Composer`, `SegmentedControl`, `ImageActionsMenu`). Grep przed autorstwem (reuse = reguła #1).
- Komponenty shadcn: `src/components/ui/` (styl radix-nova, ikony Lucide, CSS variables). Nie reinventuj — grep bibliotekę.
- Config: **`next.config.ts`** (TS). Request interception (OWASP headers + Supabase session refresh): **`src/proxy.ts`** — Next 16 **przemianował `middleware.ts` → `proxy.ts`** (export funkcji `proxy`, nie `middleware`; codemod `npx @next/codemod@canary middleware-to-proxy .`). Patrz `security` + `supabase-dev-guidelines`.
- Ikony: Lucide React, nigdy emoji w UI. Kolory: CSS tokens (`text-primary`, `bg-card`), nie hex. Mobile-first.

## 6. Gotchas / breaking (Next 16)
- Turbopack jest domyślny (`next dev`/`next build`). Nie zakładaj webpacka.
- Brak `getServerSideProps`/`getStaticProps` (to Pages Router) — używaj Server Components + `generateStaticParams`/`generateMetadata`.
- **`middleware.ts` → `proxy.ts`** (renamed/deprecated w 16.0.0; export `proxy`, `config.matcher` bez zmian).
- **`cookies()`/`headers()` są async** — `const cookieStore = await cookies()`. `params`/`searchParams` również async — `await` je. **Przeczytaj docs, nie zgaduj.**
- `devIndicators` w `next.config.ts` może być `false` (użyte u nas — nakładka kolidowała z sidebarem).

## 7. Weryfikacja
- Przed „gotowe": `npx tsc --noEmit` + `npx eslint` = 0, i **weryfikacja w przeglądarce przez Playwright MCP na `:3000`** (nie agent-browser/:5173). Screenshot + console (0 errorów).

---
**last-verified:** 2026-07-24 · Next 16.2.11 (bundled docs w `node_modules/next/dist/docs/`).
