# About page

_Last verified: 2026-09-09_

- **Route:** `/about`
- **File:** [src/pages/AboutPage.tsx](../../src/pages/AboutPage.tsx)
- **i18n namespace:** `about` → [src/i18n/locales/{fr,en}/about.json](../../src/i18n/locales/fr/about.json)
- **Shared components used:** see [README.md](README.md) for `PageHero`, `Reveal`/`revealContainer`/`revealItem`, `SectionWrapper`, `Eyebrow`, `Button` — only what's specific to About is covered below.

## Section-by-section (rendering order)

| # | Section | Component(s) | Data |
|---|---|---|---|
| 1 | Hero | `PageHero` (no `cta`) | `hero.eyebrow/h1/lead` |
| 2 | Mission / Vision | inline 2-col `Reveal` blocks | `mv.mission.*`, `mv.vision.*` |
| 3 | Values | inline, one `Reveal` for the whole list | `values.items[]` |
| 4 | Strategic pillars | inline `revealContainer`/`revealItem` grid | `pillars.items[]` |
| 5 | Join CTA | inline dark card | `cta.*` |

A sixth section, History timeline, has translated copy sitting unused in `about.json` but no JSX left to render it — see [Orphaned content: History timeline](#orphaned-content-history-timeline) below.

### 1. Hero

`<PageHero eyebrow={t('hero.eyebrow')} h1={t('hero.h1')} lead={t('hero.lead')} />` — no `cta` array passed, unlike some pages that do give `PageHero` buttons. If you want a hero CTA on About, add a `cta` prop literal directly in `AboutPage.tsx`; it isn't i18n-driven the way you might expect from the pattern on other pages.

### 2. Mission / Vision

`SectionWrapper alt`. Two-column grid, each side its own `<Reveal>` reading `mv.mission.{eyebrow,h2,lead}` and `mv.vision.{eyebrow,h2,lead}`.

### 3. Values

Plain `SectionWrapper`. `values.items[]` (typed `{ title, body }`) is rendered as a single list of rows (title column + body column), all wrapped in **one** `<Reveal>` — meaning the whole list fades in together as one block, not staggered item-by-item like the pillars grid right below it. That's a deliberate difference in animation pattern between these two adjacent sections, not an inconsistency to "fix."

### 4. Strategic pillars

`SectionWrapper alt`. A 4-column grid (collapsing to 2, then 1) driven by `pillars.items[]` (typed `{ no, title, body, icon }`), animated with the `revealContainer`/`revealItem` staggered pattern (raw `motion.div`, not the `<Reveal>` wrapper — different from the Values section above it).

**Where the icons actually come from — read this before grepping `icons.tsx`.** Each card's `icon` field is a path to a self-hosted SVG in `public/icons/`, e.g. `/icons/flask-165c71.svg`, rendered as a plain `<img>`. The files are Material Design Icons (`mdi`) downloaded from Iconify with the brand color baked in, named `<icon-name>-<hex>.svg`. They used to be hotlinked from `api.iconify.design`, until Iconify stopped serving the `mdi:<name>.svg` URL form and every icon on the site went blank at once. It is **not** a React icon component and has nothing to do with [src/components/ui/icons.tsx](../../src/components/ui/icons.tsx) (which only exports `LinkedInIcon`, used elsewhere by the Team page).

### 5. Join CTA

`SectionWrapper spacing="tight"`, dark card, one working CTA button (`Button as="link" to="/contact?subject=other"`). A second button ("See open positions") is commented out — `about.json` already has an unused `cta.btn_team` string ready for it, waiting on a real positions page/route to link to.

## Orphaned content: History timeline

`about.json` has a complete, translated `history` block (`eyebrow`, `h2`, `lead`, and `items[]` of `{ year, title, body }` spanning 2022–2026) in both languages — but the JSX that would render it has been fully deleted from `AboutPage.tsx`, leaving only a `TODO` comment (`{/* TODO: History timeline — add real milestones and restore this section */}`). Unlike the hidden sections on other pages (Home, WeekPaper, Team), there's no commented-out JSX to uncomment here — restoring this section means writing a new component from scratch (there's no existing timeline component anywhere in the repo to reuse) that reads `t('history.items')`.

## How-to recipes

**Add a Strategic Pillar card:**
1. Add an object to `pillars.items` at the same array index in **both** `fr/about.json` and `en/about.json`: `{ "no": "05", "title": "...", "body": "...", "icon": "/icons/<icon-name>-<hex>.svg" }`.
   - If the file doesn't exist yet, download it into `public/icons/`: `curl -f "https://api.iconify.design/mdi/<icon-name>.svg?color=%23<HEX>" -o public/icons/<icon-name>-<hex>.svg`. Note the `/` after `mdi` (the `mdi:` form now 404s), and `#` URL-encoded as `%23`.
   - Browse icon names at Iconify's `mdi` (Material Design Icons) set to stay visually consistent with the existing four.
2. No `.tsx` change needed for the data itself, but note the grid is hardcoded `grid-cols-4` — a 5th card will wrap awkwardly (4 + 1) unless you also adjust the grid class in `AboutPage.tsx`.
3. Icons are same-origin, so no CSP change is needed. Don't point `icon` back at a remote host without also adding it to `img-src` in `public/_headers`.

**Restore the History timeline:** write a new section component reading `t('history.items')` (typed `{ year, title, body }[]`) — see [Orphaned content](#orphaned-content-history-timeline) above, the copy is already there and translated.

**Restore the "See open positions" CTA:** uncomment the second button in the Join CTA section and wire it to `t('cta.btn_team')` (already present in both locale files) and a future positions page/route — that route doesn't exist yet, so this button needs a real destination decided first.
