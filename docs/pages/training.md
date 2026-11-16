# Training page

_Last verified: 2026-09-09_

- **Route:** not currently registered. Built and ready at `/training`, but the route is commented out — see [Why it's not live, and how to ship it](#why-its-not-live-and-how-to-ship-it) below before doing anything else on this page.
- **File:** [src/pages/TrainingPage.tsx](../../src/pages/TrainingPage.tsx)
- **i18n namespace:** `training` → [src/i18n/locales/{fr,en}/training.json](../../src/i18n/locales/fr/training.json)
- **Data file:** [src/data/courses.ts](../../src/data/courses.ts) — see [The courses.ts / training.json split](#the-coursests--trainingjson-split--the-part-worth-understanding-first) below, it's the one non-obvious part of this page.
- **Shared components used:** see [README.md](README.md) for `Reveal`/`revealContainer`/`revealItem`, `SectionWrapper`, `Eyebrow`, `Button`, `NetworkArt`, `DarkCTA` — only what's specific to Training is covered below.

## Why it's not live, and how to ship it

Because a route only exists when it's registered, `TrainingPage.tsx` is currently **not included in any build output at all** — `vite-react-ssg` won't touch a page that's unreachable from the route tree. Four places, all marked with matching `TODO` comments (`grep -rn "training" src/ | grep -i todo` finds all of them), need to be uncommented together to ship it:

1. [src/routes.tsx](../../src/routes.tsx) — the route entry itself:
   ```
   // TODO: Training page is built but held back for a later release — restore the route below to ship it.
   // { path: 'training', lazy: () => import('@/pages/TrainingPage').then(m => ({ Component: m.default })) },
   ```
2. [src/components/layout/Header.tsx](../../src/components/layout/Header.tsx) — the nav item in `NAV_ITEMS`: `// { key: 'training', to: '/training' },`
3. [src/components/layout/Footer.tsx](../../src/components/layout/Footer.tsx) — a `TODO` placeholder comment where the footer link should go (no code to uncomment here — it needs to be written).
4. Optional but recommended: [src/pages/HomePage.tsx](../../src/pages/HomePage.tsx) — the second hero CTA and the "Training preview" section stub, both commented out with their own `TODO`s (see [home.md](home.md#hidden-sections-and-how-to-restore-them)).

There's no feature flag or env var involved — it's plain commented-out code. Restoring just item 1 makes the page reachable by direct URL; skipping 2–3 means visitors can't find it from navigation.

## Section-by-section (rendering order)

| # | Section | Anchor id | Component(s) | Data |
|---|---|---|---|---|
| 1 | Hero | — | inline JSX + `NetworkArt` | `hero.*` |
| 2 | Categories | — | `CategoryCard` grid | `CATEGORIES` (courses.ts) + `categories.items.<key>` |
| 3 | Featured courses | `#courses` | `CourseCard` grid | `FEATURED_COURSES` (courses.ts) + `courses.<id>` |
| 4 | Learning journey | `#journey` | `LearningJourney` | `journey.steps[]` |
| 5 | CTA | — | `DarkCTA` | `cta.*` |

### 1. Hero

Same shape as `PageHero` (two-column, `NetworkArt` on the right) but hand-built inline rather than using the shared component, with two CTAs instead of one: `variant="accent"` anchoring to `#courses`, `variant="ghost"` anchoring to `#journey`.

### 2. Categories

`SectionWrapper alt`. A 5-column grid (collapsing to 3, then 2) of `CategoryCard`s built from `CATEGORIES` in `courses.ts` (5 fixed entries: `ai`, `software`, `cloud`, `devops`, `security`), each combined with matching text from `training.json` under `categories.items.<key>`.

### 3. Featured courses

`SectionWrapper id="courses"`. A 3-column grid (collapsing to 2, then 1) of `CourseCard`s built from `FEATURED_COURSES` in `courses.ts`, combined with text from `training.json` under `courses.<id>`. A "Full catalogue" link next to the heading currently points at `#` — there's no catalogue/filter page yet, so treat it as a placeholder, same pattern as several other dead links across the site (see [home.md](home.md), [about.md](about.md)).

### 4. Learning journey

`SectionWrapper alt id="journey"`. `journey.steps[]` (4 items, `{ title, description }`) is 100% i18n-driven — no data file involvement — passed straight to `<LearningJourney steps={steps} />`.

### 5. CTA

`SectionWrapper spacing="tight"`. A `<DarkCTA>` with a real, working link (`Button as="link" to="/contact"`) — unlike the "Full catalogue" and per-course "Enroll" links above, this one actually goes somewhere.

## The courses.ts / training.json split — the part worth understanding first

This is the one place on the whole site where content isn't 100% in JSON, and it trips people up if you don't know the rule going in:

- **`src/data/courses.ts`** owns structure: which courses/categories exist, their stable `id` (a lookup key only — never shown to a visitor), and styling data (each course's `topic`, which sets its tag colour, and each category's `color`, both from `TOPIC_COLORS`). DevOps courses use the `cloud` topic, since DevOps belongs to the Cloud Computing and MLOps axis. No translatable text lives here, so this file needs no French/English counterpart.
- **`training.json`** (both languages) owns every word a visitor reads — `courses.<id>.{category, title, excerpt, duration, level}` and `categories.items.<key>.{name, count}` — keyed by the same `id`/`key` used in `courses.ts`.

**Nothing enforces the two stay in sync.** There's no TypeScript union tying `Course.id` to the JSON keys — a typo or a missing entry in either file fails *silently* at runtime: `i18next` returns the raw key string (e.g. `courses.llm-safety.title`) instead of throwing, so a mismatched course quietly ships with its dotted key visible as the heading instead of real text. Always add/rename an `id` in both places in the same change, and check the rendered page after.

## How-to recipes

**Add a featured course:**
1. In `courses.ts`, add an entry to `FEATURED_COURSES` with a new unique kebab-case `id` and a `topic` (`ai | se | cloud | rai | sec`, see [Tag](README.md#buttons-tags-labels)), which sets the tag colour. Set `imageSrc` if you have a real course image; otherwise the card falls back to a generic placeholder box (every course does today — no `FEATURED_COURSES` entry currently sets `imageSrc`).
2. In **both** `en/training.json` and `fr/training.json`, add `courses.<same-id>` with `category`, `title`, `excerpt`, `duration`, `level`.
3. No page code changes — the grid and stagger animation pick it up automatically.

**Add a category:** add `{ key, color, count }` to `CATEGORIES` in `courses.ts`, plus a matching `categories.items.<key>.{name, count}` block in both locale files. Grid columns adjust automatically (5→3→2).

**Add a Learning Journey step:** add `{ title, description }` to `journey.steps` in both locale files, **and** extend `STEP_COLORS` in [src/components/training/LearningJourney.tsx](../../src/components/training/LearningJourney.tsx) — it's a hardcoded 4-entry array matching the current 4 steps. A 5th step with no matching color entry renders with an undefined border/text color. This is the one spot on this page where a pure content change also requires a small code change.

**Wire up real "Enroll" links:** every `CourseCard`'s title and Enroll button currently point at the default `enrollHref = '#'` — `TrainingPage.tsx` never passes a real one. To fix, either add an `enrollHref` (or a route slug) field per entry in `courses.ts` and thread it through the `CourseCard` call in `TrainingPage.tsx`, or point every card at a shared `/contact?subject=training`-style link as a stopgap (same pattern the Team page uses for its "Join us" cards — see [team.md](team.md)).

## Components specific to this page

**`CategoryCard`** — [src/components/training/CategoryCard.tsx](../../src/components/training/CategoryCard.tsx). Props: `name`, `count` (both pre-translated strings), `color` (hex, used as an inline style), `href?` (defaults to `#courses`). It's just an anchor scrolling down to Featured Courses — there's no actual category-filtering logic anywhere; clicking any category lands on the same unfiltered course grid.

**`CourseCard`** — [src/components/training/CourseCard.tsx](../../src/components/training/CourseCard.tsx). Props: `category`, `topic`, `title`, `excerpt`, `duration`, `level` (pre-translated strings), `enrollHref?` (defaults to `#`), `imageSrc?` (falls back to a placeholder box reading "image · cours" — this fallback text is hardcoded French regardless of active language, worth fixing if you touch this component).

**`LearningJourney`** — [src/components/training/LearningJourney.tsx](../../src/components/training/LearningJourney.tsx). Props: `steps: { title, description }[]`. 4-column grid (1 column under 760px) with a decorative connector line behind numbered circles, colored by the `STEP_COLORS` array described above.
