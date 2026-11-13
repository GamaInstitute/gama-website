# Research Summaries page

_Last verified: 2026-11-03_

- **Route:** `/research-summaries`, plus one page per summary at `/research-summaries/:id`
- **Files:** [src/pages/ResearchSummariesPage.tsx](../../src/pages/ResearchSummariesPage.tsx) (list), [src/pages/ResearchSummaryPage.tsx](../../src/pages/ResearchSummaryPage.tsx) (one summary)
- **Summary texts:** Markdown in [src/content/research-summaries/](../../src/content/research-summaries/), `<id>/en.md` (optional `<id>/fr.md`)
- **i18n namespace:** `research` → [src/i18n/locales/{fr,en}/research.json](../../src/i18n/locales/fr/research.json)
- **Page-specific components:** [src/components/research/SummaryForm.tsx](../../src/components/research/SummaryForm.tsx)
- **Backend:** `POST /api/research-summary` → [functions/api/research-summary.ts](../../functions/api/research-summary.ts)
- **Shared components used:** see [README.md](README.md) for `SectionWrapper`, `Eyebrow`, `Button`, `Reveal`, `Modal`, `FormField`, `useTurnstileToken`.

Students and early-career researchers write an accessible summary of a scientific paper. The page lists published summaries and lets anyone submit one, which the GAMA team reviews by email before publication. Built from the `research-summaries.html` Claude Design mock-up.

Every summary listed is already validated: the GAMA team reviews submissions by email, and only accepted summaries are added here. Each one is read on its own page on this site (like an article on freeCodeCamp). The launch sample entries and their "Sample content" notice were removed on 2026-11-03.

## Section-by-section (rendering order)

| # | Section | Anchor id | Component(s) | Data |
|---|---|---|---|---|
| 1 | Hero + "how it works" | — | inline JSX | `hero.*` |
| 2 | Summaries list + sidebar | `#summaries` | inline JSX | `list.*`, `items[]`, `axes`, `sidebar.*` |
| 3 | Contribute | `#contribute` | inline JSX | `contribute.*` |
| — | Submission modal | — | `Modal tone="light"` + `SummaryForm` | `form.*` |

### 1. Hero

Custom padding (not `PageHero`, there's no `NetworkArt`). Left column: eyebrow, h1, lead, two CTAs ("Submit a summary" opens the modal; "Read the summaries" jumps to `#summaries`). Right column: the three `hero.steps` as numbered pills, plus a note that you don't need to be a Research Fellow to contribute.

### 2. Summaries list + sidebar

Two columns (list + 320px sidebar). Below 960px they stack and the sidebar boxes flow into an auto-fit grid. On desktop the sidebar is `sticky`.

Each entry of `items[]` renders as one article: title, then its number (`no`, e.g. `RS. 1`) as a solid dark badge (`NumberBadge`), the axis as a tag (a button that filters the list by that axis, like the sidebar chips; label `list.filter_axis`), then the date (`date_iso`, formatted with `formatEpisodeDate`), then (no image) "Research Summary by **author**", "Original paper by" the authors of each entry of `papers` ("Original papers by" when there are several, `list.orig_by_many`), and a "Read the research summary" link (`list.read_summary`). The title and that link open the summary page, `/research-summaries/<id>`.

- **Search** filters on title, author, bio, the authors in `papers` and the axis label (case-insensitive substring).
- **Axes** chips come from the `axes` object, one per research axis on the Home page (AI, software engineering, cloud computing, cybersecurity, responsible AI). Its keys must match each item's `axis` (`all` is the reset).
- **Pagination** is client-side, `PAGE_SIZE = 5` at the top of the page file. Hidden while everything fits on one page.
- **Recent contributors** are the first 4 distinct authors in `items[]`, so keep `items[]` sorted newest first. Avatar colour comes from `color` (`c1`…`c5` → copper, copper-bright, sage, teal-mid, teal; see `AVATAR_BG`).
- The dark CTA box opens the form and links to the Publication Guidelines (`sidebar.guide`).

### Summary page (`/research-summaries/:id`)

[ResearchSummaryPage.tsx](../../src/pages/ResearchSummaryPage.tsx) finds the entry of `items[]` whose `id` matches the URL and renders:

- **Header**, modelled on the Montreal AI Ethics Institute's research summaries: back link (`article.back`), the number badge (`no`), axis tag and date, the title as h1, then:
  - **Contributor:** round photo (`photo`, initials if absent), "Research Summary by **author**", a LinkedIn icon link when `linkedin` is set (`article.linkedin`), and `bio` · `institution` below. These come from the submission form.
  - **Original paper** box (`article.orig`, or `article.orig_many` for several): for each entry of `papers`, its `title` linked to `url`, `authors`, and `venue` in italics. The browser tab title is the summary title; the meta description is the item's `description`.
- **Table of contents:** built from the text's `##` and `###` headings (`article.toc`). The guidelines make a table of contents mandatory for every summary, so contributors don't write one in the file.
- **Text:** the Markdown file `src/content/research-summaries/<id>/en.md`, rendered by the same `Markdown` component as the Publication Guidelines (`compact` mode: lighter `##` headings). If a `fr.md` exists it is used on the French site; otherwise the English text shows on both, with a note on the French site (`article.lang_note`) that summaries are written in English, as the guidelines require.
- **Closing box:** `article.cta_*`, linking to the submission form and the guidelines.

Each summary page is prerendered at build time: `getStaticPaths` on the route in `src/routes.tsx` lists the ids from `fr/research.json`. An id with no entry or no text shows `article.not_found`.

The summary texts are imported eagerly into the summary page's chunk ([content index](../../src/content/research-summaries/index.ts)), so that chunk grows with every summary. Fine for dozens; past that, load each text on its own (see [D-20](../../DECISIONS.md)).

### 3. Contribute

Left: heading, body, CTA, and a "Guide" box with one `ResourceList` card (`contribute.files[]`, `src/components/guides/ResourceList.tsx`) linking to the [Publication Guidelines](publication-guidelines.md) at `#research-summaries`. The sidebar box (`sidebar.guide`) and the form's file hint also link there; there are no Word templates to download. Right: the `contribute.includes[]` checklist.

## Submission flow

`SummaryForm` collects name, email, institution, optional LinkedIn, short bio (≤300 chars), optional photo (JPG/PNG ≤5MB), original paper title and URL, the summary file (Word/PDF ≤10MB), and a required consent box (accepts the Terms and Privacy Policy, confirms authorship, authorizes publication). The server rejects a submission without `consent=true`. A privacy notice (`PrivacyNotice`) sits under the form.

1. Text fields are validated with `makeResearchSummarySchema` from [src/types/researchSummary.ts](../../src/types/researchSummary.ts) (react-hook-form + Zod, localized messages). Files are checked against `SUMMARY_FILE` / `PHOTO_FILE` from the same module.
2. An invisible Turnstile token is solved (`useTurnstileToken`).
3. Everything is posted as `multipart/form-data` to `/api/research-summary`.
4. The function re-validates all of it, verifies Turnstile, and emails the submission to `EDITORIAL_EMAIL_TO` (editoriale@gamainstitute.ca, falling back to `CONTACT_EMAIL_TO` if unset) through Resend, with the files as attachments and `replyTo` set to the contributor. Why email instead of storage: [D-15](../../DECISIONS.md).

Like the contact form, this only works on Cloudflare Pages (production, or `npm run dev:cf` locally), not on the GitHub Pages staging build.

## Recipes

**Publish a validated summary.**

1. Pick an `id` (lowercase, hyphens: it becomes the URL, `/research-summaries/<id>`).
2. Save the text as `src/content/research-summaries/<id>/en.md`: the five parts of the guidelines as `##` headings (Overview, Why it matters, Key findings, Discussion and implications, Moving forward), then `## References`; a research-based tutorial uses its own headings. No title, byline or table of contents in the file, the page adds them. Supported syntax: [publication-guidelines.md](publication-guidelines.md#file-format). Optionally add a French translation as `fr.md`.
3. Add an object at the **top** of `items[]` in both `fr/research.json` and `en/research.json` with:
   - the same `id`, `no`, `axis`, `date_iso`, `initials`, `color` in both files. `no` is the next number, `RS. <previous + 1>`, like WeekPaper's `EP. 7`; numbers are never reused or renumbered, even if a summary is removed;
   - a translated `title` and `description` (one sentence, used as the page's meta description);
   - the contributor, from the submission form: `author` (name), `bio` (translated), and optionally `institution`, `linkedin` (full URL) and `photo`. Save the photo as `public/research-summaries/contributors/<name>.webp` (square, about 200×200) and set `photo` to `/research-summaries/contributors/<name>.webp`;
   - the original paper, as one entry of `papers`: `title`, `authors` (shorten long lists to "First, Second et al."), `venue` (venue, pages, date; translated) and `url` (the form's paper link). A summary that covers several papers lists each one;
   - figures go in `public/research-summaries/figures/` (`.webp`) and are placed in the Markdown with `![alt](/research-summaries/figures/x.webp "Figure 1. Caption"){WxH}`.

The build creates the new page automatically.

**Add a topic.** Add a key to `axes` in both locale files and use it as `axis` on items. Order in `axes` is the order of the chips.

**Edit the writing guide.** It's the Research Summaries part of a web page: edit `src/content/publication-guidelines/{fr,en}.md` (see [publication-guidelines.md](publication-guidelines.md)).


**Change the upload limits.** Edit `SUMMARY_FILE` / `PHOTO_FILE` in `src/types/researchSummary.ts` (used by both client and function), then the hint text in `form.photo_hint` / `form.summary_hint` and the `*_size` error messages. Keep the combined total well under Resend's 40MB per-email limit.

## Not carried over from the design

The design belongs to a larger planned site, so some of its pieces don't exist here yet:

- Its header has "Research" and "Community" dropdowns, plus Research Fellows, Bootcamps, Opportunities and Donate pages. Here the page is a single top-level nav item, and the "Community / Research Summaries" breadcrumb is dropped (the eyebrow carries the same context).
- Its "Read more" links and contributor-name links point to `#`, because summary detail pages and contributor profiles don't exist yet. Here the "Read the research summary" link temporarily points to the original paper (see above) and contributor names are plain text.
- Its pagination was a static mock-up. Here it's real client-side pagination.
