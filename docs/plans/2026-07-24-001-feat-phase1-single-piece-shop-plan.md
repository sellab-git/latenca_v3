---
title: "feat: Phase 1 — single-piece shop (catalogue → PDP → cart → guest checkout)"
type: feat
status: active
date: 2026-07-24
origin: docs/decisions/flow-screens-spec.md + docs/decisions/prior-art-reuse.md
design_md: null            # no docs/DESIGN.md; design source of truth = src/app/pilot/_shell/ (Ideogram-derived, verified responsive) + flow-screens-spec.md §2
figma_spec: null           # no Figma — build-direct on _shell (Artur, 2026-07-24)
figma_screens: {}
---

# feat: Phase 1 — single-piece shop (catalogue → PDP → cart → guest checkout)

## Przegląd
Zbudować **działający sklep single-piece** (priorytetowa ścieżka — większość kupuje 1 grafikę): katalog → strona produktu z pickerami (materiał/rozmiar/rama) i ceną na żywo → koszyk → **guest checkout**, spięty z modelem danych, **PodProvider(Gelato)**, **Pricing Engine** i **Stripe za `PaymentProvider`**. Podejście **port-first**: ~80% backendu portujemy z wcześniejszych projektów (`docs/decisions/prior-art-reuse.md`), UI budujemy **na `_shell`** (Ideogram-derived), re-anchor EUR→USD, guest-first.

## Ujęcie problemu
Folder 20 ma dziś tylko design base (`_shell` + 4 ekrany pilota) i shadcn — zero backendu/commerce. Trzeba dowieźć minimalny, transakcyjny sklep single-piece, nie przepisując od zera to, co inne projekty Artura już rozwiązały (Gelato, pricing, checkout, webhooki). Strategiczne ostrzeżenie z prior-artu: poprzednie podejścia umierały na przeplanowaniu — **ten plan celuje w shippable spine, nie w kompletną platformę** (zob. źródło: flow-screens-spec.md §0 guardrails).

## Śledzenie wymagań
- R1. Katalog grafik (kuratorowany, source-agnostic) — lista + wejście na PDP. (spec §2.1)
- R2. PDP single-piece: pickery materiał/rozmiar/rama, **cena liczona serwerowo na żywo**, warianty bramkowane dostępnością, social proof, etykiety decyzyjne, progresywna konfiguracja, add-to-cart. (spec §2.2)
- R3. Koszyk (itemized, multi-item, guest). (spec §2.4)
- R4. **Guest checkout** — Stripe za `PaymentProvider`, cena re-derywowana serwerowo, `allowed_countries` = kraj wyceny, weryfikacja pliku druku, tożsamość = email. (spec §2.4)
- R5. **PodProvider(Gelato)** za abstrakcją: quote (koszt+wysyłka), createOrder, status, regionalne UID. (spec §5, prior-art)
- R6. **Pricing Engine**: gross-up z realnych kosztów Gelato → USD pre-tax + Stripe Tax; koszty per-wariant offline sync + weryfikacja quote. (spec §4)
- R7. **Fulfillment na paid-webhooku** (idempotentny, race-safe) → utworzenie zamówienia Gelato + capture realnych kosztów; Gelato webhook (status/tracking). (prior-art)
- R8. **Model danych day-1**: source-agnostic ARTWORK, globalna tabela VARIANT (UID trzymany nie konstruowany), orders/order_items (snapshoty, dual status), order_costs, webhook_events. (spec §4)
- R9. **Content seed + bramka jakości** (rozdzielczość ≥ potrzebnej dla największego rozmiaru + opcjonalny upscaler seam), seed CC0. (spec §8, A1)

## Granice scope'u
- **⛔ `src/app/pilot/**` jest ZAMROŻONE** — makiety referencyjne z Ideograma. NIE edytować, NIE nadpisywać. Produkcyjny shell = **kopia** do `src/components/shell/` (nowe pliki); ekrany sklepu = **nowa grupa `src/app/(shop)/`**. Wszystko nowe = nowe pliki (Artur, 2026-07-24).
- **NIE budujemy w Fazie 1:** wall-builder / designed-wall / kurowane układy (Faza 2), advisor (Faza 2), generowanie AI (przyszły seam), konta/role/payout/moderacja artystów (single-seller), multi-address, uploady użytkownika, recolor (ostatni krok).
- Materiały: pełny zestaw Gelato (papier/canvas/drewno/metal/akryl/pianka) — ale rozmiary z realnego katalogu, nie hardcode.
- Marketplace layer z Printly (Stripe Connect, royalty) — pomijamy.

## ★ Scale & future-proofing — OBOWIĄZKOWE szwy (zwalidowane 2026)
Pełne uzasadnienie + źródła: **`docs/decisions/scale-and-future-proofing.md`**. Werdykt 5 badań: plan jest ~85% scale-ready; fundament (Supabase/Vercel/Stripe/Gelato) nie wymusza przepisywania. Faza 1 zostaje prosta, ale **musi** zaszyć poniższe szwy (skalowanie = potem dokładanie, nie rewrite). **1 realna wada do naprawy + ~20 tanich szwów.**

**⛔ Wada rewrite-class (naprawiona w tym planie):** fulfillment NIE inline w webhooku → **enqueue-then-fulfill** (tabela `fulfillment_jobs` = outbox+DLQ, insert w tej samej transakcji co `markOrderPaid`; webhook zwraca 200 po 2 szybkich zapisach; **worker cron** drenuje `FOR UPDATE SKIP LOCKED` z backoffem; swap na Vercel Queues potem). → Unit 10 przebudowany + **nowy Unit 10b (worker)**.

**Szwy per Unit (poza tym, co już w Unitach):**
- **Unit 1:** `cacheComponents: true` w `next.config.ts` od dnia 1 · DB tylko przez **transaction pooler (6543)** (`DATABASE_URL`), `DIRECT_URL`=5432 tylko migracje · split `dbRead`/`dbWrite` w helperze (pod read-replicas).
- **Unit 2 (migracje):** `orders`/`order_items` **partycjonowane RANGE po miesiącu** od dnia 1 · **indeksy keyset `(sort_col,id)`** + FTS GIN · **szablon RLS** (`(select auth.uid())`, `TO authenticated`/`anon`, indeks predykatu; `get_advisors` gate) · **`fulfillment_jobs`** (outbox/DLQ) · **`search_index_outbox`** · **dwa rekordy per grafika:** `print_master`{url permanent+public, format tiff/png/jpeg **nie webp**, w/h, dpi, color_space} + `web_source` · **explicit `currency`** per order/line.
- **Unit 4/9:** cena zawsze integer minor units + **explicit `currency`** (nie zaszywać USD w semantyce).
- **Unit 5:** czytania katalogu przez **`use cache` + `cacheTag` + serializowalne DTO** (nie wiersze ORM) · **stub `revalidateCatalog(tags)`** + chroniona route spięta z sync-jobem · **interfejs `SearchProvider`** + Phase-1 `PostgresSearchProvider` (stored `tsvector` GIN + `pg_trgm` + fasety GROUP BY, pole `facets` wypełnione) + **uśpiony `enqueueIndexSync`** + `similarTo`→NotImplemented. Cel skali: **Typesense** (nie Algolia/Elastic; Supabase nie ma ParadeDB).
- **Unit 8 (koszyk):** **stateless client-side** (localStorage `{pod_product_uid, qty}`, **nigdy ceny**); serwer re-waliduje cenę+wysyłkę quote'em Gelato przy checkoutcie; **BEZ tabeli `guest_carts`**; order = `email` + nullable `user_id`.
- **Unit 11 (assety):** interfejsy **`AssetStore`** (S3-shaped; Phase-1 `SupabaseAssetStore`) + **`ImageDelivery.derivativeUrl()`** (jeden choke-point na web-obrazy; Phase-1 custom Next `loader`; **NIE domyślny `<Image>` optimizer Vercela**) + **`ingest()` w kształcie enqueue** (inline teraz; content-addressed sha256; dead-letter state). Cel skali: **R2 + Cloudflare Images**; Supabase Storage tylko user-private.

**Zdecydowane cele skali (nie re-litygować):** search=Typesense · storage/CDN=Cloudflare R2 + Images · queue=Vercel Cron→worker (potem Vercel Queues) · semantic=pgvector/Typesense · multi-currency=Stripe Adaptive Pricing. **Nic z tego NIE budujemy w Fazie 1** — tylko szwy, żeby było dokładalne.

## Kontekst i research

### Relevantny kod i wzorce (do naśladowania / portu)
- **Design base (READ-ONLY):** `src/app/pilot/_shell/{app-sidebar,mobile-nav,composer,segmented-control,image-actions-menu,theme}.tsx` + ekrany `src/app/pilot/{image-detail,home,styles,canvas}/page.tsx`. shadcn w `src/components/ui/*`, `src/lib/utils.ts`, paleta w `src/app/globals.css`.
- **PodProvider:** `07. Motowalls/motowalls/lib/gelato.ts` (ciała) + `12. Printly/printly/lib/fulfillment/provider.ts` (interfejs, `mapGelatoStage`, sandbox-draft, quote-tier sort-fix). (prior-art §PodProvider)
- **Pricing Engine:** `07. Motowalls/…/lib/pricing.ts` + `margin-config.ts` + `margin-calculator.ts` (gross-up, NICE_PRICE_GRID, stałe). Re-anchor USD.
- **Variant table:** `07. Motowalls/…/supabase/migrations/006_gelato_flat_pricing.sql` + `types/gelato-pricing.ts`.
- **Orders schema:** `12. Printly/…/supabase/migrations/0020_orders_baseline.sql` + `0021` (dual status, snapshoty, tracked-only CHECK) + Motowalls `order_costs`.
- **Checkout + webhooki:** `07. Motowalls/…/app/api/stripe/{create-checkout-session,webhook}/route.ts` + `app/api/gelato/webhook/[secret]/route.ts`; `12. Printly/…/lib/checkout/stripe-session.ts` + `lib/money/*`; `01. Pawtraits/…/lib/webhook-idempotency.ts` + `circuit-breaker.ts` + `api-response.ts` + `validation.ts` + `rate-limit.ts`.
- **Katalog + seed:** `17. Latenca/web/src/lib/catalog.ts` + `17…/catalog-demo/catalog.json` (16 CC0).
- **Supabase SSR (Next 16):** wzorzec z `.claude/skills/supabase-dev-guidelines/resources/latenca-nextjs-ssr.md`; UWAGA: middleware = **`proxy.ts`** (nie `middleware.ts`), `cookies()`/`headers()` async.

### Wiedza instytucjonalna
- `docs/decisions/prior-art-reuse.md` — pełna mapa portów + **kwirki Gelato** (WEBP odrzucany, brak auto-rotacji, 4mm spad, `orderReferenceId` NIE do dedup, UID-y per-materiał nieregularne → trzymać w DB, pliki druku permanentne+public 300 DPI, regionalne UID US/AU, framed-canvas price null).
- `.claude/rules/latenca-overrides.md` — Next 16 / Supabase-SSR / PaymentProvider / PodProvider / testing boundary (TDD na logice, light na UI, weryfikacja w Playwright).
- `docs/solutions/` — seed solutions (Next 16 middleware→proxy, image-detail overflow).

### Referencje zewnętrzne
- Gelato API: order `order.gelatoapis.com/v4`, product `product.gelatoapis.com/v3`, `X-API-KEY`, quote `POST /v4/orders:quote` (koszt+wysyłka razem). Zweryfikować sandbox-em przed zaufaniem (prior-art caveat: docs driftują od kodu).
- Stripe: hosted Checkout Session + webhook (raw body, `constructEvent`, idempotent), Stripe Tax (tax-exclusive, USD).

## Kluczowe decyzje techniczne
- **Frozen originals / new files:** produkcja w `src/components/shell/` + `src/app/(shop)/` + `src/lib/*`; `src/app/pilot/**` nietknięte. → chroni makiety Ideograma.
- **Port, nie re-author:** backend adaptowany 1:1 z Motowalls/Printly/Pawtraits, tylko re-anchor EUR/VAT→USD (pre-tax + Stripe Tax) i wpięcie za interfejsy `PodProvider`/`PaymentProvider` (których oryginały nie miały).
- **Cena zawsze serwerowo, minor units (centy), nigdy z klienta.** Klient-side cena = tripwire → `PRICE_MISMATCH`.
- **Wariant globalny** (size×materiał×rama), ~40–100 wierszy, `pod_product_uid` + `_us`/`_au` trzymane w DB. ARTWORK dokłada tylko plik+orientację.
- **Koszt Gelato:** stored per-wariant + shipping table (offline sync job) + weryfikacja `/v4/orders:quote` przy zamówieniu — cart nigdy nie blokuje na request-time price call (framed-canvas price null, brak flat shipping API).
- **Fulfillment na paid-webhooku** (nie redirect), idempotencja przez `*_webhook_events(event_id PK)`, race-guard `{count:'exact'}`, write-then-email, Gelato order w osobnym try/catch → DLQ status.
- **Testy:** TDD na logice (pricing, cart math, PodProvider adapter mapping, Zod schemas) — Vitest. UI light: weryfikacja Playwrightem (1440/768/390). (latenca-overrides testing boundary)

## Otwarte pytania

### Rozwiązane podczas planowania
- Gdzie żyje produkcyjny shell? → `src/components/shell/` (kopia, nie move; pilot zamrożony).
- Cena live incl. shipping mimo braku flat shipping API? → stored cost + shipping table + quote-at-order (nie request-time).
- Auth w Fazie 1? → **guest-first, bez kont** (social+password to Faza 1b — spec A4). Anonimowa sesja Supabase opcjonalna dla koszyka; MVP może trzymać koszyk klient-side + email przy checkoutcie.

### Odroczone do implementacji
- Dokładne UID-y Gelato per (materiał×rozmiar) — harvestować skryptem z katalogu Gelato (jak Pawtraits `scripts/gelato-*.ts`), wartości nieznane do dotknięcia API.
- Finalne stałe Pricing Engine (margin/returns/marketing/fixed %) — kalibrować z realnych kosztów; start od defaultów Motowalls (Stripe 3.5/zwroty 5/marketing 10/fixed 10, marża 30/20%).
- ✅ Koszyk gościa = **stateless client-side (localStorage)**, NIE anonimowa sesja Supabase — rozstrzygnięte scale-research (§scale, Unit 8).
- Rehost obrazów CC0 (muzealny CDN blokuje `next/image`) — Storage bucket vs zewnętrzny CDN.

## Implementation Units

Pogrupowane w pod-fazy: **A. Fundament & dane** · **B. POD & pricing** · **C. Ekrany czytania** · **D. Koszyk & checkout & fulfillment** · **E. Treść**.

### A. Fundament & dane

- [ ] **Unit 1: Fundament — zależności, env, Supabase SSR, tooling testów**

**Cel:** Postawić szkielet techniczny Fazy 1 bez dotykania pilota.
**Wymagania:** R8 (podstawa), enabler dla wszystkich.
**Zależności:** brak.
**Pliki:**
- Modyfikuj: `package.json` (dodaj `@supabase/ssr`, `@supabase/supabase-js`, `stripe`, `zod`, `server-only`; dev: `vitest`, `@vitejs/plugin-react`, `@testing-library/*` opcjonalnie; skrypty `typecheck`, `test`)
- Stwórz: `.env.example` (SUPABASE_URL/ANON/SERVICE, STRIPE_SECRET/WEBHOOK, GELATO_API_KEY/SANDBOX/WEBHOOK_SECRET, CRON_SECRET, SITE_URL)
- Stwórz: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/admin.ts` (`import "server-only"`, publishable vs secret — wzór Pawtraits `lib/supabase.ts`)
- Stwórz: `proxy.ts` (session refresh + OWASP headers; cron/webhook secret bypass PRZED auth; NIE `middleware.ts`)
- Stwórz: `vitest.config.ts`, `src/lib/api-response.ts`, `src/lib/validation.ts`, `src/lib/rate-limit.ts` (port Pawtraits/Motowalls)
- Test (unit): `src/lib/validation.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration, next-guidelines
**Podejście:** Czysty bootstrap; żadnej logiki biznesowej. Zweryfikować `proxy.ts` (Next 16 codemod middleware→proxy). Sekrety tylko w `.env.example` + notyfikacja Artura o zmiennych do ustawienia.
**Wzorce do naśladowania:** `01. Pawtraits/…/lib/{supabase,api-response,validation,rate-limit}.ts`; `.claude/skills/supabase-dev-guidelines/resources/latenca-nextjs-ssr.md`.
**Scenariusze testowe:**
- [Unit] `validateBody` odrzuca zły payload z typed error; przyjmuje poprawny.
- [Unit] `apiOk/apiError` zwracają ustandaryzowany kształt `{ok,error,...}`.
**Weryfikacja:**
- `npx tsc --noEmit` przechodzi bez błędów.
- `pnpm vitest run` — testy validation przechodzą.
- `pnpm build` przechodzi (proxy.ts kompiluje się jako Node).

- [ ] **Unit 2: Model danych — migracje Supabase (catalog / variant / orders / webhook_events) + typy**

**Cel:** Schemat day-1: source-agnostic ARTWORK, globalna VARIANT, orders/order_items, order_costs, webhook_events, RLS.
**Wymagania:** R8, R1, R2, R7.
**Zależności:** Unit 1.
**Pliki:**
- Stwórz: `supabase/migrations/0001_catalog.sql` (`artists`, `artworks` z `source`+`collection`+`source_image_url`+pixel dims+orientation+`allowed_crops`, `collections`)
- Stwórz: `supabase/migrations/0002_variants.sql` (globalna `product_variants` keyed (size,material,frame,extras), `pod_product_uid`+`_us`/`_au`, `production_cost_cents`, `display_price_cents`, `is_active`, `is_available`; port Motowalls 006)
- Stwórz: `supabase/migrations/0003_orders.sql` (`orders`+`order_items` integer cents, dual status enums, snapshot columns, `dispatch_after`, tracked-only CHECK; port Printly 0020/0021) + `order_costs`
- Stwórz: `supabase/migrations/0004_webhooks.sql` (`stripe_webhook_events`, `gelato_webhook_events` — event_id PK)
- Stwórz: `supabase/migrations/0005_rls.sql` (public read na aktywnych artworks/variants; orders = service_role only; buyer reads own via token)
- Stwórz: `src/lib/db/types.ts` (wygenerowane typy lub ręczne interfejsy)
- Test (unit): `supabase/migrations/__smoke__/rls.test.ts` LUB smoke SQL note (odroczone do e2e env)
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration
**Podejście:** Portować schematy 1:1, wyciąć kolumny `artist_*`/`payout_*` (single-seller). Ceny w centach. RLS: server-only tabele zablokowane `auth.role()='service_role'`.
**Wzorce do naśladowania:** Motowalls `006_gelato_flat_pricing.sql`; Printly `0020_orders_baseline.sql`+`0021`; Pawtraits `migration 002` (RLS).
**Scenariusze testowe:**
- [Unit] Trigger/compute `display_price_cents = COALESCE(override, auto)` zwraca poprawną cenę.
- [Manual] Migracje aplikują się czysto na świeżej bazie Supabase (`supabase db push`) — weryfikacja przy secie env.
**Weryfikacja:**
- `npx tsc --noEmit` przechodzi (typy DB kompilują się).
- Grep: brak kolumn `artist_payout`/`royalty` w migracjach (`rg -i 'payout|royalty' supabase/migrations` = brak trafień).

### B. POD & pricing

- [ ] **Unit 3: PodProvider (Gelato) za abstrakcją + quote (koszt+wysyłka)**

**Cel:** Gelato za interfejsem `PodProvider`; jedno `quote()` zwraca koszt produkcji + wysyłkę.
**Wymagania:** R5, R6 (źródło kosztu).
**Zależności:** Unit 1.
**Pliki:**
- Stwórz: `src/lib/pod/provider.ts` (interfejs `PodProvider`: `createOrder`/`getOrder`/`cancel`/`quote`/`health` + factory `getPodProvider()`)
- Stwórz: `src/lib/pod/gelato.ts` (`GelatoPodProvider` — port Motowalls `lib/gelato.ts` bodies; endpointy v4/v3, `X-API-KEY`, `resolveGelatoUid(product,country)`, sandbox `orderType:"draft"`, quote-tier sort-fix)
- Stwórz: `src/lib/pod/default-addresses.ts` (adres per kraj do wyceny przed adresem klienta)
- Stwórz: `src/lib/pod/types.ts` (Zod schematy odpowiedzi Gelato, `.passthrough()`)
- Test (unit): `src/lib/pod/gelato.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration, pod-fulfillment
**Podejście:** Wrap Motowalls bodies za interfejsem Printly. `quote()` = `POST /v4/orders:quote` → `{shipmentMethods[], productCosts[]}`. Kwirki: WEBP odrzucany, brak auto-rotacji, `orderReferenceId` NIE do dedup, pliki druku permanentne+public.
**Notatka wykonawcza:** Test-first na mapowaniu odpowiedzi Gelato (mock fetch) + sort-fix quote-tier (naiwny `.find()` bierze najdroższy tier).
**Wzorce do naśladowania:** Motowalls `lib/gelato.ts` + `app/api/gelato/quote/route.ts`; Printly `lib/fulfillment/provider.ts` (`mapGelatoStage`).
**Scenariusze testowe:**
- [Unit] `mapGelatoStage()` mapuje statusy vendora → `pending|in_production|shipped|delivered|cancelled|failed`.
- [Unit] `quote()` parsuje cost+shipping; sort-fix wybiera właściwy tier (nie najdroższy).
- [Unit] `resolveGelatoUid` zwraca `_us`/`_au` wg kraju.
- [Unit] Zod odrzuca odpowiedź bez wymaganych pól.
**Weryfikacja:**
- `pnpm vitest run src/lib/pod` — wszystkie zielone.
- `npx tsc --noEmit` przechodzi.
- [Manual/Operator] Realne `quote` sandbox-owe dla 1 SKU zwraca sensowny koszt (weryfikacja przy secie `GELATO_API_KEY`).

- [ ] **Unit 4: Pricing Engine (gross-up, USD) + offline cost-sync**

**Cel:** Retail liczone z realnych kosztów Gelato, USD pre-tax + Stripe Tax; koszty synchronizowane offline.
**Wymagania:** R6.
**Zależności:** Unit 2, Unit 3.
**Pliki:**
- Stwórz: `src/lib/pricing/engine.ts` (port Motowalls `pricing.ts` — `netto = cost/(1−Σcosts−margin)`, NICE_PRICE_GRID round-up; **bez VAT step** → pre-tax retail)
- Stwórz: `src/lib/pricing/config.ts` (port `margin-config.ts` — stałe %, per-catalog margin, USD)
- Stwórz: `src/app/api/cron/sync-costs/route.ts` (Bearer CRON_SECRET; fetch Gelato prices → zapis `production_cost_cents` + shipping table)
- Test (unit): `src/lib/pricing/engine.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration, pod-fulfillment, payments
**Podejście:** Stored cost per-wariant (nie request-time); Stripe Tax na checkoutcie (nie VAT-inclusive). Jeden `computeRetailCents(cost, catalog)` jako single source. Stałe % tunable w config.
**Notatka wykonawcza:** Test-first — pricing math to serce ekonomii; happy + edge (cost=0, margin sum ≥ 1 → throw, round-up do grid).
**Wzorce do naśladowania:** Motowalls `lib/pricing.ts`, `margin-config.ts`, `margin-calculator.ts`; `15. Latenca/docs/02-koszty-i-scenariusze.md` (realne liczby do sanity-check).
**Scenariusze testowe:**
- [Unit] `computeRetailCents(700, 'poster')` = poprawny gross-up zaokrąglony w górę do NICE grid.
- [Unit] Σcosts+margin ≥ 1 → rzuca typed error (nie ujemna/nieskończona cena).
- [Unit] Wynik zawsze w centach (integer), nigdy float.
**Weryfikacja:**
- `pnpm vitest run src/lib/pricing` — zielone.
- Grep: brak `*(1+VAT)`/`vat` w `engine.ts` (`rg -i vat src/lib/pricing/engine.ts` = brak) — potwierdza re-anchor USD.

### C. Ekrany czytania (na `_shell`, nowe pliki)

- [ ] **Unit 5: Produkcyjny shell + catalog read model**

**Cel:** Skopiować `_shell` do `src/components/shell/` (nowe pliki) i zbudować source-agnostic read model katalogu.
**Wymagania:** R1, granica scope (frozen pilot).
**Zależności:** Unit 2.
**Pliki:**
- Stwórz: `src/components/shell/{app-sidebar,mobile-nav,segmented-control,image-actions-menu,theme,composer}.tsx` (KOPIA z `src/app/pilot/_shell/` — pilot NIETKNIĘTY)
- Stwórz: `src/lib/catalog/service.ts` (port 17 `catalog.ts` — pure, `source`+`collection`, minor units, `slugify`, keyset pagination, Postgres FTS)
- Stwórz: `src/lib/catalog/types.ts`
- Test (unit): `src/lib/catalog/service.test.ts`
**Delegate to:** feature-builder-fullstack
**Skills in play:** tailwind-react-guidelines, ux-ui-guidelines, supabase-dev-guidelines, security, sentry-integration
**Podejście:** Kopia shell = 1:1, tylko poprawić importy (`@/components/shell/...`). Catalog service czysty, importuje tylko z `lib/`. FTS `tsvector`, BEZ pgvector (over-built dla Fazy 1).
**Wzorce do naśladowania:** `src/app/pilot/_shell/*` (kopiować), `17. Latenca/web/src/lib/catalog.ts`, Printly `lib/catalog/service.ts`.
**Scenariusze testowe:**
- [Unit] `slugify` + mapowanie Artwork→Product (source/collection zachowane, cena w centach).
- [Unit] Paginacja keyset zwraca stabilny cursor.
- [E2E] Import komponentu shell w nowej stronie renderuje się bez błędu (Playwright smoke).
**Weryfikacja:**
- `pnpm vitest run src/lib/catalog` — zielone.
- `npx tsc --noEmit` przechodzi.
- Grep: `src/app/pilot/` bez zmian (`git diff --stat src/app/pilot` = brak) — oryginały nietknięte.

- [ ] **Unit 6: Katalog (strona) na `_shell`**

**Cel:** Strona katalogu — feed kuratorowanych grafik, wejście na PDP.
**Wymagania:** R1.
**Zależności:** Unit 5.
**Pliki:**
- Stwórz: `src/app/(shop)/page.tsx` (Server Component; katalog + lensy; reuse layout z pilot `home`)
- Stwórz: `src/app/(shop)/_components/product-card.tsx` (nowy — odwzorowanie `FeedCard` z pilota; likable, klik → PDP)
- Stwórz: `src/app/(shop)/layout.tsx` (shell chrome z `src/components/shell/`)
- Test (e2e): Scenariusz Playwright (niżej)
**Delegate to:** feature-builder-ui
**Skills in play:** tailwind-react-guidelines, ux-ui-guidelines
**Podejście:** Server Component domyślnie; dane przez catalog service. ProductCard = nowy plik wzorowany na FeedCard (NIE edytować pilota). Responsywność jak `_shell`.
**Wzorce do naśladowania:** `src/app/pilot/home/page.tsx` (feed/masonry), `src/app/pilot/_shell/app-sidebar.tsx`.
**Scenariusze testowe:**
- [E2E] Otwórz `/`, snapshot; widoczna siatka ProductCard; klik karty → nawigacja na `/product/<slug>`. Sprawdź 1440/768/390 (Playwright resize), czysta konsola.
**Weryfikacja:**
- `pnpm build` przechodzi.
- [E2E] Playwright: katalog renderuje ≥1 kartę, klik prowadzi na PDP, brak błędów konsoli na 1440/768/390.

- [ ] **Unit 7: PDP single-piece na `_shell` (pickery + cena na żywo)**

**Cel:** Strona produktu z pickerami i ceną liczoną serwerowo.
**Wymagania:** R2.
**Zależności:** Unit 4, Unit 5, Unit 6.
**Pliki:**
- Stwórz: `src/app/(shop)/product/[slug]/page.tsx` (Server Component; odwzorowanie układu `image-detail`)
- Stwórz: `src/app/(shop)/product/[slug]/_components/buy-box.tsx` (Client — pickery materiał/rozmiar/rama przez `SegmentedControl`, warianty bramkowane dostępnością, etykiety „Most Popular/Best Value", add-to-cart)
- Stwórz: `src/app/(shop)/product/[slug]/_components/price.tsx` (cena z Server Action / route — nigdy z klienta)
- Stwórz: `src/app/api/price/route.ts` LUB Server Action `getVariantPrice` (re-derive z variant/pricing)
- Test (unit): `src/app/api/price/route.test.ts` (albo action test)
- Test (e2e): Scenariusz Playwright (niżej)
**Delegate to:** feature-builder-fullstack
**Skills in play:** tailwind-react-guidelines, ux-ui-guidelines, supabase-dev-guidelines, security, sentry-integration
**Podejście:** Cena zawsze serwerowo (variant → pricing engine); zmiana rozmiaru/materiału → refetch ceny. Niedostępne warianty disabled. Progresywna konfiguracja: rama jako wtórny krok. Social proof + attribution + krótkie bio artysty (spec C2).
**Wzorce do naśladowania:** `src/app/pilot/image-detail/page.tsx` (układ, prawy panel), `src/components/shell/segmented-control.tsx`; Displate/Andy okay PDP z `docs/teardowns/*`.
**Scenariusze testowe:**
- [Unit] Endpoint/akcja ceny liczy tę samą wartość co pricing engine dla (variant); ignoruje cenę z klienta.
- [E2E] Otwórz `/product/<slug>`; zmień rozmiar → cena się aktualizuje; niedostępny rozmiar jest disabled; „Add to cart" dodaje pozycję. 1440/768/390.
**Weryfikacja:**
- `pnpm vitest run` (test ceny) zielony.
- [E2E] Playwright: zmiana rozmiaru zmienia cenę; disabled variant nieklikany; add-to-cart zwiększa licznik koszyka.

### D. Koszyk, checkout, fulfillment

- [ ] **Unit 8: Koszyk (itemized, guest, multi-item)**

**Cel:** Koszyk gościa z pozycjami, edycją, sumą liczoną serwerowo.
**Wymagania:** R3.
**Zależności:** Unit 7.
**Pliki:**
- Stwórz: `src/lib/cart/cart.ts` (model koszyka; suma serwerowo z variant/pricing; centy)
- Stwórz: `src/app/(shop)/cart/page.tsx` (lista pozycji, edycja/usuń, suma)
- Stwórz: `src/lib/cart/store.ts` (**stateless client-side** — localStorage, trzyma TYLKO `{pod_product_uid, qty}`, NIGDY cen; **BEZ tabeli `guest_carts`**)
- Test (unit): `src/lib/cart/cart.test.ts`
**Delegate to:** feature-builder-fullstack
**Skills in play:** tailwind-react-guidelines, ux-ui-guidelines, supabase-dev-guidelines, security
**Podejście:** ⭐ **Stateless client cart** (scale-and-future-proofing.md §E): localStorage `{pod_product_uid, qty}`, zero wierszy DB per gość (brak bloatu na skali). **Suma i wysyłka re-walidowane serwerowo** (variant/pricing + quote Gelato) przy renderze/checkoutcie — koszyk trustless-by-design (klient nie trzyma cen). Multi-item. Order dostaje `email` + nullable `user_id` (konwersja na konto potem back-fill po emailu).
**Scenariusze testowe:**
- [Unit] Suma koszyka = Σ cen wariantów serwerowo; dodanie/usunięcie/zmiana ilości przelicza.
- [E2E] Dodaj 2 różne produkty → koszyk pokazuje 2 pozycje + poprawną sumę; usuń jedną → suma maleje. 1440/390.
**Weryfikacja:**
- `pnpm vitest run src/lib/cart` zielone.
- [E2E] Playwright: koszyk itemized, suma poprawna po edycji.

- [ ] **Unit 9: Guest checkout + Stripe za `PaymentProvider`**

**Cel:** Bezpieczny checkout gościa; cena re-derywowana serwerowo; Stripe za abstrakcją.
**Wymagania:** R4.
**Zależności:** Unit 8, Unit 4.
**Pliki:**
- Stwórz: `src/lib/payments/provider.ts` (interfejs `PaymentProvider` — scope: refund + session create; factory)
- Stwórz: `src/lib/payments/stripe.ts` (impl Stripe; Checkout Session, Stripe Tax)
- Stwórz: `src/lib/checkout/create-session.ts` (`import "server-only"`; re-derive każdą cenę z variant/pricing; `buyer_id` z sesji/NULL gość + `customer_email`; weryfikuj `pod_product_uid` + istnienie pliku druku; lock `allowed_countries` do kraju wyceny; order `pending_payment`)
- Stwórz: `src/app/(shop)/checkout/page.tsx` + `src/app/api/checkout/route.ts` (rate-limited)
- Stwórz: `src/lib/money/types.ts` (port Printly — integer cents, throw on currency mismatch)
- Test (unit): `src/lib/checkout/create-session.test.ts`, `src/lib/money/types.test.ts`
**Delegate to:** feature-builder-fullstack
**Skills in play:** tailwind-react-guidelines, ux-ui-guidelines, supabase-dev-guidelines, security, sentry-integration, payments
**Podejście:** `server-only` NIE `use server` (bug Printly). Cena z klienta = tripwire → `PRICE_MISMATCH`. Rate-limit przed `sk_live`. Gość = `buyer_id NULL` + email. Circuit-breaker wokół providera.
**Notatka wykonawcza:** Test-first na re-derywacji ceny i odrzuceniu ceny z klienta (bezpieczeństwo pieniędzy).
**Wzorce do naśladowania:** Printly `lib/checkout/stripe-session.ts`; Motowalls `app/api/stripe/create-checkout-session/route.ts`; Pawtraits `lib/circuit-breaker.ts`.
**Scenariusze testowe:**
- [Unit] Zmanipulowana cena z klienta → `PRICE_MISMATCH`, brak sesji.
- [Unit] Brak realnego `print_file_url` → checkout odrzucony.
- [Unit] Gość bez konta → order z `buyer_id NULL` + email.
- [E2E] Checkout tworzy sesję Stripe (sandbox) i przekierowuje; order = `pending_payment`. (Operator: realna płatność testowa.)
**Weryfikacja:**
- `pnpm vitest run src/lib/{checkout,money}` zielone.
- Grep: `create-session.ts` zawiera `server-only`, nie `use server` (`rg 'use server' src/lib/checkout` = brak).
- `npx tsc --noEmit` przechodzi.

- [ ] **Unit 10: Stripe webhook — ENQUEUE (nie fulfill inline) + Gelato webhook**

**Cel:** Paid-webhook tylko weryfikuje → zapisuje/enqueue → 200 (wzorzec Stripe). Fulfillment robi worker (Unit 10b). Gelato webhook = status/tracking.
**Wymagania:** R7.
**Zależności:** Unit 9, Unit 2 (`fulfillment_jobs`).
**Pliki:**
- Stwórz: `src/app/api/webhooks/stripe/route.ts` (`runtime nodejs`, raw body, `constructEvent`; idempotencja `stripe_webhook_events(event_id PK) ON CONFLICT`; **w JEDNEJ transakcji: `markOrderPaid` + insert `fulfillment_jobs(status=pending)` = outbox**; race-guard `{count:'exact'}`→500 retry; write-then-email; **BEZ `createOrder` inline**)
- Stwórz: `src/app/api/webhooks/gelato/[secret]/route.ts` (secret-path auth; idempotencja `gelato_webhook_events`; status map; once-only shipped email guard; write real `order_costs`)
- Stwórz: `src/lib/webhook-idempotency.ts` (port Pawtraits) — jeśli nie z Unit 1
- Test (unit): `src/lib/webhook-idempotency.test.ts`, `src/app/api/webhooks/stripe/route.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration, payments, pod-fulfillment
**Podejście:** ⭐ **enqueue-then-fulfill** (scale-and-future-proofing.md): webhook = verify→persist/enqueue→2xx, zero wolnych wywołań zewnętrznych. Order-paid + job w **jednej transakcji** (zamyka dual-write). Gelato NIE podpisuje → secret path. `orderReferenceId` NIE do dedup → dedup po `vendor_order_id`. 200 na błędy logiki (`processing_error`), 500 tylko na race.
**Notatka wykonawcza:** Test-first na idempotencji (duplikat event → ack, brak podwójnego joba) + transakcyjności outboxa (paid ⇒ job zawsze istnieje).
**Wzorce do naśladowania:** Motowalls/Printly webhooki (idempotencja) — ale **przenieś `createOrder` z webhooka do workera** (poprawka scale); Pawtraits `lib/webhook-idempotency.ts`.
**Scenariusze testowe:**
- [Unit] Duplikat `event.id` → `ON CONFLICT` → 200 ack, brak drugiego joba.
- [Unit] `markOrderPaid` i insert `fulfillment_jobs` są atomowe (rollback obu przy błędzie) → nigdy paid-bez-joba.
- [Unit] Webhook przed commitem ordera (`count=0`) → 500 (Stripe retry).
**Weryfikacja:**
- `pnpm vitest run` (webhooki + idempotencja + transakcyjność) zielone.
- Grep: brak `createOrder` w `webhooks/stripe/route.ts` (`rg 'createOrder' src/app/api/webhooks/stripe` = brak) — fulfillment NIE inline.

- [ ] **Unit 10b: Fulfillment worker — drenaż `fulfillment_jobs` → Gelato order + capture kosztów**

**Cel:** Worker cron drenuje kolejkę fulfillmentu, tworzy order Gelato (idempotentnie), zapisuje realne koszty; backoff + failed state.
**Wymagania:** R7.
**Zależności:** Unit 10, Unit 3.
**Pliki:**
- Stwórz: `src/app/api/cron/fulfill/route.ts` (Bearer CRON_SECRET; `SELECT … WHERE status='pending' AND next_attempt_at<=now() FOR UPDATE SKIP LOCKED LIMIT n`; `podProvider.createOrder` idempotentnie po `vendor_order_id`; sukces→`done`+`order_costs`; błąd→backoff `attempts++`/`next_attempt_at`; trwały błąd→`failed`)
- Stwórz: `vercel.json` LUB config crona (`/api/cron/fulfill` co ~1 min; `/api/cron/sync-costs` z Unit 4)
- Test (unit): `src/app/api/cron/fulfill/route.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, sentry-integration, pod-fulfillment, payments
**Podejście:** ⭐ Portable worker (Vercel Cron→route polling) — swap na Vercel Queues potem = zmiana wewnątrz workera. `SKIP LOCKED` = bezpieczna współbieżność. Idempotencja: przed `createOrder` sprawdź zapisany `vendor_order_id`.
**Notatka wykonawcza:** Test-first na idempotencji workera (dwa przebiegi na tym samym jobie → jeden order Gelato) i backoffie.
**Wzorce do naśladowania:** `scale-and-future-proofing.md` §E; Render „Next.js background jobs + Postgres"; Motowalls `app/api/cron/*` (Bearer auth).
**Scenariusze testowe:**
- [Unit] Job `pending` → worker tworzy order Gelato, ustawia `done`, zapisuje `order_costs`.
- [Unit] Dwa równoległe przebiegi (`SKIP LOCKED`) → jeden order (brak duplikatu).
- [Unit] Błąd Gelato → `attempts++`, `next_attempt_at` w przyszłości; po N prób → `failed` (nie 500 w nieskończoność).
**Weryfikacja:**
- `pnpm vitest run src/app/api/cron/fulfill` zielone.
- `npx tsc --noEmit` przechodzi.
- [Operator] E2E sandbox: Stripe paid → job `pending` → cron → order Gelato draft → `done` + `order_costs`; shipped webhook aktualizuje status.

### E. Treść

- [ ] **Unit 11: Content import + bramka jakości + seed CC0**

**Cel:** Pipeline importu grafik source-agnostic z bramką rozdzielczości + seed 16 CC0.
**Wymagania:** R9, R1.
**Zależności:** Unit 2, Unit 5.
**Pliki:**
- Stwórz: `src/lib/content/import.ts` (source-agnostic; **bramka jakości**: min rozdzielczość dla największego rozmiaru @300 DPI; seam na upscaler)
- Stwórz: `scripts/seed-catalog.ts` (import 16 CC0 z `17…/catalog-demo/catalog.json`; rehost obrazów do Storage — muzealny CDN blokuje `next/image`)
- Stwórz: `supabase/migrations/0006_seed_note.sql` LUB seed skrypt
- Test (unit): `src/lib/content/import.test.ts`
**Delegate to:** feature-builder-data
**Skills in play:** supabase-dev-guidelines, security, pod-fulfillment
**Podejście:** Bramka: odrzuć grafikę poniżej DPI potrzebnego dla max rozmiaru (jak 17 ≥3000px). Rehost na Storage (permanentne+public URL — wymóg Gelato). Upscaler = opcjonalny seam (nie MVP-blokujący). Legal: tylko CC0/AI/creator, NIE free-stock.
**Scenariusze testowe:**
- [Unit] Grafika poniżej progu DPI → odrzucona z powodem; powyżej → przyjęta.
- [Unit] Seed CC0 mapuje IIIF URL + pixel dims na ARTWORK z `source='public-domain'`.
**Weryfikacja:**
- `pnpm vitest run src/lib/content` zielone.
- [Manual/Operator] Seed wypełnia katalog 16 grafikami widocznymi na `/` (przy secie Supabase).

## Wpływ systemowy
- **Graf interakcji:** paid-webhook Stripe → order insert → `podProvider.createOrder` → Gelato webhook → status/tracking. Checkout → PaymentProvider → Stripe. Cart/PDP → pricing engine → variant/POD cost.
- **Propagacja błędów:** błędy logiki webhooka → 200 + `processing_error` (bez retry burzy); race → 500 (retry). Gelato create fail → DLQ status, nie 500 do Stripe. Provider down → circuit-breaker 503.
- **Ryzyka cyklu życia stanu:** redirect-vs-webhook race (akceptuj `pending_payment` w post-payment); duplikaty Gelato (dedup po `vendor_order_id`); orphan order przy Stripe fail (cleanup).
- **Parytet API:** `PodProvider`/`PaymentProvider` — druga impl (Printful/inna bramka) musi wpiąć się bez zmian w logice.
- **Pokrycie integracyjne:** pełny flow paid→Gelato→shipped tylko przez sandbox E2E (Operator), nie unit testy.

## Ryzyka i zależności
- **Env zależne od Artura:** SUPABASE_*, STRIPE_*, GELATO_* muszą być ustawione (Unit 1 `.env.example` + notyfikacja) — inaczej E2E/sandbox nie ruszą.
- **Docs prior-artu driftują od kodu** — portować z `lib/`+routes, weryfikować sandbox-em.
- **Gelato price null (framed-canvas) / brak flat shipping API** → stored cost + quote-at-order (Unit 4), nie request-time.
- **AI-print quality** (jeśli A1 self-generated) — bramka jakości (Unit 11) + upscaler seam; realny test-print odroczony.
- **`.env.e2e` nie istnieje** — pełne autonomiczne E2E niedostępne; scenariusze `[E2E]` weryfikować Playwrightem lokalnie, sandbox-owe kroki jako `[Operator]`.

## Dokumentacja / Notatki operacyjne
- Po Unit 1: zaktualizować `.env.example` + powiadomić Artura o zmiennych do ustawienia w Vercel.
- Wpiąć wzorce z prior-artu do skilli `pod-fulfillment` + `payments` (kwirki Gelato, checkout hard-rules) — osobny task.
- `[deploy]` tag TYLKO gdy Artur jawnie powie deploy. Auto-push repo.

## Źródła i referencje
- **Dokumenty źródłowe:** [flow-screens-spec.md](../decisions/flow-screens-spec.md) (§0–§10) · [prior-art-reuse.md](../decisions/prior-art-reuse.md) (mapa portów)
- Design base (READ-ONLY): `src/app/pilot/_shell/*`, `src/app/pilot/*/page.tsx`
- Prior-art kod: `07. Motowalls/motowalls/lib/{gelato,pricing,margin-config}.ts`; `12. Printly/printly/{lib/fulfillment/provider.ts, supabase/migrations/0020_orders_baseline.sql}`; `01. Pawtraits/…/lib/{webhook-idempotency,circuit-breaker,api-response}.ts`; `17. Latenca/web/src/lib/catalog.ts`
- Reguły: `.claude/rules/latenca-overrides.md`, `docs/decisions/reconciliation-with-18.md`
