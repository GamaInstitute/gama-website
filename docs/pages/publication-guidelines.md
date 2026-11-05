# GAMA Institute Publication Guidelines

_Last verified: 2026-11-04_

- **Route:** `/publication-guidelines`
- **File:** [src/pages/PublicationGuidelinesPage.tsx](../../src/pages/PublicationGuidelinesPage.tsx)
- **Content:** Markdown, one file per language: [src/content/publication-guidelines/fr.md](../../src/content/publication-guidelines/fr.md), [en.md](../../src/content/publication-guidelines/en.md)
- **Renderer:** [src/components/guides/Markdown.tsx](../../src/components/guides/Markdown.tsx)
- **UI strings:** `common:guides.*` (eyebrow, table-of-contents label, closing call-to-action box)
- **Images:** [public/publication-guidelines/](../../public/publication-guidelines/)
- **Linked from:** one card in each contribute box (`ResourceList`): Research Summaries links to `#research-summaries`, WeekPaper to `#weekpaper`. Also the Research Summaries sidebar box and the summary form's file hint.

One page, on the model of freeCodeCamp's publication style guide, holding everything a contributor needs. It replaced three separate guides (and before that, Word downloads). The text follows the team's Word document "GAMA Institute Publication Guidelines", version 1.1 (November 2026, English, in Google Drive), adapted for the web and translated for `fr.md`. When the team sends a new version, update both files. Why Markdown instead of locale JSON: [D-19](../../DECISIONS.md).

## Structure

| Part (`##`) | Anchor | Content |
|---|---|---|
| 1. Mission and editorial principles | `#introduction` | who can contribute, why contribute, take it seriously |
| 2. Scope and accepted formats | `#scope` | the five research axes (`#axes`), Research Summary incl. research-based tutorials (`#rs-format`), WeekPaper language and recording rules (`#wp-format`) |
| 3. Finding research papers | `#finding-papers` | Boolean search, queries by area, arXiv (with the peer-review check), ACM (with screenshots), curated lists |
| 4. Research Summary standards | `#research-summaries` | at a glance, the 5-part structure with mandatory table of contents, tutorial structure, writing rules, images and tables |
| 5. WeekPaper production standards | `#weekpaper` | slide template, presentation structure |
| 6. Responsible use of generative AI | `#ai` | acceptable, own work, prohibited, disclosure |
| 7 to 11 | `#review`, `#consequences`, `#confidentiality`, `#practice`, `#checklist` | review, warnings and sanctions, confidentiality, research practice, final checklist |

The Word document numbers its last sections inconsistently (7, 6, 7, 8, 9, 10); the page numbers them 1 to 11 in order.

`###` sub-sections carry prefixed anchors (`rs-`, `wp-`, `fp-`) so they stay unique on the page. **Anchors must be identical in `fr.md` and `en.md`**: the site links to them (`/publication-guidelines#weekpaper`) whatever the language.

The table of contents lists parts and sub-sections; on small screens only the parts. A closing box links to both submission forms.

## File format

Front matter (one `key: value` per line): `title`, `description` (meta description), `lead` (paragraph under the title).

The body supports exactly what the renderer handles (see the comment at the top of `Markdown.tsx`):

- `## Part {#anchor}`, `### Sub-section {#anchor}` (both in the table of contents), `#### Heading`.
- Paragraphs, `-` and `1.` lists, `- [ ]` checklists.
- Tables (`| a | b |`; leave the first row empty for a table without a header), `> ` callout boxes, fenced code blocks, `![alt](/publication-guidelines/x.webp "caption"){1280x600}` figures. Captions can't contain straight double quotes. The `{WxH}` (the image's pixel size) is optional but keep it: without it the lazy-loaded image pushes the page down as it loads, and links to anchors further down (like `#weekpaper`) land in the wrong place.
- Inline: `**bold**`, `_italic_`, `` `code` ``, `[label](href)`. `href` can be a route (`/week-paper#contribute`), an anchor on the page (`#review`), `download:slide_template` (the one file in `DOWNLOADS`, `src/constants/index.ts`), `mailto:`, or an external URL (opens in a new tab).

Anything else (nested lists, HTML, `#` h1) is not supported and will render as plain text.

## Recipes

**Edit the guidelines.** Change `fr.md` and `en.md`. No other file is involved.

**Add a section.** Add a `###` (or `##`) heading with the same `{#anchor}` in both files. It appears in the table of contents automatically.

**Replace a screenshot.** Overwrite the file in `public/publication-guidelines/` under the same name. The screenshots are WebP (quality 90, about 130 KB each): a PNG of the same image is ten times heavier.

## Things to know

- Both languages are bundled into the page's lazy chunk (about 17 KB gzipped), loaded only on this page.
- The Word versions in Drive are no longer linked from the site. This page is the reference: if the team edits the Word files, copy the change into the `.md` files.
- The only download left anywhere is the PowerPoint slide template, offered next to the guidelines card on WeekPaper.
