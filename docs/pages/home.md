# Home page

_Last verified: 2026-09-09_

- **Route:** `/` (index route)
- **File:** [src/pages/HomePage.tsx](../../src/pages/HomePage.tsx)
- **i18n namespace:** `home` → [src/i18n/locales/{fr,en}/home.json](../../src/i18n/locales/fr/home.json)
- **Shared components used:** see [README.md](README.md) for `Reveal`/`revealContainer`/`revealItem`, `SectionWrapper`, `Eyebrow`, `Tag`, `Button`, `NetworkArt`, `VideoPlayer`, `NewsletterForm`, `NewsletterPerks` — only what's specific to Home is covered below.

## Section-by-section (rendering order)

| # | Section | Anchor id | Component(s) | Data |
|---|---|---|---|---|
| 1 | Hero | — | inline JSX + `NetworkArt` | `hero.eyebrow/h1_before/lead/cta_research` |
| 2 | Metrics bar | — | raw `motion.div` + `revealContainer`/`revealItem` | `metrics[]` |
| 3 | Vision video | `#vision` | `SectionWrapper alt` + `VideoPlayer` | `vision.*` |
| 4 | News & events | `#news` | `SectionWrapper` + inline cards | `news.items[]` |
| 5 | Research | `#research` | `SectionWrapper` + inline rows | `research.areas[]` |
| 6 | Newsletter | `#contact` | `SectionWrapper spacing="tight"` + `NewsletterPerks` + `NewsletterForm` | `newsletter.eyebrow/h2` (perks come from the same file, see below) |

Three more sections exist as **fully-written, commented-out JSX** in the file, each with a `TODO` explaining exactly what's blocking it — see [Hidden sections](#hidden-sections-and-how-to-restore-them) below.

### 1. Hero

Plain `<section>` (not `SectionWrapper` — Home's hero has bespoke sizing, unlike the shared `PageHero` used by every other page). Two-column grid: left column is `Eyebrow` + `<h1>` + lead paragraph + one CTA button (`Button as="a" href="#research"`, anchors down to the Research section); right column is `<NetworkArt />` with no props. A second hero CTA (for Training) is commented out at the spot marked `{/* TODO: restore training CTA once the page ships */}` — restore it once [training.md](training.md)'s page ships.

### 2. Metrics bar

Sits directly under the hero, inside the same `wrap` container but its own `motion.div` (uses `revealContainer`/`revealItem` directly rather than the `<Reveal>` wrapper component, since it needs a `grid` on the animated element itself). Data: `t('metrics', { returnObjects: true })` typed `{ value, label, caption, color }[]`. `color` is used as a raw inline CSS `background` on a small dot — it must be a valid CSS color string (hex, `rgb()`, etc.), not a Tailwind class name. Grid is 4 columns, collapsing to 2 then 1.

### 3. Vision video

`SectionWrapper alt id="vision"`. Standard eyebrow/h2/lead block, then one `<VideoPlayer>`:

```
<VideoPlayer
  label={t('vision.video_label')}
  url={t('vision.video_url')}
  placeholder={tCommon('video_placeholder')}
  gradient
/>
```

`url` is a full YouTube link (any of the forms `VideoPlayer` recognizes — see [README.md](README.md#video)). Note `placeholder` is pulled from the **`common`** namespace, not `home` — that string is shared across every `VideoPlayer` instance on the site.

### 4. News & events

`SectionWrapper id="news"`. Header uses a small local helper, `SectionHead` (defined at the top of `HomePage.tsx`), which just wraps its children in one `<Reveal>` with a flex layout — an "All news" archive link is commented out next to it because no archive/news-index page exists yet.

Cards are a 3-column `revealContainer`/`revealItem` grid, built inline (there's no separate `NewsCard` component to go looking for). Data: `news.items[]`, each `{ tag, tagVariant, date, title, excerpt, link, url?, icon? }`. The link behavior is decided by a local `NewsLink` helper at the top of the file:

- no `url` → renders a dead `<a href="#">` (use this for "coming soon" cards with nothing to link to yet)
- `url` starts with `/` → renders an internal React Router `<Link>` (no full page reload)
- anything else → renders `<a target="_blank" rel="noopener noreferrer">`

`icon` (optional) is a small image shown in a white circle over the card's placeholder image area — typically a `/icons/<name>-<hex>.svg` path, same convention as About's pillar icons (see [about.md](about.md)).

### 5. Research

`SectionWrapper id="research"`. Header block, then a `<Reveal>`-wrapped list of "area rows" (`research.areas[]`, each `{ no, title, desc }`) — rendered as a numbered list of links, **not** cards. Each row currently links to `SOCIAL_LINKS.youtube` (from [src/constants/index.ts](../../src/constants/index.ts)) — **this is a known placeholder destination**, not a bug: there's no dedicated research-area landing page yet, so every row points at the YouTube channel as a stopgap. Don't be surprised that all four rows go to the same place.

A "Featured papers" grid is fully commented out below this, pending a dedicated Research page — see [Hidden sections](#hidden-sections-and-how-to-restore-them).

### 6. Newsletter

`SectionWrapper spacing="tight" id="contact"`. A single dark card (`bg-[var(--card-dark)]`) containing an eyebrow, `<h2>`, then `<NewsletterPerks />` and `<NewsletterForm />` back to back. Both are documented in full in [README.md](README.md#newsletter) — `NewsletterPerks` reads from `home.json`'s own `newsletter.perks*` keys, so this is the canonical place to edit the perks list (WeekPaper's newsletter modal reuses the exact same component and copy).

## Hidden sections and how to restore them

Three sections exist as complete, working JSX in `HomePage.tsx`, just wrapped in a block comment with a `TODO` at the top explaining the blocker. To restore any of them: find the matching `TODO` comment in the file, delete the surrounding `{/* ... */}`, and uncomment the matching `type`/hook line near the top of the component (each hidden section has one).

| Section | Blocked on | What to also do before shipping |
|---|---|---|
| Training preview (below Research) | Training page not routed | Wait for [training.md](training.md)'s route to ship, or write new copy pointing elsewhere |
| Featured papers (inside Research) | No dedicated Research page yet | Decide whether papers get their own page or stay merged into this section; restore the `papers`/`Paper` type at the top of the file alongside the JSX |
| Partners (own section, `#partners`) | No confirmed partnerships yet | When restoring: make logos into real links (`target="_blank" rel="noopener"`) once partnerships are confirmed, and add pause-on-focus to `.logo-marquee` alongside its existing pause-on-hover — the logos become keyboard-focusable links, and WCAG 2.2.2 requires a way to pause auto-moving content once that's true. See D-11 in [DECISIONS.md](../../DECISIONS.md). |

## How-to recipes

**Add a metrics tile:** add `{ value, label, caption, color }` to `metrics[]` in both `fr/home.json` and `en/home.json`, same array position. No code change — the grid and stagger animation apply automatically. Keep `color` a valid CSS color string.

**Add a news/event card:** add an entry to `news.items[]` in both locale files. Set `url` to `/some-path` for an internal link, a full `https://...` URL for external, or omit it for a placeholder dead link.

**Change the vision video:** edit `vision.video_url` in both locale files to any YouTube link — thumbnail and embed both derive automatically from the extracted video ID, no component changes needed.

**Add a research area row:** add `{ no, title, desc }` to `research.areas[]` in both locale files. Remember every row currently links to the YouTube channel (see above) unless you also change the hardcoded `href` in `HomePage.tsx` to something per-row.

**Edit the newsletter perks list:** edit `newsletter.perks_intro` / `newsletter.perks` in `home.json` (both languages) — this simultaneously updates the WeekPaper newsletter modal, since it renders the same `NewsletterPerks` component reading the same keys.
