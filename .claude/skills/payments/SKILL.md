---
name: payments
description: "Płatności dla Latenca: Stripe za wymienialną abstrakcją PaymentProvider (Next.js 16 App Router). Używaj przy checkoucie, webhookach płatności, zamówieniach, dodawaniu bramek (Przelewy24 później). Fulfillment na webhooku, nie na redirect."
---

# Payments — Stripe za abstrakcją `PaymentProvider`

**Zasada:** domena (zamówienia) NIE zna typów Stripe. Bramka robi dwie rzeczy: startuje checkout i weryfikuje+normalizuje webhooki do NASZEGO słownika eventów. Kod zamówień nigdy nie importuje `stripe`. Stripe = pierwsza implementacja; inne (Przelewy24) dokładalne bez przepisywania.

> **last-verified:** 2026-07-24 · `stripe-node` v19.x, hosted Checkout default. Przy realnych kluczach potwierdź pinned `apiVersion` i kształt eventu refundu (`charge.refunded` vs `refund.updated`) na dashboardzie.

## 1. Checkout Sessions (hosted) = default
Dla fizycznych towarów: **hosted Checkout Sessions**, nie surowe Payment Intents. Stripe liczy tax (`automatic_tax`), zbiera adres wysyłki (`shipping_address_collection`), obsługuje SCA/3DS, minimum kodu. Payment Element/embedded tylko gdy chcesz krok płatności w pełni na własnej stronie — **kod domenowy jest identyczny**, różni się tylko klient (redirect vs `clientSecret`).

## 2. Wiring Next 16
Stripe server-only, `apiVersion` pinowany:
```ts
// src/lib/payments/stripe.ts
import "server-only";
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil", // pin; bump świadomie
});
```
Sesję twórz w **Route Handler / Server Action**. **Nigdy `amount` z klienta** — line items licz server-side z naszego koszyka (ceny z DB). Klient tylko `window.location.href = url`.
- **Middleware gotcha:** wyklucz `/api/webhooks/**` z `matcher` auth-middleware (inaczej 401 na Stripe).

## 3. Webhook — raw body, verify, idempotent
W App Router raw body = `await req.text()` (bez `bodyParser`); **nie** parsuj JSON przed weryfikacją (psuje podpis).
```ts
// src/app/api/webhooks/stripe/route.ts
export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("missing signature", { status: 400 });
  let event: PaymentEvent | null;
  try { event = getProvider("stripe").parseWebhook(rawBody, sig); }
  catch (e) { return new NextResponse(`Webhook Error: ${(e as Error).message}`, { status: 400 }); }
  if (event) await applyPaymentEvent(event); // idempotentne; 200 szybko, ciężka praca async
  return NextResponse.json({ received: true });
}
```
Eventy istotne dla zamówień: `checkout.session.completed` (główny „opłacone"), `checkout.session.async_payment_succeeded` (metody opóźnione), `checkout.session.async_payment_failed` (zwolnij pending), `charge.refunded` (refund). Idempotencja: zapisz `providerEventId`, pomiń jeśli widziany; fulfillment bezpieczny do 2× po `orderId`; przed wysyłką sprawdź `payment_status !== "unpaid"`.

## 4. Kontrakt (vendor-neutral)
```ts
// src/lib/payments/types.ts
export interface CheckoutLineItem { name: string; amountMinor: number; currency: string; quantity: number; }
export interface CreateCheckoutInput {
  orderId: string;              // NASZE id — jedzie w metadata bramki
  lineItems: CheckoutLineItem[];
  successUrl: string; cancelUrl: string;
  customerEmail?: string; shippingCountries?: string[];
}
export interface CheckoutHandle { redirectUrl?: string; clientSecret?: string; providerRef: string; }

// Znormalizowane eventy — JEDYNY słownik płatności, jaki zna kod zamówień.
export type PaymentEvent =
  | { type: "payment.completed"; orderId: string; providerRef: string; amountMinor: number; currency: string; providerEventId: string }
  | { type: "payment.failed";    orderId: string; providerRef: string; providerEventId: string }
  | { type: "payment.refunded";  orderId: string; providerRef: string; amountMinor: number; currency: string; providerEventId: string };

export interface PaymentProvider {
  readonly id: "stripe" | "przelewy24";
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutHandle>;
  /** Weryfikuje podpis + mapuje na PaymentEvent, lub null gdy ignorujemy. Rzuca przy złym podpisie. */
  parseWebhook(rawBody: string, signature: string): PaymentEvent | null;
}
```
Stripe impl: `checkout.sessions.create({ mode:"payment", client_reference_id: orderId, metadata:{orderId}, automatic_tax:{enabled:true}, shipping_address_collection, line_items: [{ quantity, price_data:{ currency, unit_amount: amountMinor, product_data:{name} } }] }, { idempotencyKey: \`checkout:${orderId}\` })`. `parseWebhook` = `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)` → switch na typy → zwróć `PaymentEvent` (odzyskaj `orderId` z `metadata`/`client_reference_id`).

## 5. Domena reaguje na znormalizowane eventy (nie na Stripe)
```ts
// src/lib/orders.ts
export async function applyPaymentEvent(e: PaymentEvent): Promise<void> {
  if (await eventAlreadyProcessed(e.providerEventId)) return;   // idempotencja
  if (e.type === "payment.completed") {
    await markOrderPaid(e.orderId, e.providerRef);
    await triggerPodOrder(e.orderId);                           // POD — idempotentnie po orderId (patrz pod-fulfillment)
  } else if (e.type === "payment.failed")   await markOrderPaymentFailed(e.orderId);
  else if (e.type === "payment.refunded")   await markOrderRefunded(e.orderId, e.amountMinor);
  await recordProcessedEvent(e.providerEventId);
}
```
**Przelewy24 później:** ta sama `PaymentProvider` (własny `createCheckout` z redirectem P24, własny `parseWebhook` mapujący na te same 3 `PaymentEvent`). `applyPaymentEvent`, `triggerPodOrder`, wszystkie route = nietknięte. Wybór: factory `getProvider(order.currency)` (Stripe=USD, P24=PLN).

## 6. Gotchas
- **Test vs live keys** oraz **webhook secret per-endpoint I per-mode** — zły `whsec_` → każdy event 400. Trzymaj oba w env, do `.env.example` (bez wartości) + Vercel. Nigdy nie hardcoduj.
- **Raw body only** (`req.text()`), nie `req.json()` przed verify. Bez `bodyParser` (to Pages Router).
- **Kwoty = minor units, integer** (USD cents; `1999` = $19.99). Nigdy float.
- **Tax/shipping** licz Checkoutem (`automatic_tax`, `shipping_address_collection`) — główny powód by wybrać Checkout dla fizycznych.
- **Fulfillment na WEBHOOKU, nie na redirect** — klient może zapłacić i zgubić połączenie przed `success_url`. Success page może TEŻ wołać fulfillment (idempotentnie) dla UX.
- **Zwróć 200 szybko**, POD/email po ack lub w kolejce.

**Źródła:** Stripe webhooks / Checkout fulfillment / online-payments recommendation, `stripe-node`. (Linki w wynikach researchu; potwierdź przy realnych kluczach.)
