# GAMA Institute Publication Guidelines

_Last verified: 2026-11-02_

- **Route:** `/publication-guidelines`
- **File:** [src/pages/PublicationGuidelinesPage.tsx](../../src/pages/PublicationGuidelinesPage.tsx)
- **Content:** Markdown, one file per language: [src/content/publication-guidelines/fr.md](../../src/content/publication-guidelines/fr.md), [en.md](../../src/content/publication-guidelines/en.md)
- **Renderer:** [src/components/guides/Markdown.tsx](../../src/components/guides/Markdown.tsx)
- **UI strings:** `common:guides.*` (eyebrow, table-of-contents label, closing call-to-action box)
- **Images:** [public/publication-guidelines/](../../public/publication-guidelines/)
- **Linked from:** one card in each contribute box (`ResourceList`): Research Summaries links to `#research-summaries`, WeekPaper to `#weekpaper`. Also the Research Summaries sidebar box and the summary form's file hint.

One page, on the model of freeCodeCamp's publication style guide, holding everything a contributor needs. It replaced three separate guides (and before that, Word downloads). The text comes from the team's Word documents (Drive folder, 2026-11-02), adapted for the web. Why Markdown instead of locale JSON: [D-19](../../DECISIONS.md).

## Structure

| Part (`##`) | Anchor | Content |
|---|---|---|
| Introduction | `#introduction` | the two ways to contribute, and the five research axes (`#axes`) that every paper must relate to |
| Research Summaries | `#research-summaries` | at a glance, the 5-part structure, writing rules, images and tables, submitting |
| WeekPaper | `#weekpaper` | the 8 steps, from choosing a paper to submitting |
| Review and publication | `#review` | shared by both: accuracy, review, credit, CC BY 4.0 licence |
| Finding a paper | `#finding-papers` | Boolean search, ACM and arXiv (with screenshots), selecting a paper, queries by axis, curated lists, checklist |

`###` sub-sections carry prefixed anchors (`rs-`, `wp-`, `fp-`) so they stay unique on the page. **Anchors must be identical in `fr.md` and `en.md`**: the site links to them (`/publication-guidelines#weekpaper`) whatever the language.

The table of contents lists parts and sub-sections; on small screens only the parts. A closing box links to both submission forms.

## File format

Front matter (one `key: value` per line): `title`, `description` (meta description), `lead` (paragraph under the title).

The body supports exactly what the renderer handles (see the comment at the top of `Markdown.tsx`):

- `## Part {#anchor}`, `### Sub-section {#anchor}` (both in the table of contents), `#### Heading`.
- Paragraphs, `-` and `1.` lists, `- [ ]` checklists.
- Tables (`| a | b |`; leave the first row empty for a table without a header), `> ` callout boxes, fenced code blocks, `![alt](/publication-guidelines/x.png "caption")` figures. Captions can't contain straight double quotes.
- Inline: `**bold**`, `_italic_`, `` `code` ``, `[label](href)`. `href` can be a route (`/week-paper#contribute`), an anchor on the page (`#review`), `download:slide_template` (the one file in `DOWNLOADS`, `src/constants/index.ts`), `mailto:`, or an external URL (opens in a new tab).

Anything else (nested lists, HTML, `#` h1) is not supported and will render as plain text.

## Recipes

**Edit the guidelines.** Change `fr.md` and `en.md`. No other file is involved.

**Add a section.** Add a `###` (or `##`) heading with the same `{#anchor}` in both files. It appears in the table of contents automatically.

**Replace a screenshot.** Overwrite the file in `public/publication-guidelines/` under the same name.

## Things to know

- Both languages are bundled into the page's lazy chunk (about 17 KB gzipped), loaded only on this page.
- The Word versions in Drive are no longer linked from the site. This page is the reference: if the team edits the Word files, copy the change into the `.md` files.
- The only download left anywhere is the PowerPoint slide template, offered next to the guidelines card on WeekPaper.
