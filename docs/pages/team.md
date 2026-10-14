# Team page

_Last verified: 2026-09-09_

- **Route:** `/team`
- **File:** [src/pages/TeamPage.tsx](../../src/pages/TeamPage.tsx)
- **i18n namespace:** `team` → [src/i18n/locales/{fr,en}/team.json](../../src/i18n/locales/fr/team.json)
- **Shared components used:** see [README.md](README.md) for `PageHero`, `Reveal`/`revealContainer`/`revealItem`, `SectionWrapper`, `Eyebrow` — only what's specific to Team is covered below.

Three of this page's four member-listing sections are currently hidden. Read [Hidden sections](#hidden-sections--the-part-worth-understanding-first) before editing team data — it explains exactly what's live vs. commented-out vs. empty, since those are three different states here, not one.

## Section-by-section (rendering order)

| # | Section | Anchor id | Live? | Component | Data |
|---|---|---|---|---|---|
| 1 | Hero | — | Yes | `PageHero` | `hero.*` |
| 2 | Leadership | — | Yes | `MemberCard` grid | `leadership.members[]` |
| 3 | Advisory board | — | **No** (commented out) | `MemberCard` grid | `advisory.members` (empty `[]`) |
| 4 | Researchers | — | **No** (commented out) | `AdvisorRow` grid | `researchers.members[]` (placeholder data) |
| 5 | Contributors | — | **No** (commented out) | `AdvisorRow` grid | `contributors.members[]` (placeholder data) |
| 6 | Join us | `#join` | Yes | inline cards | `join.items[]` |

### 1. Hero

Standard `PageHero`, no page-specific behavior.

### 2. Leadership

`SectionWrapper alt`. A 3-column grid (collapsing to 2, then 1) of `MemberCard`s, `revealContainer`/`revealItem` staggered. Data: `leadership.members[]`, typed `{ name, role, bio?, photo?, photoPosition?, linkedin? }`. Currently populated with three real members. **`bio` is read into the data type but never actually rendered by `MemberCard`** — it's reserved for a possible future detail view/modal, not a bug in the current card.

### 6. Join us

`SectionWrapper alt id="join"` (the `id` is what makes `/team#join` a valid anchor link — used by the Footer's "Careers" link). Three cards from `join.items[]` (`{ no, title, body, link }`), each linking to the Contact page with a pre-selected subject:

```
<Link to={`/contact?subject=${JOIN_SUBJECTS[item.no] ?? 'other'}`}>
```

`JOIN_SUBJECTS` (near the top of `TeamPage.tsx`) is a hardcoded lookup keyed by the JSON's `no` field, **not** by array index:

| `no` | Maps to subject |
|---|---|
| `"01"` | `research` |
| `"02"` | `other` (comment: no dedicated subject for "open positions" yet) |
| `"03"` | `other` (comment: no dedicated subject for "volunteering" yet) |

**Gotcha:** because this is keyed by the string value of `no`, reordering `join.items` without updating `JOIN_SUBJECTS` — or adding a 4th item with `no: "04"` — silently falls through to `other` rather than erroring. If you add a card, add a matching entry to `JOIN_SUBJECTS` in the same change, and check whether `?subject=` needs a new value added to the `ContactSubject` enum first (see [contact.md](contact.md#the-subject-dropdown-three-places-kept-in-sync)).

## Hidden sections — the part worth understanding first

Unlike Home or WeekPaper (where a hidden section is blocked on content that doesn't exist yet), Team's three hidden sections are each in a genuinely different state — worth checking before assuming "just uncomment and fill in the JSON":

| Section | Hook commented out? | JSX commented out? | Data in `team.json` today | Renders with |
|---|---|---|---|---|
| Advisory board | Yes | Yes | `advisory.members = []` — genuinely empty in both languages | `MemberCard` |
| Researchers | Yes | Yes | 4 entries present, but placeholder (generic single-initial names, `randomuser.me` stock photos) | `AdvisorRow` |
| Contributors | Yes | Yes | 6 entries present, same kind of placeholder data | `AdvisorRow` |

**One inconsistency worth knowing about before you go looking for it:** the `AdvisorRow` import comment near the top of `TeamPage.tsx` reads as if it covers all three hidden sections, but the Advisory board's own commented-out JSX actually calls `MemberCard`, not `AdvisorRow` — only Researchers and Contributors use `AdvisorRow`. If you're restoring Advisory alone, you don't need that import; if you're restoring Researchers/Contributors, you do.

### To restore Advisory board
1. Uncomment its hook (`const advisory = t('advisory.members', ...) as Member[]`) near the top of the file.
2. Uncomment its `SectionWrapper` JSX block (uses `MemberCard`, same shape as Leadership).
3. Populate `advisory.members` with real people (`{ name, role, photo?, linkedin? }`) in both locale files — it's currently `[]`, so there's nothing to see even once uncommented.

### To restore Researchers and Contributors
1. Uncomment the `AdvisorRow` import.
2. Uncomment both hooks (`researchers`, `contributors`).
3. Uncomment both `SectionWrapper` JSX blocks (they sit together in one comment block — Researchers first with `alt`, Contributors second without, preserving the alternating-background rhythm with Leadership above and Join below — see `SectionWrapper`'s `alt` prop in [README.md](README.md)).
4. **Replace the placeholder data first** — `researchers.members` and `contributors.members` in both locale files currently hold fake single-initial names with `randomuser.me` stock photos, not real people. Don't ship this section with that data live.
5. Once every placeholder `randomuser.me` photo is replaced with a real one, remove `https://randomuser.me` from the `img-src` directive in `public/_headers` — it's only there for these dev placeholders (see D-10 in [DECISIONS.md](../../DECISIONS.md)).

## Components specific to this page

**`MemberCard`** — [src/components/team/MemberCard.tsx](../../src/components/team/MemberCard.tsx). Props: `name, role, photo?, photoPosition?, linkedin?`. Square card, centered content, 96×96 circular `Avatar`. The LinkedIn badge (top-right corner) is conditional purely on `linkedin` being set — there's no separate "hide the badge" flag, just omit the field.

**`Avatar`** — [src/components/team/Avatar.tsx](../../src/components/team/Avatar.tsx). Props: `name, photo?, photoPosition?, shape: 'rounded' | 'circle'`. **The fallback behavior is the key thing to know:** if `photo` is omitted, it renders the person's initials over a solid accent-colored circle instead of a broken image — so you can add a team member with no photo at all, and it'll render cleanly; add the real photo later with no other change needed. `getInitials` strips the titles "Dr"/"Pr" (case-insensitive) before taking initials, so "Dr. Patrick Loic Foalem" becomes "PF", not "DP".

**`AdvisorRow`** — [src/components/team/AdvisorRow.tsx](../../src/components/team/AdvisorRow.tsx). Props: `name, role, photo?` — notably narrower than `MemberCard` (no `linkedin`, no `photoPosition`). Compact horizontal row with a divider between entries (`border-b`, `last:border-0`). Currently only used by the two hidden sections above.

## How team photos work

The documented convention ([D-10 in DECISIONS.md](../../DECISIONS.md)) is: host the photo on Google Drive, and use the link format `https://drive.google.com/thumbnail?id=<ID>&sz=w800` — **not** the ordinary "share" link (an HTML viewer page, won't load in an `<img>`) and **not** `drive.google.com/uc?export=view&id=...` (as of 2026-08 this sends a `Cross-Origin-Resource-Policy` header that silently blackholes the image in an `<img>` tag — no console error, it just falls back to blank/alt text). `public/_headers`' CSP already allowlists both `drive.google.com` and `lh3.googleusercontent.com` for this reason.

**In practice, right now, nobody's photo actually uses a Drive link.** The three real Leadership members' photos were small enough to commit directly as local files (`public/team/patrick-foalem.jpg`, `public/team/foutse-khomh.webp`, `public/team/dmytro-humeniuk.webp`, referenced by local path) — a deliberate, documented exception (D-13), not a reversal of the Drive convention. The placeholder Researchers/Contributors entries use `randomuser.me` stock photos instead, meant to be replaced (with either a Drive link or a committed local file, following the D-13 pattern) once real people are identified. Don't go looking for an existing Drive link to copy the pattern from — there isn't one yet.

**Photo spec (D-10):** square (1:1), at least 800×800px, headshot with shoulders visible, centered with even margins — because `Avatar` always applies `object-cover`, an off-center or non-square source crops badly. If a supplied photo doesn't meet spec, don't re-crop the file — set `photoPosition` in the JSON entry instead (e.g. `"center top"`), which flows straight through to the image's `object-position` style. Prefer JPEG/WebP, ideally under 500KB.

**Shared background (since 2026-10-13):** the three Leadership photos were background-removed and recomposited so they all sit on the same backdrop, a vertical gradient from `#E6EFF1` (top) to `#C4D8DE` (bottom), 400×400px. Framing is matched too: top of the head at 15% from the top edge, head (hair to chin) about 55% of the height, face centered, body running off the bottom edge. A new member's photo should get the same treatment so the row stays consistent. It was done with [`@imgly/background-removal-node`](https://www.npmjs.com/package/@imgly/background-removal-node) run outside the repo (it is not a project dependency); use its output only as an alpha mask over the original photo, since it returns a 256-color palette PNG. Because of this, `photoPosition` isn't used by any current member.

## How-to recipes

**Add a Leadership member:** add `{ name, role, bio?, photo?, photoPosition?, linkedin? }` to `leadership.members` in both locale files, same array index. No code change needed. Grid is `grid-cols-3` — an odd count leaves a gap in the last row, not auto-balanced, which is fine but worth expecting.

**Add a Join Us card:** add `{ no, title, body, link }` to `join.items` in both locale files, and add a matching entry to `JOIN_SUBJECTS` keyed by that same `no` string (see [Join us](#6-join-us) above) — otherwise the new card's contact link silently falls through to the generic `other` subject.
