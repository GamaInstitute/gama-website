# Contributor guides

_Last verified: 2026-11-02_

- **Routes:** `/guides/research-summary`, `/guides/weekpaper`, `/guides/finding-papers`
- **File:** [src/pages/GuidePage.tsx](../../src/pages/GuidePage.tsx) (one component, `slug` prop; the three routes are generated in [src/routes.tsx](../../src/routes.tsx))
- **Content:** Markdown, one file per guide and language: [src/content/guides/{fr,en}/&lt;slug&gt;.md](../../src/content/guides/fr/)
- **Renderer:** [src/components/guides/Markdown.tsx](../../src/components/guides/Markdown.tsx)
- **UI strings:** `common:guides.*` (eyebrow, table-of-contents label, "Ready to contribute?")
- **Images:** [public/guides/](../../public/guides/)
- **Linked from:** the contribute boxes on [Research Summaries](research-summaries.md) and [WeekPaper](weekpaper.md) (`ResourceList`), and from each other.

The guides used to be Word files to download. They are now web pages you read on the site, like freeCodeCamp's publication style guide: title, lead, sticky table of contents, tables, query examples, screenshots and a closing call to action. The text comes from the team's Word documents (Drive folder, 2026-11-02), adapted for the web: placeholders like "[Write one or two short paragraphs]" became guidance, and "send us…" steps now point to the site's submission forms. Why Markdown instead of locale JSON: [D-19](../../DECISIONS.md).

None of the guides is offered as a Word file any more, including the research summary template: the guide page replaces it. The only download left is the PowerPoint slide template, which contributors build their slides in.

## File format

Each file starts with front matter, one `key: value` per line:

| Key | Use |
|---|---|
| `title` | `<h1>` and browser tab (`title | Gama Institute`) |
| `description` | meta description |
| `lead` | paragraph under the title |
| `cta_label`, `cta_href` | optional dark box at the end (button to the submission form). Leave out for no box |

The body supports exactly what the renderer handles (see the comment at the top of `Markdown.tsx`):

- `## Heading {#anchor}`: a section, listed in the table of contents. Give it an explicit `{#anchor}` and **keep the same anchor in both languages**, so links like `/guides/finding-papers#arxiv` work in FR and EN.
- `### Heading`, paragraphs, `-` and `1.` lists, `- [ ]` checklists.
- Tables (`| a | b |`; leave the first row empty for a table without a header), `> ` callout boxes, fenced code blocks, `![alt](/guides/x.png "caption")` figures. Captions can't contain straight double quotes.
- Inline: `**bold**`, `_italic_`, `` `code` ``, `[label](href)`. `href` can be a route (`/week-paper#contribute`), `download:slide_template` (the one file in `DOWNLOADS`, `src/constants/index.ts`), `#anchor`, `mailto:`, or an external URL (opens in a new tab).

Anything else (nested lists, HTML, `#` h1) is not supported and will render as plain text.

## Recipes

**Edit a guide.** Change the `.md` file in both `fr/` and `en/`. No other file is involved.

**Add a guide.** Create `src/content/guides/{fr,en}/<slug>.md`, add the slug to `GUIDE_SLUGS` in `GuidePage.tsx` and to the list in `src/routes.tsx`, then link to it from a `ResourceList` (`{ label, meta, to: '/guides/<slug>' }` in the page's locale file).

**Replace a screenshot.** Overwrite the file in `public/guides/` under the same name.

## Things to know

- All six Markdown files are bundled into the `GuidePage` chunk (about 17 KB gzipped). It only loads on guide pages.
- The Word versions in Drive are no longer linked from the site. The web pages are now the reference: if the team edits the Word files, the change must be copied into the `.md` files.
