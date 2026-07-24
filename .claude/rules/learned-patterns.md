# Learned Patterns

Reguły wyciągnięte z rozwiązanych problemów w docs/solutions/. Zarządzane przez /dev-compound i /dev-compound-refresh.

<!-- rule-count: 6 -->

- **Reuse `_shell` przed pisaniem nowego UI**: grep `src/app/pilot/_shell/` (AppSidebar, MobileNav, Composer, SegmentedControl, ImageActionsMenu) zanim autorujesz komponent — reinventowanie bloków to historycznie najczęstszy błąd.
  Source: docs/CONCEPTS.md#_shell-baza-design
- **1:1 = także interakcje, nie tylko statyczny frame**: przy odtwarzaniu ekranu „1:1" weryfikuj hovery/menu/submenu/expandery driving ŻYWĄ apkę przez Playwright (otwórz, zmierz, odbuduj, sprawdź) — nie rekonstruuj z pamięci ani statycznego zrzutu.
  Source: docs/solutions/ui-bugs/2026-07-23-image-detail-1024-overflow.md
- **Placeholder persony w commitowanym UI, nigdy prawdziwe dane usera**: menu konta/awatary itp. w pilotach = fikcyjny placeholder (np. `mia.rivera`/`mia@example.com`), nigdy realny email/handle Artura.
  Source: docs/CONCEPTS.md#ideogram-11
- **Nigdy `git add -A` na ślepo**: dodawaj konkretne ścieżki albo najpierw `git status`; `-A` wciągnął screeny konkurenta (Ideogram) do repo. Screeny konkurenta i artefakty weryfikacji trzymaj poza repo (`.gitignore`: `/ideogram-*.png`, `/*.png`, `.playwright-mcp/`).
  Source: docs/CONCEPTS.md#ideogram-11
- **Next 16: Server Components domyślnie**: `"use client"` tylko dla hooków/handlerów; dane przez server fetch / Server Actions, nie React Query w przeglądarce domyślnie. Przeczytaj `node_modules/next/dist/docs/` PRZED pisaniem kodu Next (Next 16 ma breaking changes) — patrz `AGENTS.md`.
  Source: .claude/rules/latenca-overrides.md
- **Starter ≠ nasz stack**: skille/agenci startera zakładają Vite + Coolify; my = Next 16 + Vercel + Supabase-SSR. Nie stosuj wzorca startera jako Next-ready, dopóki jego workstream (C/D) nie jest odhaczony w `docs/claude-foundation-plan.md`.
  Source: docs/claude-foundation-plan.md
