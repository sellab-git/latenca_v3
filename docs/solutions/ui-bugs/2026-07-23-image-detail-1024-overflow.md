---
title: "Horizontal overflow na 1024px w image-detail (panel wychodził poza viewport)"
date: 2026-07-23
category: ui-bugs
severity: medium
stack:
  - Next.js
  - React
  - Tailwind
tags:
  - responsive
  - overflow
  - flexbox
  - aspect-ratio
status: verified
last_verified: 2026-07-23
---

# Horizontal overflow na 1024px w image-detail

## Symptomy

- Na breakpoincie 1024px prawy panel wychodził poza viewport (prawa krawędź = 1125px, obcinana przez `overflow-hidden` na roocie).
- 1440/1920 wyglądały dobrze — problem tylko na węższym desktopie.

## Root Cause

Obraz był wymiarowany **tylko wysokością** (`h-[calc(100vh-180px)] w-auto`). Przy niskim/wąskim viewporcie szerokość liczona z wysokości była większa niż dostępne miejsce w kolumnie, co pchało panel poza ekran.

## Rozwiązanie

Wymiaruj obraz **szerokością z górnym capem na wysokość**, w kolumnie `min-w-0 flex-1`:

```tsx
<div className="flex min-w-0 flex-1 flex-col items-center gap-4">
  <div className="aspect-[3/4] w-full max-w-[calc(min(100vh-180px,860px)*3/4)] rounded-xl bg-muted" />
</div>
```

- `w-full` w kolumnie `min-w-0 flex-1` = obraz nigdy nie przekracza kolumny.
- `max-w-[calc(min(100vh-180px,860px)*3/4)]` = wysokość nigdy nie przekracza `min(100vh-180, 860)` (arbitrary value z calc/min działa w Tailwind v4).

Weryfikacja (Playwright, computed styles): overflow=0, panelRight=985 na 1024; 1440=540×720 i 1920=645×860 bez zmian.

## Zapobieganie

Wymiaruj media w responsywnych layoutach **szerokością + cap wysokości**, nie samą wysokością; kolumnę trzymaj w `min-w-0 flex-1`, żeby flex nie pozwolił dziecku rozpychać rodzica.
