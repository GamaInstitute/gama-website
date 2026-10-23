# WeekPaper page

_Last verified: 2026-10-11_

- **Route:** `/week-paper`
- **File:** [src/pages/WeekPaperPage.tsx](../../src/pages/WeekPaperPage.tsx)
- **i18n namespace:** `weekpaper` → [src/i18n/locales/{fr,en}/weekpaper.json](../../src/i18n/locales/fr/weekpaper.json)
- **Shared components used:** see [README.md](README.md) for `SectionWrapper`, `Eyebrow`, `Tag`, `Button`, `VideoPlayer`, `Modal`, `NewsletterForm`, `NewsletterPerks`, `useTurnstileToken` — only what's specific to WeekPaper is covered below.

WeekPaper is Gama Institute's video series. This page is the one place on the site that combines a featured episode video, a modal, and the newsletter form together, so it's worth reading [README.md](README.md#video) and [README.md](README.md#modal) alongside this doc.

## Section-by-section (rendering order)

| # | Section | Anchor id | Component(s) | Data |
|---|---|---|---|---|
| 1 | Featured hero | — | inline JSX + `VideoPlayer` | `featured.*` |
| 2 | Episodes + filters | `#episodes` | filter chips + `EpisodeCard` grid | `episodes.*`, `filters` |
| 3 | Playlists | — | inline cards | `playlists.items[]` |
| 4 | Subscribe | `#subscribe` | inline + opens the newsletter `Modal` | `subscribe.*` |
| — | Newsletter modal | — | `Modal` + `NewsletterPerks` + `NewsletterForm` | reuses `subscribe.h2` as the modal title |

### 1. Featured hero

`SectionWrapper spacing="tight"`. Two-column layout: `VideoPlayer` on the left, text on the right.

```
<VideoPlayer
  label={t('featured.video_label')}
  url={t('featured.video_url')}
  duration={t('featured.duration')}
  placeholder={tCommon('video_placeholder')}
  gradient
/>
```

The video uses the standard click-to-play thumbnail flow. Don't add `autoplay` back for a real episode: per the component's own intent it's only for a temporary muted "coming soon" loop (see [README.md](README.md#video)).

The text side has two `Tag`s (episode number, then category), a heading, body, date, and a CTA button that opens `featured.video_url` on YouTube in a new tab (there's no per-episode page on the site).

### 2. Playlists

Plain `SectionWrapper`. Cards are built inline (no dedicated `PlaylistCard` component — unlike episodes, which do have one) from `playlists.items[]`, each `{ label, title, count, duration, icon }`. `icon` follows the same `public/icons/` convention as About's pillar icons (see [about.md](about.md)) — a self-hosted `/icons/<name>-<hex>.svg` file from `public/icons/`, not a bundled icon component. Every card's "watch" link currently points at `SOCIAL_LINKS.youtube` — there's no per-playlist URL field yet, so all playlists funnel to the same channel link regardless of which one you click.

### 3. Subscribe

`SectionWrapper spacing="tight" id="subscribe"`. Dark card with two buttons: one external link to the YouTube channel, and one (`variant="ghost-dark"`) that's a real `onClick` handler:

```
<Button as="button" onClick={() => setNewsletterOpen(true)} variant="ghost-dark">
  {t('subscribe.btn_email')}
</Button>
```

`newsletterOpen` is local `useState` on the page, initialized `false`. This is the entire wire-up for the modal below — there's no routing or URL state involved, just a boolean flag.

### Newsletter modal

Rendered unconditionally at the bottom of the page's `<main>` (the `Modal` component itself decides whether it's visually/DOM-mounted based on `isOpen`, via `AnimatePresence` — see [README.md](README.md#modal)):

```
<Modal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} closeLabel={tCommon('close')} title={t('subscribe.h2')}>
  <NewsletterPerks />
  <NewsletterForm />
</Modal>
```

Note the modal's `title` reuses `subscribe.h2` — the same heading text shown in the Subscribe section itself — rather than having its own separate copy. `NewsletterPerks` and `NewsletterForm` are the *exact same components and copy* as Home's own newsletter section (`NewsletterPerks` always reads from `home.json`, regardless of which page renders it — see [home.md](home.md)).

## Episodes + filters

`SectionWrapper alt id="episodes"`. Every published episode as an `EpisodeCard` grid, newest first, including the one currently featured above. Filter chips above the grid narrow it by `topic`.

- **Episodes** come from `episodes.items` in both locale files, each `{ no, topic, tagVariant, tag, title, date_iso, duration, video_url }`. Order in the array is display order, so put the newest first.
- **Filter chips** are generated from the `filters` object: `all` plus one key per topic. Each episode's `topic` must match one of those keys. Only add a filter key once at least one episode uses it, or visitors get a chip that always shows the `episodes.empty` message.
- **`EpisodeCard`** ([src/components/weekpaper/EpisodeCard.tsx](../../src/components/weekpaper/EpisodeCard.tsx)) renders a `small` `VideoPlayer` (click-to-play) and a title that opens `video_url` on YouTube in a new tab. Its `placeholder` comes from `common.video_placeholder`, like every other `VideoPlayer`.

## How-to recipes

**Publish a new episode:** in both locale files, (1) add it at the **top** of `episodes.items`, adding a `filters` entry if its `topic` is new, and (2) point the Featured hero at it by editing `featured.video_url`, `featured.duration`, `featured.ep`, `featured.tag`/`tagVariant`, `featured.title`, `featured.body` and `featured.date_iso`. The CTA button follows `video_url` automatically.

**Add a playlist:** add `{ label, title, count, duration, icon }` to `playlists.items` in both locale files — no code change needed, the grid maps over the array generically. Remember every card links to the same YouTube channel URL regardless of content, since there's no per-playlist link field.

**Change what the "Alerte courriel" button does:** it's just `onClick={() => setNewsletterOpen(true)}` in `WeekPaperPage.tsx` — if you need a second modal trigger elsewhere on the page, lift `newsletterOpen` no further than necessary; it's page-local state, not shared/global.
