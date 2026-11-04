# How to update website content

_Last verified: 2026-07-25_

This guide is for making everyday content changes, text, images, team members, courses, news, without needing to understand the rest of the codebase. If you're fixing a bug, changing layout/behavior, or need to know exactly which component renders a section (including which sections are currently hidden and why), see [docs/pages/](../pages/README.md) instead, one file per page. For system-level architecture, see [ARCHITECTURE.md](../../ARCHITECTURE.md).

## The one rule that matters

**Almost all visible text lives in JSON files, not in the page components.** There are two copies of every string, one French, one English, that must be kept in sync:

```
src/i18n/locales/fr/<namespace>.json
src/i18n/locales/en/<namespace>.json
```

French is the source of truth for structure, English mirrors it key-for-key. If you add, rename, or remove a key in one file, do the same in the other. If you only edit one, that page will show blank text (or the raw key name) when a visitor switches language.

Each page pulls from one namespace:

| Page | Namespace files |
|---|---|
| Home | `home.json` |
| About | `about.json` |
| Training | `training.json` |
| WeekPaper | `weekpaper.json` |
| Team | `team.json` |
| Contact / Header / Footer (shared) | `common.json` |

## Editing plain text (headings, paragraphs, buttons)

1. Open the `.tsx` file for the page in `src/pages/` to find the `t('some.key')` call near the text you want to change (e.g. `{t('hero.h1_before')}`).
2. Open `src/i18n/locales/fr/<namespace>.json` and find that same dotted path (`hero.h1_before`).
3. Edit the French value.
4. Open the matching `en/<namespace>.json` file and edit the same key with an English translation.
5. Save, then check both languages in the browser (`npm run dev`, use the language toggle in the header).

You never need to touch the `.tsx` file for a plain text change, only the two JSON files.

## Editing repeated content (lists of cards)

Several sections are arrays of objects in the JSON, one entry per card. To add, remove, or reorder an entry, edit the array, order in the array is the order on the page. **The fr and en arrays must have the same number of entries, in the same order**, since French entry `[2]` is paired with English entry `[2]`.

| Section | File | Array path | Fields |
|---|---|---|---|
| Home: metrics bar | `home.json` | `metrics` | `value`, `label`, `caption`, `color` |
| Home: news cards | `home.json` | `news.items` | `tag`, `tagVariant`, `date`, `title`, `excerpt`, `link` |
| Home: research areas | `home.json` | `research.areas` | `no`, `title`, `desc` |
| Home: featured papers | `home.json` | `research.papers` | `tag`, `tagVariant`, `venue`, `title`, `excerpt`, `link` |
| Home: partner logos | `home.json` | `partners.categories` | `label`, then `logos: [{ name, logo }]` — see [Logos and images](#logos-and-images) |
| Home: newsletter perks | `home.json` | `newsletter.perks` | plain string list |
| Team: each group | `team.json` | `leadership.members`, `researchers.members`, `contributors.members`, `advisory.members` | `name`, `role`, `bio` (optional, not currently rendered), `photo` (optional — falls back to an initials avatar), `photoPosition` (optional), `linkedin` (optional) |
| Team: "join us" cards | `team.json` | `join.items` | `no`, `title`, `body`, `link` |
| WeekPaper: episodes | `weekpaper.json` | `episodes.items` | see existing entries for fields |
| WeekPaper: playlists | `weekpaper.json` | `playlists.items` | see existing entries for fields |
| Training: journey steps | `training.json` | `journey.steps` | see existing entries for fields |

`tagVariant` controls the pill color and must be one of the existing variant names already used elsewhere in the file (e.g. `copper`, `teal`, `default`), copy a neighboring entry rather than inventing a new one.

### Example: adding a new team member

In `src/i18n/locales/fr/team.json`, add an entry to the right group's `members` array:

```json
{ "name": "M. Tremblay", "role": "Chercheur postdoctoral", "bio": "Vision par ordinateur appliquée à la robotique.", "photo": "https://example.com/photo.jpg" }
```

Then add the same entry (English `role`/`bio`) at the same array position in `en/team.json`. `bio` is optional, some groups (e.g. `contributors`) omit it, check the neighboring entries in that same array to see if the group uses it.

**Before you add someone to Researchers, Contributors, or Advisory board: check whether that section is actually visible on the live page first.** As of this writing, only Leadership is live — the other three are hidden behind commented-out JSX in `TeamPage.tsx` (Researchers/Contributors currently hold placeholder data, Advisory is empty) pending real people to list. Editing their JSON won't show up on the site until the section is restored. See [docs/pages/team.md](../pages/team.md#hidden-sections--the-part-worth-understanding-first) for exactly what's hidden and how to restore each one.

## Editing training courses

Courses are split across two files, this is the one place content isn't 100% JSON:

- **`src/data/courses.ts`** — the non-text "shape" of each course: its `id`, category color grouping, duration in weeks, level, and tag color. This file has no French/English text in it and does not need a translated counterpart.
- **`src/i18n/locales/{fr,en}/training.json`** → `courses` object — the actual text for each course, keyed by the same `id` used in `courses.ts`. Each entry has `category`, `title`, `excerpt`, `duration`, `level`.

To add a new course: add an entry to `FEATURED_COURSES` in `courses.ts` with a new unique `id`, then add a matching object under `courses.<id>` in both `training.json` files using that same `id` as the key.

To edit an existing course's text (title, description, etc.), you only need `training.json`, both languages, no `.ts` change needed.

## Logos and images

Team photos and partner logos are plain URLs (`photo` / `logo` fields) pointing at external hosts (e.g. Wikimedia, randomuser.me placeholders). To swap an image, replace the URL string, there's no local image pipeline to run. If you want to use a locally-hosted image instead, drop the file in `public/` and reference it as `/your-file.png`.

## Publication guidelines and slide template

The contributor guide ("GAMA Institute Publication Guidelines", `/publication-guidelines`) is a single web page. Its text is a plain Markdown file per language: `src/content/publication-guidelines/fr.md` and `en.md`. Edit both, like any other text. The supported formatting is listed in [docs/pages/publication-guidelines.md](../pages/publication-guidelines.md).

The only downloadable file is the PowerPoint slide template for WeekPaper, in `public/downloads/`. To update it, overwrite the file under the same name.

## Publishing a Research Summary

Only validated summaries go on the site. Each one needs a Markdown file with its text (`src/content/research-summaries/<id>/en.md`) and an entry in `items[]` of both `research.json` files. Step-by-step: [docs/pages/research-summaries.md](../pages/research-summaries.md#recipes).

## Navigation, footer, and site-wide labels

Header nav links, footer text, the language toggle labels, and the "get in touch" button all live in `src/i18n/locales/{fr,en}/common.json` under `nav`, `footer`, and similar top-level keys. Same rule applies: edit both languages.

Social links (LinkedIn, YouTube, GitHub) and the contact email address are not translated text, they're plain constants in [`src/constants/index.ts`](../../src/constants/index.ts) (`SOCIAL_LINKS`, `CONTACT_EMAIL`). Edit them there directly, no JSON involved.

## Page titles and meta descriptions

Each page sets its browser tab title and search-engine description via `<Helmet>` near the top of its `.tsx` file, pulling from `meta.title` / `meta.description` in that page's namespace JSON. Same edit pattern as any other text.

## After you're done

1. Run `npm run dev` and click through both languages on the page(s) you changed.
2. Run `npm run type-check`, if you changed the shape of a JSON array (added/removed a field) rather than just editing string values, this can surface mismatches.
3. If the change is user-visible (new content, corrected copy, etc.), add a one-line entry to `## [Unreleased]` in [CHANGELOG.md](../../CHANGELOG.md) under **Added**/**Changed**/**Fixed** as appropriate, see the "Keeping CHANGELOG.md current" section in [CLAUDE.md](../../CLAUDE.md) for the exact rule.

## Common mistakes

- **Editing only one language.** Always mirror the change in both `fr/` and `en/` files for the same namespace.
- **Mismatched array lengths between languages.** If French has 4 team members in a group and English has 3, the page will either show blank text or crash for the missing entry when in English mode.
- **Inventing a new `tagVariant`.** Stick to variants already used elsewhere in the same file, they map to a fixed set of colors defined in the `Tag` component.
- **Changing `id` values in `courses.ts` without updating `training.json`.** The `id` is the join key between the two files, if they don't match, that course's text won't render.
