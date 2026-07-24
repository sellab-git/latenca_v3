# Concepts — słownik domenowy Latenca

Glosariusz pojęć o znaczeniu specyficznym dla tego projektu (encje, nazwane procesy, statusy, decyzje).
Jedno hasło = zwięzła definicja. Tylko słownik, nie spec. Narasta przez `/dev-compound`, porządkowany przez `/dev-compound-refresh`.

## 18. Latenca
Poprzednia wersja projektu (folder `18. Latenca`) — **read-only reference**: skończone makiety ścian/produktów, logika biznesowa, decyzje produktowe D1–D11. Nie edytujemy jej stąd; rzeczy migrują do folderu 20 dopiero po sprawdzeniu.

## Advisor (doradca AI)
Wyróżnik Latenca — asystent AI, który pomaga klientowi dobrać grafikę na ścianę. Projektowany od poziomu architektury, nie doklejany na końcu. Nie ma go ani Mixtiles, ani Displate.

## Auth / onboarding model
**NIEROZSTRZYGNIĘTE — nie wdrażać.** Research (#13) zrobiony → **rekomendacja na stole (status: proposed), czeka na decyzję Artura:** guest-first (zero logowania aż do checkoutu, email raz przy płatności, passwordless magic-link po zakupie) na **anonimowej sesji Supabase** pod spodem (stabilny UID → jedno RLS ownership rule, darmowa migracja przy konwersji). Wymuszone konto = ~24% porzuceń (Baymard) → odrzucone. Szczegóły + implikacje schematu: `docs/decisions/auth-onboarding.md`.

## Ideogram 1:1
Referencja UI, którą odtwarzamy 1:1 w Fazie A. **Ideogram to skóra, nie szkielet** — dostarcza język wizualny + prymitywy, ale NIE kręgosłup sklepu (brak product-detail-z-kup, buildera ściany, koszyka, checkoutu). Bloki commerce rodzą się w Fazie B (teardowny), nie z Ideograma. Screeny Ideograma NIGDY nie trafiają do repo.

## PaymentProvider
Warstwa abstrakcji nad bramkami płatności. **Stripe** jest pierwszą implementacją, ale logika biznesowa nie może być z nim sprzężona — inne bramki muszą być dokładalne bez przepisywania.

## Phase A / Phase B
**Faza A** = rebuild Ideograma 1:1 na shadcn (ZROBIONA: image-detail, Home, Styles, Canvas + baza design). **Faza B** = kręgosłup sklepu przez teardowny (Mixtiles/Displate) → bloki commerce (ProductCard-z-kup, picker rozmiaru/ramy, wall-builder, koszyk, checkout).

## POD (Print-on-demand)
Model realizacji zamówień: zewnętrzny dostawca (Gelato/Printful) drukuje i wysyła. **Jedyne źródło prawdy** o produktach, cenach, wariantach, wysyłce i dostępności = API dostawcy; nigdy nie wymyślamy tych danych. Supabase trzyma zamówienia i klientów, nie stan magazynu.

## Recolor step
OSTATNI krok: przekolorowanie palety (CSS variables w `globals.css`) w stronę ciepłej, galeryjnej. Do tego czasu kopiowanie ciemnej palety Ideograma jest nieszkodliwe. Nie przekolorowywać wcześnie.

## `_shell` (baza design)
Współdzielone komponenty app-shell w `src/app/pilot/_shell/`: `AppSidebar`, `MobileNav`, `Composer`, `SegmentedControl`, `ImageActionsMenu`, hook `theme`. **Reużywaj je — grep przed autorstwem nowego UI** (reuse = reguła #1).

## Wall-builder
Przyszły ekran kompozycji: klient układa grafiki na ścianie i podgląda u siebie (bliżej Mixtiles niż Ideogram Canvas). Faza B.
