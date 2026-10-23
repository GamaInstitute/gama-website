# Decisions

Short-form rationale for non-obvious choices that don't warrant a full ADR. Numbered sequentially.

See [docs/adr/](docs/adr/) for decisions that are expensive to reverse and would otherwise be re-litigated. See [docs/arc42/09-architecture-decisions.md](docs/arc42/09-architecture-decisions.md) for both of these, ADRs and the entries below, indexed by topic instead of by number.

---

## D-1. Drop DaisyUI; use pure Tailwind v3 + CSS custom properties

**Why:** DaisyUI's component overrides conflicted with the bespoke design token system (CSS vars for `--bg`, `--ink`, `--accent`, etc.) and required non-trivial specificity workarounds. Pure Tailwind utilities give direct control over every token value and dark mode behavior.

**Alternative considered:** Keep DaisyUI for form and button primitives — rejected because the token conflict surfaced immediately during the first component pass.

---

## D-2. Invisible Cloudflare Turnstile — no visible widget

**Why:** UX decision. Invisible mode obtains a bot-protection token silently when the user submits the form, with no checkbox or challenge interrupting the flow. The token is verified server-side in the CF Function.

---

## D-3. Contact form and newsletter both use Resend — no separate CRM

**Why:** Email delivery was deferred in the initial deploy to keep the pipeline unblocked. The contact form (`POST /api/contact`) calls `https://api.resend.com/emails` after Turnstile verification, requiring `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (recipient — `contact@gamainstitute.ca`), and `CONTACT_EMAIL_FROM` (verified Resend sender, e.g. `Gama Institute <noreply@gama.institute>`).

**Update (2026-09):** The newsletter endpoint (`POST /api/newsletter`) was a stub returning `{ ok: true }` without storing anything, pending a CRM choice. Rather than adding a separate CRM (Mailchimp, ConvertKit), it now registers subscribers as Resend Contacts via `resend.contacts.create({ email })` — the `resend` SDK already installed for the contact form covers this, so no new dependency or vendor is needed. Resend's Contacts API is no longer audience-scoped (the SDK's `audienceId` option is deprecated in favor of `segments`; see [migrating from audiences to segments](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments)) — contacts are created directly with just an email, no segment/audience setup required to get this working.

**Gotcha:** the `RESEND_API_KEY` used for `/api/contact` may be scoped to **Sending access only** (Resend lets you restrict a key's permissions at creation). That key will 401 with `restricted_api_key` on `resend.contacts.create` even though `resend.emails.send` works fine with it. The newsletter endpoint needs a key with **Full access** (or at minimum, Contacts write permission) — check this in the Resend dashboard under API Keys before assuming a "not working" report is a code bug.

**Revisit when:** Subscribers need to be organized into segments for targeted sends (e.g. WeekPaper-only vs. general newsletter) — at that point, create the relevant segment(s) in the Resend dashboard and pass `segments: [{ id }]` in the `contacts.create` call.

---

## D-4. Anti-FOUC inline script in index.html

**Why:** React hydration happens after the browser paints. Without a synchronous script that reads `gama-theme` and `gama-lang` from `localStorage` before paint, users on return visits see a flash of the wrong theme or language. The inline script sets `data-theme` and `lang` on `<html>` during the synchronous HTML parse phase, before any stylesheet or React bundle loads.

---

## D-5. Split tsconfig — separate configs for src/ and functions/

**Why:** `@cloudflare/workers-types` redefines `Response`, `Request`, and other globals in ways that conflict with the DOM typings used by Vite/React. A single tsconfig that includes both causes irresolvable type errors. Solution: `tsconfig.json` covers `src/` with `"types": ["vite/client"]`; `tsconfig.functions.json` covers `functions/` with `"types": ["@cloudflare/workers-types"]`.

See [ADR 0002](docs/adr/0002-cloudflare-pages-functions.md).

---

## D-6. Production deploy on main branch

**Why:** Simplest possible branching model for a small team. `develop` → GitHub Pages staging preview; `main` → Cloudflare Pages production. No separate release branch needed.

---

## D-7. BrandMark uses the full 15-node network, not the simplified 7-node version

**Why:** The brand sheet shows the full knowledge-network graphic as the logo icon. The simplified 7-node version found in the design handoff HTML was a placeholder. The full network is shared from `src/data/network.ts` (`NETWORK_NODES`, `NETWORK_EDGES`) and rendered statically in `BrandMark` and animated in `NetworkArt`.

**Alternative considered:** Keep the simplified version for readability at small sizes — rejected after the brand sheet confirmed the full network is the intended mark.

---

## D-8. Perf test (`scripts/perf-test.mjs`) gates on bundle size first, timing second

**Why:** Wall-clock timing under CPU throttling in a shared/virtualized environment swings widely enough between back-to-back runs to flip pass/fail with no code change at all (observed ±40% on load time). A direct check of the main `app-*.js` chunk size is deterministic and is what actually caught the regression this test was built for — importing framer-motion in `routes.tsx` (the non-lazy root) pulled it out of the lazy per-page chunks and into the eager bundle, 340KB → 452KB, invisible to a human eyeballing the page. Timing (median of 3 runs, generous budgets) stays as a secondary signal for genuine main-thread cost, not the primary gate.

**Alternative considered:** Timing-only budgets — rejected as too noisy to trust in CI without averaging over many more runs than is practical per commit.

**Revisit when:** This runs in CI on dedicated (non-shared) runners, where timing variance would be low enough to tighten the timing budgets or promote them to a primary gate.

---

## D-9. Tailwind `darkMode` set to `['selector', '[data-theme="dark"]']`

**Why:** With no `darkMode` config, Tailwind defaults to the `media` strategy — `dark:` utilities only respond to the OS `prefers-color-scheme`, not the app's own theme toggle (which sets `data-theme` on `<html>`, see [D-4](#d-4-anti-fouc-inline-script-in-indexhtml)). That mismatch meant any component using `dark:` classes (e.g. `DarkCTA`) rendered the wrong colors whenever a visitor's OS preference didn't match their in-app toggle choice. Most components sidestep this by using CSS-custom-property-driven classes (`bg-surface`, `text-ink`, etc.) that flip automatically via the `[data-theme="dark"]` selector in `base.css` — those never needed `dark:` at all. This config change makes `dark:` utilities, where used, track the same attribute.

**Revisit when:** Never intentionally — this is the correct wiring; don't remove it to "fix" a future dark-mode-looks-wrong report without checking this first.

---

## D-10. Team member photos are linked via URL (Google Drive), not committed to the repo

**Why:** Team member entries in `team.json` (fr/en) carry a `photo` field — a direct image URL — instead of a local asset path under `public/`. The institute's workflow is to host photos on Google Drive and drop the link into the JSON, so non-technical staff can swap a photo without a PR or a rebuild-triggering asset commit. `Avatar` (`src/components/team/Avatar.tsx`) renders the URL as an `<img>` when set, falling back to a generated initials avatar (solid `--accent` background + initials) when `photo` is empty. `img-src` in `public/_headers` was widened accordingly, currently allowing `https://drive.google.com`, `https://lh3.googleusercontent.com` (Drive's real image-serving domains), and `https://randomuser.me` (temporary dev placeholder photos, see below).

A plain Drive "share" link (`drive.google.com/file/d/<ID>/view`) is an HTML viewer page, not an image — it will not render in an `<img>` tag. Use the thumbnail form instead: `https://drive.google.com/thumbnail?id=<ID>&sz=w800` (redirects to `lh3.googleusercontent.com`). The file must be shared as "Anyone with the link."

**Don't use `https://drive.google.com/uc?export=view&id=<ID>`** — as of 2026-08 it 303-redirects to `drive.usercontent.google.com`, which sends `Cross-Origin-Resource-Policy: same-site` on the image response. Browsers silently refuse to load that as a cross-origin `<img>` (no network error surfaces — the element just falls back to rendering its `alt` text), so photos linked this way appear blank on the live site even though the URL works fine when fetched directly (e.g. via curl). `thumbnail?...` avoids this because it lands on `lh3.googleusercontent.com`, which sets no CORP header.

**Photo spec:** square (1:1), at least 800×800px, headshot centered with shoulders visible and even margin on all sides. `Avatar` always crops with `object-cover` into whichever shape the section uses — a rounded rectangle in `MemberCard` (leadership/advisory-big, up to ~400px wide) or a circle in `AdvisorRow` (researchers/contributors, 56px). A square, centered source crops cleanly into both; an off-center or non-square source will crop faces oddly in one shape or the other. 800px covers the largest on-screen size (`MemberCard`, ~400px) at 2x for retina. Export as JPEG or WebP, ideally under 500KB — there's no resizing or CDN in front of Drive-hosted images, so the browser downloads the file at full size.

When a supplied photo doesn't meet spec (e.g. a tall full-body portrait instead of a centered square headshot — Patrick Foalem's Drive photo is one), don't re-crop the source file. Set an optional per-member `"photoPosition"` in `team.json` instead (CSS `object-position`, e.g. `"center top"`), which `Avatar`/`MemberCard` pass straight through to the `<img>`'s inline style. Omit the field for photos that already match spec — `object-cover`'s default centering is correct for those.

**Placeholder photos (current state):** all 19 members currently point to `https://randomuser.me/api/portraits/{men,women}/N.jpg` — generic stock headshots, not real people — as a stand-in until real Drive links are supplied. `randomuser.me` is a placeholder-only dependency; when real photos are ready, replace each `photo` value with the Drive direct-view URL for that person and drop `https://randomuser.me` from `img-src` in `public/_headers`.

**Alternative considered:** Commit photos to `public/team/`, referenced by local path — rejected because it puts photo updates behind a PR and a deploy, defeating the point of letting staff self-serve updates. **Update:** this was reconsidered for Patrick Foalem and Foutse Khomh specifically — see [D-13](#d-13-patrick-foalems-and-foutse-khomhs-photos-are-committed-locally-not-drive-hosted).

**Revisit when:** Photo count or load performance makes an unmanaged external host (no resizing, no CDN cache control) a real problem — a proper asset pipeline (Cloudflare Images, or committed + optimized files) would replace this.

---

## D-13. Patrick Foalem's and Foutse Khomh's photos are committed locally, not Drive-hosted

**Why:** Both photos were supplied as local files (not Drive share links) and are small (139KB, 35KB), so they were committed to `public/team/` (`patrick-foalem.jpg`, `foutse-khomh.webp`) and referenced by local path instead of routed through Google Drive. This sidesteps the CORP-header fragility documented above ([D-10](#d-10-team-member-photos-are-linked-via-url-google-drive-not-committed-to-the-repo)) entirely for these two confirmed, stable photos. The general Drive-hosted, self-serve workflow in D-10 still stands for placeholder swaps and future members — this is a per-photo exception, not a reversal of the convention.

**Update (2026-10-13):** Dmytro Humeniuk's photo follows the same exception (`public/team/dmytro-humeniuk.webp`). The same day, all three committed photos were background-removed and recomposited onto one shared backdrop at 400×400 with matched framing (recipe in [docs/pages/team.md](docs/pages/team.md#how-team-photos-work)), which also departs from D-10's "don't re-crop, use `photoPosition`" advice: `photoPosition` can shift a crop but can't zoom in or change a background. 400px is 4× the 96px avatar. The original, unprocessed photos are in git history.

**Revisit when:** A local-only convention is chosen deliberately for all team photos (would fully supersede D-10), or these two photos need to change again — at that point, either update the committed file directly or move back to a Drive link using the `thumbnail?...` form.

---

## D-11. Academic partner logos on the homepage are hotlinked from Wikimedia Commons and partner sites

**Why:** The "Partenaires & collaborations" section (`home.json` → `partners.categories`) renders real logos for IVADO, Mila, Polytechnique Montréal, Université de Montréal, McGill University and HEC Montréal — chosen as IVADO's actual consortium partner universities (Université Laval, the fifth, was dropped: its only available Commons file is a ~5MB SVG, too heavy for a homepage image). Each `logo` field is a direct image URL, sourced either from Wikimedia Commons (`upload.wikimedia.org`) or, for IVADO, its own site header asset (`ivado.ca`) since no clean Commons file existed for it. `img-src` in `public/_headers` was widened to allow both hosts. `HomePage.tsx` renders each in a fixed `bg-white` card (not the theme-following `bg-surface`) so logos with dark or colored elements stay legible in both light and dark site themes — same reasoning as [D-9](#d-9-tailwind-darkmode-set-to-selector-data-themedark).

**Caution for future edits:** several Commons files under plausible-looking names (e.g. `McGill_(logo).svg`, `Université-de-Montréal_(logo).svg`) turned out to be a generic black-box placeholder template reused across unrelated Montreal-borough articles, not the institution's real logo — confirmed by inspecting the SVG source (`sodipodi:docname` referenced a different place entirely) and a rendered screenshot. Don't trust a Commons filename or a search-engine summary alone; render the candidate image and look at it before wiring it in.

**Alternative considered:** Commit logo files to `public/partners/` — likely the better long-term home (stable, no dependency on a third party's file staying put), but skipped for now since these are still placeholder-quality picks pending each institution's actual permission/brand-usage confirmation, not final assets worth committing to the repo yet.

**Revisit when:** Real partnerships are confirmed and the institute has permission to display each logo — at that point, source each institution's actual brand-kit asset (not a scraped Commons or third-party-site file) and commit it to `public/partners/`. Same trigger for making the logos clickable through to each partner's homepage (see TODO in `HomePage.tsx`) — displaying a logo already implies a relationship; linking out to the partner's own site firms that claim up further, so it should wait for the same confirmation.

---

## D-12. WeekPaper kept its name after moving from a weekly to a bi-weekly release cadence

**Why:** The series switched from a weekly to a bi-weekly episode schedule, but the `WeekPaper` brand name (product name, YouTube channel, page title) was kept as-is rather than renamed. Copy on the WeekPaper page (`weekpaper.json`, fr/en — hero h1, meta description, subscribe lead) was updated to say "every two weeks" / "toutes les deux semaines" instead of "every week" / "chaque semaine". Renaming would cost the established YouTube branding and any inbound links/SEO for a cosmetic mismatch that plenty of recognizable series live with (name outlives an early cadence choice).

**Revisit when:** The cadence changes again, or if audience feedback shows the name is genuinely causing confusion about release frequency.

**Update (2026-09-06):** Cadence reverted back to weekly. Copy in `weekpaper.json` (fr/en — hero h1, meta description, subscribe lead) restored to "every week" / "chaque semaine". The name-vs-cadence mismatch this entry was about no longer applies; kept here for history per the "update, don't delete" convention.

## D-14. Content icons are self-hosted SVGs in `public/icons/`, not hotlinked from Iconify

**Why:** Category/pillar icons on Home, About and WeekPaper used to be `<img>` URLs pointing at `api.iconify.design/mdi:<name>.svg?color=...`. In October 2026 Iconify stopped serving that URL form (404, only `mdi/<name>.svg` still works), and every icon on the site went blank at once with no deploy on our side. The icons are now downloaded once with the brand color baked in (`public/icons/<name>-<hex>.svg`) and served same-origin, so a third-party API change can't break them, and `api.iconify.design` was dropped from the CSP `img-src`.

**Alternative considered:** Switching to the `mdi/<name>.svg` URL form. A one-line fix, but it keeps a runtime dependency on a free API that has already changed under us once. Bundling an icon library (e.g. `@mdi/js`) was also possible, but the icon is chosen per item in i18n JSON, so a plain path fits the existing content model with no code change.
