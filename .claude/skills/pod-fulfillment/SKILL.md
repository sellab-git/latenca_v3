---
name: pod-fulfillment
description: "Print-on-demand fulfillment dla Latenca (wall art: framed prints, posters, canvas). Gelato jako backbone za abstrakcją PodProvider, Printful jako fallback. Używaj przy pracy z produktami/cenami/wysyłką/zamówieniami POD. POD = jedyne źródło prawdy."
---

# POD Fulfillment — wytyczne Latenca

**Zasada nadrzędna:** POD API to **jedyne źródło prawdy** o produktach, cenach, wariantach, koszcie wysyłki i dostępności. NIGDY nie wymyślaj ani nie hardcoduj tych danych. Supabase trzyma **nasze zamówienia + klientów**, nie stan magazynu.

> **last-verified:** 2026-07-24 · Gelato Order API v4, Product API v3 · Printful API v2. **Zanim zakodujesz konkretny endpoint — potwierdź request body na żywych docs** (`dashboard.gelato.com/docs`) lub context7; vendorzy wersjonują agresywnie, a część pól pochodzi ze snippetów, nie pełnych stron.

## 1. Vendor: Gelato (backbone), Printful (fallback)
Dla globalnego (USD) sklepu z **wall-art** wygrywa **Gelato**: głęboki katalog (formaty plakatów, papiery, framed poster/canvas, metal), lider jakości druku, **~87% produkcji w kraju docelowego odbiorcy** (140+ partnerów, 32 kraje → krótsza wysyłka, niższy koszt, mniej ceł). Printful ma tidy API v2 (jeden base URL, podpisane webhooki) ale jest apparel-first — zostaje jako udokumentowany fallback.

**Zawsze za abstrakcją `PodProvider`** (cienki interfejs), żeby vendor był wymienialny. Domena (zamówienia) nie zależy od typów Gelato.

```ts
// lib/pod/provider.ts — vendor-agnostic
export interface PodProvider {
  quote(basket: PodBasket, address: Address): Promise<PodQuote>;       // live price + shipping methods
  createOrder(order: OurOrder): Promise<{ podOrderId: string }>;       // idempotent po orderReferenceId
  getOrder(podOrderId: string): Promise<PodOrderStatus>;               // reconciliation
  verifyWebhook(req: Request): Promise<PodEvent | null>;               // normalizuje event → nasz stan
}
```
Gelato auth = header `X-API-KEY`; Printful v2 = `Authorization: Bearer`. Sekrety w `process.env` (`import "server-only"`), do `.env.example` bez wartości.

## 2. Cache vs live (kluczowa reguła)
**Katalog + cena bazowa = cache; wysyłka + total końcowy = live.**
- **Sync do naszej DB (background job — Vercel cron → Route Handler / Supabase Edge Function):** struktura katalogu, warianty, mapowanie rozmiar/produkt, **ceny bazowe**. Upsert do Supabase + `synced_at`. Storefront czyta z naszej DB (szybkie strony). Cache ceny = tylko do wyświetlania, **rewaliduj przy checkoucie**.
- **Live (request time):** **quote wysyłki + landed price** — `POST order.gelatoapis.com/v4/orders:quote` z realnym koszykiem + adresem. Koszt/dostępność zależą od adresu i routingu — nigdy nie zgaduj. Cache quote krótko (per adres+koszyk).

Kluczowe endpointy Gelato: `GET product.gelatoapis.com/v3/catalogs[/{uid}]`, `/v3/products/{uid}[/prices]`, `POST order.gelatoapis.com/v4/orders:quote`, `POST /v4/orders`, `GET /v4/orders/{id}`.

## 3. Order flow (Stripe → Gelato → klient)
Nasze zamówienie = system of record; status realizacji ciągniemy z Gelato.
1. Klient płaci → **Stripe webhook** (`checkout.session.completed`). Weryfikuj podpis, zwróć 200 szybko, przetwarzaj async.
2. Handler: nasz `orders` → `paid`, **re-quote Gelato** (sprawdź czy cena/dostępność nie dryfnęła), potem `POST /v4/orders` z `orderReferenceId = nasze order id`. **Idempotentnie** (guard po naszym id / Stripe event id) — retry webhooka nie może podwoić zamówienia.
3. Zapisz zwrócony Gelato `orderId` na naszym zamówieniu.
4. **Gelato webhook** `order_status_updated` → znajdź po `orderReferenceId`, update `pod_status`, tracking przy wysyłce → email (Resend).
5. Klientowi pokazuj `pod_status` + tracking **z naszej DB** (nigdy strona klienta nie woła Gelato live).

## 4. Co trzymamy vs co ciągniemy
- **Nasza DB:** `orders` (nasze id, `stripe_payment_intent`, amount, currency, status, address), `order_items` (`pod_product_uid`, qty, **`price_at_purchase`**, `print_file_url`), fulfillment (`pod_provider`, `pod_order_id`, `pod_status`, `tracking_url`, `synced_at`). **Persystuj `price_at_purchase`** — nigdy nie licz historycznych totali z bieżących cen katalogu.
- **Z Gelato on-demand:** szczegółowy status item-level, receipts/faktyczny koszt.

## 5. Gotchas
- **Price drift** — cache ≠ bieżąca cena. Zawsze re-quote przed `createOrder`; jeśli landed price ruszył ponad tolerancję → blokuj/koryguj, nie zjadaj marży.
- **Shipping** — tylko `orders:quote` jest autorytatywne; nie hardcoduj flat rate, nie reużywaj quote między adresami.
- **Mapowanie wariantów** — najkruchsze miejsce. `pod_product_uid`/`catalogUid` = kanoniczny klucz na wariancie; nasze SKU to aliasy. Zły `productUid` = cicho zły rozmiar/rama.
- **Sandbox** — osobny test key + `orderType: "draft"` do dry-run przed `"order"`.
- **Webhook reliability** — Gelato retry tylko **3× co 5s**; zwróć 2xx szybko + idempotencja. Dołóż **job rekonsyliacji** (`GET /v4/orders/{id}` dla zamówień w nieterminalnym `pod_status`) — nie polegaj tylko na webhookach. Traktuj callback jako untrusted → re-fetch stanu przed akcją na pieniądzach/wysyłce.

**Źródła:** Gelato v4 Create/Quote, v3 Catalog/Prices, Gelato Webhooks; Printful API v2. (Linki w wynikach researchu; potwierdź przy kodowaniu.)
