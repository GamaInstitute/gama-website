# WeekPaper page

_Last verified: 2026-10-31_

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
| 4 | Contribute | `#contribute` | inline JSX + opens the submission `Modal` | `contribute.*` |
| 5 | Subscribe | `#subscribe` | inline + opens the newsletter `Modal` | `subscribe.*` |
| — | Newsletter modal | — | site-wide, opened with `useOpenNewsletter()` | `common.json → newsletter.modal_title` |
| — | Submission modal | — | `Modal tone="light"` + `PresentationForm` | `submit.*` |

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
<Button as="button" onClick={openNewsletter} variant="ghost-dark">
  {t('subscribe.btn_email')}
</Button>
```

`openNewsletter` comes from `useOpenNewsletter()`: it opens the site-wide subscribe window mounted in `RootLayout` (see [README.md](README.md#newsletter)), the same one the Home hero, the footer and Research Summary pages open.

### Newsletter modal

No longer part of this page: the subscribe window is shared site-wide (`NewsletterProvider`, title `common.json → newsletter.modal_title`). Its content is `NewsletterPerks` + `NewsletterForm`, the *exact same components and copy* as Home's own newsletter section (`NewsletterPerks` always reads from `home.json` — see [home.md](home.md)).

## Contribute + submission form

Added 2026-10-31 from the updated `week-paper.html` Claude Design export. (That export also re-mocks the hero, episode grid and playlists with placeholder episodes; those were **not** carried over, since this page already shows real episodes.)

- **Left column:** `contribute.format[]` (voice / slides / face on camera) and the numbered `contribute.structure[]` steps (numbers come from the array index) under `contribute.structure_label`, which also says an innovative structure is accepted.
- **Right column (sticky on desktop):** `contribute.resources[]`, rendered by `ResourceList`: one card to the [Publication Guidelines](publication-guidelines.md) (`{ label, meta, to: '/publication-guidelines#weekpaper' }`) and the slide template download (`{ label, meta, file }`, `file` being a key of `DOWNLOADS` in `src/constants/index.ts`) and a dark CTA box that opens the submission modal.
- **[PresentationForm](../../src/components/weekpaper/PresentationForm.tsx)** collects presenter info, the paper (title, authors, link), a **link** to the video (videos are too big to upload through the site), the slides (`.pptx`/`.ppt`, ≤15MB), a profile photo (JPG/PNG, ≤5MB), the proposed YouTube title and description, a publication preference (`yt-li` or `yt`), the AI-use disclosure required by section 6.4 of the Publication Guidelines (`AiDisclosureField`, `src/components/forms/`: required, ≤1000 chars, with a button that fills in the standard "no AI used" sentence; checked server-side and shown on its own row of the email to the editorial inbox), and a required consent box.
- Validation lives in [src/types/weekpaperSubmission.ts](../../src/types/weekpaperSubmission.ts) (Zod + file limits, shared with the server). Posting goes to `POST /api/weekpaper-submission` → [functions/api/weekpaper-submission.ts](../../functions/api/weekpaper-submission.ts), which re-validates, checks Turnstile and emails everything to `EDITORIAL_EMAIL_TO` (editoriale@gamainstitute.ca, falling back to `CONTACT_EMAIL_TO`) with the slides and photo attached. Same design as Research Summaries, see [D-15](../../DECISIONS.md).

**Edit the contribution guidelines.** They're the WeekPaper part of a web page: edit `src/content/publication-guidelines/{fr,en}.md` (see [publication-guidelines.md](publication-guidelines.md)).

**Replace the slide template.** Overwrite `public/downloads/GAMA_Institute_Slide_Template.pptx` under the same name.

## Episodes + filters

`SectionWrapper alt id="episodes"`. Every published episode as an `EpisodeCard` grid, newest first, including the one currently featured above. Filter chips above the grid narrow it by `topic`. Only two rows show at a time: 6 episodes on desktop (3 columns), 4 on tablet (2), 2 on phone (1), with `Pagination` below (`episodes.pagination_label/prev/next`). The page size follows the grid's columns through `useEpisodeColumns()` in `WeekPaperPage.tsx`, whose breakpoints must match the grid's `grid-cols` classes; it renders 3 columns until hydration, like the prerender. Changing filter goes back to page 1.

  **Only the 10 most recent episodes are listed** (`MAX_EPISODES` in `WeekPaperPage.tsx`), and only topics that have a listed episode get a filter chip. **Never delete old episodes from `episodes.items`**: past newsletter emails link to them. A link to an episode that is no longer listed shows it alone above the grid, in an outlined "Épisode des archives" box (`episodes.archive_label`), with "Voir les épisodes récents" (`episodes.archive_back`) to close it.

  **Link to one episode:** `/week-paper#ep-7` (the number of `no`, see `episodeAnchor`). On arrival the page switches to all topics, opens the grid page that holds the episode, scrolls to its card and outlines it; picking a filter removes the outline. Newsletter emails link to episodes this way, so old emails keep working after the episode is no longer featured or moves to page 2.

- **Episodes** come from `episodes.items` in both locale files, each `{ no, topic, tag, title, date_iso, duration, video_url }`. `topic` (`ai | se | cloud | rai | sec`) sets both the filter and the tag colour (`TopicTag`, see [README.md](README.md#buttons-tags-labels)). Order in the array is display order, so put the newest first.
- **Filter chips** are generated from the `filters` object: `all` plus one key per topic. Each episode's `topic` must match one of those keys. Only add a filter key once at least one episode uses it, or visitors get a chip that always shows the `episodes.empty` message.
- **`EpisodeCard`** ([src/components/weekpaper/EpisodeCard.tsx](../../src/components/weekpaper/EpisodeCard.tsx)) renders a `small` `VideoPlayer` (click-to-play) and a title that opens `video_url` on YouTube in a new tab. Its `placeholder` comes from `common.video_placeholder`, like every other `VideoPlayer`.

## How-to recipes

**Publish a new episode:** in both locale files, (1) add it at the **top** of `episodes.items` (keep the older ones: only 10 are listed, the rest stay reachable by link), adding a `filters` entry if its `topic` is new, and (2) point the Featured hero at it by editing `featured.video_url`, `featured.duration`, `featured.ep`, `featured.tag`/`topic`, `featured.title`, `featured.body` and `featured.date_iso`. The CTA button follows `video_url` automatically.

  **This also emails subscribers.** Once the change is deployed to production, the `weekpaper-alert` job in `deploy-production.yml` schedules the bilingual Thursday alert to the whole Resend audience, 1 hour later (cancel it in the Resend dashboard within that hour if needed). It is built from the `featured` block of both locale files, so write `featured.body` as you'd want it in the email. It only fires for an episode whose `date_iso` is at most 3 days old and never sends the same episode twice. A Research Summary published in the 7 days before the episode is added under "Also new on the site". To check the email first: `node scripts/newsletter.mjs alert --dry-run` (writes `newsletter-out/weekpaper-ep-NN.html`), or Actions → Newsletter → Run workflow, mode `test`. Details: [D-23](../../DECISIONS.md).

**Add a playlist:** add `{ label, title, count, duration, icon }` to `playlists.items` in both locale files — no code change needed, the grid maps over the array generically. Remember every card links to the same YouTube channel URL regardless of content, since there's no per-playlist link field.

**Change what the "Alerte courriel" button does:** it's just `onClick={() => setNewsletterOpen(true)}` in `WeekPaperPage.tsx` — if you need a second modal trigger elsewhere on the page, lift `newsletterOpen` no further than necessary; it's page-local state, not shared/global.
