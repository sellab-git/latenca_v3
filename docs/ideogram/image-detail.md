# Ideogram — Single-Image Detail Screen · shadcn/ui Rebuild Spec

> **Source:** Claude for Chrome extraction of Ideogram's image-detail view (aerial beach photo by priscilamktdsg, 3:4), 2026-07-23. **Pilot screen** for the rebuild pipeline (see repo `CLAUDE.md`).
> **Goal:** rebuild this screen as shadcn/ui (React + Radix + Tailwind) at every breakpoint, in both themes, without seeing the original.
> **Palette note:** the colors below are Ideogram's (dark-first). We rebuild 1:1 first; **recolor to warm/gallery is the LAST step** — do not recolor during rebuild.
> **Verification legend:** `[live]` measured in the running app (window capped ~1519px); `[shot-1920]` from 1920 screenshots (couldn't physically render 1920).
> **Residual gaps (non-blocking):** image loading skeleton (image was cached) → use shadcn `Skeleton`; focus-ring styling → use standard `--ring`.

## 1. Design tokens

**Typography.** Font family **Manrope** (fallback `system-ui`). Scale: 12px (timestamps, "See more"), 13px (nav labels, prompt heading, detail rows), 14px (author name, Follow, menu section headers), 16px (••• menu items). Weights 400 / 500 / 600. Radii, sizes, spacing and fonts are identical across both themes — only the color layer changes.

**Colors (dark ↔ light), mapped to shadcn variables:**

| Role | Dark | Light | shadcn var |
|---|---|---|---|
| App background | `#0f0f0f` | `#ffffff` | `--background` |
| Foreground text | `#ffffff` | `rgb(35,36,37)` | `--foreground` |
| Card / right panel | `rgba(255,255,255,0.03)` | `rgb(251,251,251)` | `--card` |
| Popover / menu | `#27272a` | ~white | `--popover` |
| Muted (detail values) | `rgb(155,155,161)` | `rgb(89,89,94)` | `--muted-foreground` |
| Muted (timestamps) | `rgb(193,193,197)` | — | `--muted-foreground` |
| Border | `rgba(255,255,255,0.1)` | `rgb(226,226,228)` | `--border` |
| Icon circle / back-arrow bg | `rgba(255,255,255,0.1)` / `#2b2b2d` | `rgb(244,244,245)` | `--secondary` |
| Menu section header | `rgba(255,255,255,0.3)` | `rgb(165,165,172)` | — |
| Primary link ("See more") | `#7e4dda` | `#7e4dda` (unchanged) | `--primary` |
| Primary bright (Upgrade) | `#8864e4` | `#8864e4` | `--primary` |
| Emphasis button ("Open in…", send) | white bg / `#0f0f0f` text | inverts to `rgb(35,36,37)` bg / white text | `--primary` inverse |
| Active-thumbnail ring | `#0167ff` | `#0167ff` | `--ring` |

**Theme system.** Three modes — Light / Dark / Auto — from the account menu (bottom-left avatar). Auto follows the OS. Primary purple does not invert; emphasis buttons invert bg/fg; the top-bar pill loses its shadow in light (`box-shadow: none`) vs the layered shadow in dark.

**Radii.** 4, 6, 8, 12, 28, 30, 40 px and 50%. Base `--radius: 8px`.
**Spacing.** Desktop main row padding `96px 24px 24px`; gap `24px`; mobile bottom bar padding `56px 16px 28px`.
**Shadow (top-bar pill, dark).** `rgba(15,15,15,0.075) 0 0 0 1px inset, rgba(14,14,16,0.15) 0 84px 50px, rgba(14,14,16,0.16) 0 37px 37px, rgba(14,14,16,0.16) 0 9px 21px`.
**Motion.** Standard hover fade on icon circles (`rgba(255,255,255,0.1)` → `0.15`).

## 2. Component inventory

- **Sidebar** — expanded 219px (icon + label); collapses via a toggle by the Ideogram logo to a 65px icon-only rail (full height) `[live]`. When collapsed the main content/image area widens by the freed space; the right panel is unaffected. Nav item 195×36, label 13/600. → vertical nav of `Button variant="ghost"`.
- **Top-bar search pill** — centered, max 859px `[live]`, h56, radius 28, bg `rgba(15,15,15,0.9)` (dark) + layered shadow / `rgba(255,255,255,0.95)` no-shadow (light). White circular send/upload button 36px; `#2b2b2d` circular back-arrow 36px at top-left. → pill wrapping an `Input`.
- **Icon action circle** (Like / Share / Download / More) — 40×40, radius 50%, bg `rgba(255,255,255,0.1)` → hover `0.15`. → `Button variant="ghost" size="icon"`.
- **Like control** — icon-only circle when count is 0 (this image), else a pill (radius 40, pad 0 14, gap 6, h40) with count; hover shows dark tooltip "Like". → `Button` + `Tooltip`.
- **Avatar** 40px circle. **Follow** — `variant="outline" size="sm"`, border `#3f3f46` (dark) / `rgb(226,226,228)` (light), radius 6, h20, 14/500.
- **Prompt / Magic prompt tabs** — active white/600, inactive `rgb(121,121,128)`/600 (state = color); row has copy ("Copy prompt") and "+" ("Use prompt") icons. → `Tabs`.
- **"See more / See less" link** — `#7e4dda`, 12/500. → `Button variant="link"`.
- **Details** — desktop label "View additional details" (`Collapsible`), mobile "Additional details" (always expanded). Row h32, pad 8px 0, space-between; label 13/400, value 13/400 muted. Model row has a "Use model" button.
- **Action buttons** (Edit / Remix / Upscale / Remove BG / Layerize text) — outline, border 1px, radius 8, h32, 2-col grid 137px 137px gap 6. → `Button variant="outline"` grid.
- **"Open image in…"** — desktop trigger emphasized (white in dark / black in light), radius 8, h32; dropdown opens upward, `#27272a`/white, radius 12, width 280 (JSON editor disabled, Prompt Builder, Image Studio). → `DropdownMenu`.
- **••• More menu** — `#27272a`/white, radius 12, width 212, item h36 pad 0 12 hover `rgba(255,255,255,0.05)`, section headers 14/600 (Copy image / Edit / Reference / Manage). → `DropdownMenu` with `DropdownMenuLabel` + items.
- **Nav arrows ‹ ›** `[live]` — 40×40, radius 40, transparent, border 1px, white (disabled `rgba(255,255,255,0.3)`); positioned outside the image, vertically centered, hugging left (right of the rail) and right edges; the gap between arrows and image grows on wide screens.
- **Thumbnail strip** `[live]` — horizontal `ScrollArea` with a mask-image edge fade on both ends; thumbs 40–44px desktop / 32px mobile, radius 8 (active 6), active border 1px `#0167ff`. Count = number of generation variants (4 on this image; ~9 on 1920 `[shot-1920]`, with the fade cutting off end tiles).
- **Related grid card** (below-fold desktop / mobile "Similar images") — ~292px tile, radius 0; hover overlay: ••• (More) + Share top-right, avatar + author name + time bottom-left `[shot]`, like heart ~36px bottom-right with optional count `[live]`. → `Card` + `AspectRatio` + ghost icon `Button`s + `Avatar`.
- **"Back to top" floating button** `[live]` — 128×40, radius 40, bg `rgba(15,15,15,0.3)`, white, pad 0 14, 16px, `position: fixed` bottom-right.

## 3. Page blueprint per breakpoint

Two layout regimes; the single structural switch is at **900px**. Sidebar can be expanded (219px) or collapsed (65px rail) at any desktop width.

- **390 (base, mobile).** One scrolling column: back-arrow top-left + centered thumbnail strip → full-bleed image 390×520, radius 0 → author row (avatar/name/time + Follow right) → mobile segmented switcher "Image details | Similar images" (tab 117×36, radius 30, active `rgba(255,255,255,0.1)`) → Prompt/Magic subtabs → prompt text + See more → always-expanded "Additional details" → "Similar images" grid below. Overlaid fixed bottom bar: white "Open in..." pill (113×48, radius 40) left; 48×48 icons (Download/Like/Add/More, no Share) right.
- **430 (large mobile).** Same as 390; image full-bleed 430×573, radius 0; thumbnails 32px. Bar/pill/icons unchanged.
- **768 (portrait tablet).** Still stacked (below 900). Difference from 430: image not edge-to-edge — 585×780 centered with ~92px gutters (radius 0). Bottom bar 768 wide, otherwise identical spec.
- **1024 (landscape tablet).** Two-column desktop layout. Sidebar 219px + top-bar pill (~644px) + main row (804px, pad 96px 24px 24px, gap 24). Image column flex:1 (image 268×357, radius 12); right panel fixed 320px. No mobile switcher / bottom bar. Below-fold related grid.
- **1440 (desktop reference).** Same structure, more room; image column larger (radius 12); panel 320px; pill up to 859px; thumbnails 44/42px with `#0167ff` active ring. Related grid below = 4 columns at ~1440/1519 `[live]`. All components from §2 present.
- **1920 (wide desktop).** Identical layout to 1440 `[shot-1920]`; sidebar + centered 859px pill + larger centered image + 320px panel. Nav arrows sit far from the image (wide empty gutters). Thumbnail strip ~9 thumbs with edge fade. Related grid = 6 columns `[shot-1920]`. Collapsing the sidebar on 1920 keeps the grid at 6 columns (does not add a 7th) `[shot-1920]`; it mainly enlarges the detail/image area.

**Column-count rule** for the related masonry: fixed ~292px tiles wrapping to fill width → 4 cols ≈1440/1519, 6 cols ≈1920.

## 4. Screen states

**Verified:** default; icon/button hover (bg `rgba(255,255,255,0.1)`→`0.15`; "Like" tooltip); tab active vs inactive (white/600 vs `rgb(121,121,128)`/600); menu-item hover (`rgba(255,255,255,0.05)`); "Open image in…" JSON-editor item disabled (grey); nav arrow disabled (`rgba(255,255,255,0.3)`); active thumbnail (`#0167ff` ring); prompt expanded/collapsed (See more/less); theme dark/light/auto; sidebar expanded/collapsed; related-card hover (••• / Share / author overlay).
**Unverified:** image loading skeleton (image was cached), focus-ring styling (add standard `--ring`), error/empty states.

## 5. Sample content (reference only — NOT for reuse)

Illustrative — shows what each slot holds, not text to ship.

Author: priscilamktdsg — "6 months ago" (tooltip Jan 30, 2026, 4:24 AM). Original prompt (Portuguese, ~441 chars): an aerial diagonally-tilted beach photo — crystalline turquoise water with color gradation, white premium loungers/umbrellas, soft shadows, sophisticated calm summer mood, high-res drone, 28mm-equivalent lens, warm late-morning light. Magic prompt (English) begins "An aerial photograph captured with a diagonal tilt, showcasing the stunning depth between crystalline turquoise ocean waters and pristine white sand beach…". Detail values: Type = Generation · Model = Ideogram 3.0 (with "Use model") · Style = Auto · Aspect ratio = 3:4 · Resolution = 864 × 1152 · Rendering = Turbo · Seed = 1434646911 · Created = Jan 30, 2026, 4:24 AM. Buttons: Edit, Remix, Upscale, Remove BG, Layerize text, Open image in…/Open in…, Follow, Use model, See more. ••• menu: Copy image · Remix, Magic Fill, Upscale, Remove background · Describe image, Use as reference, Use as style, Use as character · Add to collection, Report, Mute creator. Open-in menu: JSON editor (disabled), Prompt Builder, Image Studio. Likes: 0. Sidebar: Home, My images, Collections, My likes, Prompt Builder (NEW), Image Studio, AI Apps, Models, More, API Dashboard, API Docs; "12 slow credits left / Resets in 1 day"; Upgrade; user "arturpawlowski".
