---
title: "ESLint react-hooks/set-state-in-effect w theme hooku (load-then-set)"
date: 2026-07-23
category: build-errors
severity: medium
stack:
  - Next.js
  - React
  - TypeScript
tags:
  - eslint
  - react-hooks
  - useEffect
  - useState
  - localStorage
status: verified
last_verified: 2026-07-23
---

# ESLint react-hooks/set-state-in-effect w theme hooku

## Symptomy

- `eslint` błąd `react-hooks/set-state-in-effect` w custom hooku `useTheme`.
- Efekt uboczny: pierwszy efekt czytał `localStorage` i robił `setState`, a przy okazji **nadpisywał** `localStorage` już na mount (klobber zapisanej wartości).

## Root Cause

Wzorzec „load-then-set": `useState(default)` + `useEffect(() => setState(readFromStorage()))`. To kaskadowy re-render i anty-wzorzec (React flaguje `set-state-in-effect`).

## Rozwiązanie

Czytaj wartość **leniwie w inicjalizatorze `useState`** (SSR → wartość domyślna), bez efektu-czytającego:

```tsx
const [mode, setMode] = React.useState<ThemeMode>(() => {
  if (typeof window === "undefined") return "auto";
  const saved = localStorage.getItem("theme");
  return isThemeMode(saved) ? saved : "auto";
});
```

Osobny efekt tylko **aplikuje + zapisuje** (nie czyta do state). Dodatkowo: type guard `isThemeMode` zamiast `as ThemeMode` (reguła: no unnecessary `as`).

## Zapobieganie

Wartość początkowa z zewnętrznego źródła (localStorage/URL) → **lazy `useState` initializer**, nie efekt read-then-set. Efekty rezerwuj na synchronizację ze światem (apply/persist/subscribe), nie na inicjalizację state.
