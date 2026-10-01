# WeekPaper page

_Last verified: 2026-09-09_

- **Route:** `/week-paper`
- **File:** [src/pages/WeekPaperPage.tsx](../../src/pages/WeekPaperPage.tsx)
- **i18n namespace:** `weekpaper` → [src/i18n/locales/{fr,en}/weekpaper.json](../../src/i18n/locales/fr/weekpaper.json)
- **Shared components used:** see [README.md](README.md) for `SectionWrapper`, `Eyebrow`, `Tag`, `Button`, `VideoPlayer`, `Modal`, `NewsletterForm`, `NewsletterPerks`, `useTurnstileToken` — only what's specific to WeekPaper is covered below.

WeekPaper is Gama Institute's video series. This page is the one place on the site that combines a featured episode video, a modal, and the newsletter form together, so it's worth reading [README.md](README.md#video) and [README.md](README.md#modal) alongside this doc.

## Section-by-section (rendering order)

| # | Section | Anchor id | Component(s) | Data |
|---|---|---|---|---|
| 1 | Featured hero | — | inline JSX + `VideoPlayer` | `featured.*` |
| 2 | Playlists | — | inline cards | `playlists.items[]` |
| 3 | Subscribe | `#subscribe` | inline + opens the newsletter `Modal` | `subscribe.*` |
| — | Newsletter modal | — | `Modal` + `NewsletterPerks` + `NewsletterForm` | reuses `subscribe.h2` as the modal title |

A fourth section, an episodes grid with filter chips, exists as complete commented-out JSX — see [Hidden section: episodes](#hidden-section-episodes--filters) below.

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

Plain `SectionWrapper`. Cards are built inline (no dedicated `PlaylistCard` component — unlike episodes, which do have one) from `playlists.items[]`, each `{ label, title, count, duration, icon }`. `icon` follows the same Iconify-URL convention as About's pillar icons (see [about.md](about.md)) — a remote `https://api.iconify.design/mdi:*.svg?color=...` image, not a bundled icon component. Every card's "watch" link currently points at `SOCIAL_LINKS.youtube` — there's no per-playlist URL field yet, so all playlists funnel to the same channel link regardless of which one you click.

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

## Hidden section: episodes + filters

A full episodes grid (filter chips by topic, `EpisodeCard` per episode) exists as working JSX, commented out because `weekpaper.json`'s `episodes.items` is still placeholder data. To restore it, uncomment **four** spots together in `WeekPaperPage.tsx` (all marked with the same `TODO`):

1. The `FilterKey`/`EpisodeItem` type definitions near the top of the file.
2. The derived-data hooks: `filter` state, and the `episodes`/`filters`/`visible` computed values.
3. The `EpisodeCard` import.
4. The JSX block itself (filter chips + card grid).

Before shipping, replace the placeholder `episodes.items` entries in **both** `fr/weekpaper.json` and `en/weekpaper.json` with real episodes — each needs `{ no, topic, tagVariant, tag, title, date, duration, video_url }`.

**`EpisodeCard`** ([src/components/weekpaper/EpisodeCard.tsx](../../src/components/weekpaper/EpisodeCard.tsx)) is already fully built and waiting: props `no, tag, tagVariant, title, date, duration, videoUrl, playLabel`. It renders a `VideoPlayer` (`small`) with the fixed placeholder text "vidéo · épisode" (hardcoded, not per-language — worth fixing if this section ships before that's addressed) and a title that's currently a dead `href="#"` link (unlike the Featured hero CTA, which now links to the video on YouTube).

## How-to recipes

**Add a new episode:** see [Hidden section: episodes](#hidden-section-episodes--filters) above — this section isn't live yet, so "adding an episode" first means shipping the section.

**Change the Featured hero video (e.g. when a new episode goes live):** edit `featured.video_url`, `featured.duration`, `featured.ep`, `featured.title`, `featured.body` and `featured.date_iso` in both locale files. The CTA button follows `video_url` automatically.

**Add a playlist:** add `{ label, title, count, duration, icon }` to `playlists.items` in both locale files — no code change needed, the grid maps over the array generically. Remember every card links to the same YouTube channel URL regardless of content, since there's no per-playlist link field.

**Change what the "Alerte courriel" button does:** it's just `onClick={() => setNewsletterOpen(true)}` in `WeekPaperPage.tsx` — if you need a second modal trigger elsewhere on the page, lift `newsletterOpen` no further than necessary; it's page-local state, not shared/global.
