# Research Summaries page

_Last verified: 2026-10-31_

- **Route:** `/research-summaries`
- **File:** [src/pages/ResearchSummariesPage.tsx](../../src/pages/ResearchSummariesPage.tsx)
- **i18n namespace:** `research` → [src/i18n/locales/{fr,en}/research.json](../../src/i18n/locales/fr/research.json)
- **Page-specific components:** [src/components/research/SummaryForm.tsx](../../src/components/research/SummaryForm.tsx)
- **Backend:** `POST /api/research-summary` → [functions/api/research-summary.ts](../../functions/api/research-summary.ts)
- **Shared components used:** see [README.md](README.md) for `SectionWrapper`, `Eyebrow`, `Button`, `Reveal`, `Modal`, `FormField`, `useTurnstileToken`.

Students and early-career researchers write an accessible summary of a scientific paper. The page lists published summaries and lets anyone submit one, which the GAMA team reviews by email before publication. Built from the `research-summaries.html` Claude Design mock-up.

**The summaries currently listed are sample content.** The contributors are fictional. The original papers and their links are real. A dashed "Sample content" notice above the list says so. Remove it (the `<p>` that uses `list.sample_label`) once real summaries replace the samples.

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

Each entry of `items[]` renders as one article: title, date (`date_iso`, formatted with `formatEpisodeDate`), a square image placeholder, then "Research Summary by **author**, bio", "Original paper by …" and an external link to `paper_url`.

- **Search** filters on title, author, bio, `paper_authors` and the axis label (case-insensitive substring).
- **Axes** chips come from the `axes` object. Its keys must match each item's `axis` (`all` is the reset).
- **Pagination** is client-side, `PAGE_SIZE = 5` at the top of the page file. Hidden while everything fits on one page.
- **Recent contributors** are the first 4 distinct authors in `items[]`, so keep `items[]` sorted newest first. Avatar colour comes from `color` (`c1`…`c5` → copper, copper-bright, sage, teal-mid, teal; see `AVATAR_BG`).
- The dark CTA box offers the FR/EN templates (paths are constants at the top of the page file).

### 3. Contribute

Left: heading, body, CTA, and a "Template to follow" box listing `contribute.files[]` (each `{ label, meta, file }`, where `file` is a key of `DOWNLOADS` in `src/constants/index.ts`). Right: the `contribute.includes[]` checklist.

## Submission flow

`SummaryForm` collects name, email, institution, optional LinkedIn, short bio (≤300 chars), optional photo (JPG/PNG ≤5MB), original paper title and URL, the summary file (Word/PDF ≤10MB), and a required consent box (accepts the Terms and Privacy Policy, confirms authorship, authorizes publication). The server rejects a submission without `consent=true`. A privacy notice (`PrivacyNotice`) sits under the form.

1. Text fields are validated with `makeResearchSummarySchema` from [src/types/researchSummary.ts](../../src/types/researchSummary.ts) (react-hook-form + Zod, localized messages). Files are checked against `SUMMARY_FILE` / `PHOTO_FILE` from the same module.
2. An invisible Turnstile token is solved (`useTurnstileToken`).
3. Everything is posted as `multipart/form-data` to `/api/research-summary`.
4. The function re-validates all of it, verifies Turnstile, and emails the submission to `CONTACT_EMAIL_TO` through Resend, with the files as attachments and `replyTo` set to the contributor. No new env vars. Why email instead of storage: [D-15](../../DECISIONS.md).

Like the contact form, this only works on Cloudflare Pages (production, or `npm run dev:cf` locally), not on the GitHub Pages staging build.

## Recipes

**Publish a real summary.** Add an object at the **top** of `items[]` in both `fr/research.json` and `en/research.json` with the same `id`, `axis`, `date_iso`, `author`, `initials`, `color` and `paper_url`, and translated `title` / `bio`. There's no per-summary detail page yet, so the entry links to the original paper.

**Add a topic.** Add a key to `axes` in both locale files and use it as `axis` on items. Order in `axes` is the order of the chips.

**Replace a template.** The templates and guide are in the team's Google Drive folder, linked as direct downloads from `DOWNLOADS` in `src/constants/index.ts` (used by the locale files, the sidebar box and `SummaryForm.tsx`). Upload a new version of the existing Drive file ("Manage versions") and the site picks it up with no deploy. A brand-new Drive file has a new ID: update its `DOWNLOADS` entry. Files must stay shared as "Anyone with the link".

**Change the upload limits.** Edit `SUMMARY_FILE` / `PHOTO_FILE` in `src/types/researchSummary.ts` (used by both client and function), then the hint text in `form.photo_hint` / `form.summary_hint` and the `*_size` error messages. Keep the combined total well under Resend's 40MB per-email limit.

## Not carried over from the design

The design belongs to a larger planned site, so some of its pieces don't exist here yet:

- Its header has "Research" and "Community" dropdowns, plus Research Fellows, Bootcamps, Opportunities and Donate pages. Here the page is a single top-level nav item, and the "Community / Research Summaries" breadcrumb is dropped (the eyebrow carries the same context).
- Its "Read more" links and contributor-name links point to `#`, because summary detail pages and contributor profiles don't exist yet. Here entries link to the real original paper and contributor names are plain text.
- Its pagination was a static mock-up. Here it's real client-side pagination.
