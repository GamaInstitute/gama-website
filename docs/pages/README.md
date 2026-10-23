# Page documentation

_Last verified: 2026-09-09_

Each page of the site has its own file here, written for someone who has never touched this codebase before. Every doc covers, in rendering order: what each section is, which component renders it, exactly which i18n keys or data files feed it, and step-by-step recipes for the changes you're most likely to make.

| Page | Route | Doc | Status |
|---|---|---|---|
| Home | `/` | [home.md](home.md) | Live |
| About | `/about` | [about.md](about.md) | Live |
| Training | not routed | [training.md](training.md) | Built, held back — see doc |
| WeekPaper | `/week-paper` | [weekpaper.md](weekpaper.md) | Live |
| Team | `/team` | [team.md](team.md) | Live (some sections hidden — see doc) |
| Contact | `/contact` | [contact.md](contact.md) | Live |

**If you only need to change text, a number, or an image URL** — not layout or behavior — go straight to [docs/guides/content-editing.md](../guides/content-editing.md) instead. It's the fast path for pure content edits. Come here when you need to understand *how* a section works, add a new kind of section, or wire up something that isn't pure copy.

**If you need the system-level picture** (build pipeline, hosting, deployment, tech stack) see [ARCHITECTURE.md](../../ARCHITECTURE.md) instead — this folder is page-level, that file is site-level.

## How every page is put together

All six pages share the same skeleton, defined once in [src/routes.tsx](../../src/routes.tsx):

```
RootLayout (eager, not code-split)
 ├─ Header
 ├─ <Outlet />  ← the page component, one of src/pages/*.tsx
 └─ Footer
```

- **Routing.** Each page is registered as a route object using React Router v6's `lazy` loader (`{ path: 'about', lazy: () => import('@/pages/AboutPage').then(m => ({ Component: m.default })) }`), **not** `React.lazy()`. The difference matters: `lazy` resolves before render, so `vite-react-ssg` (the build tool that pre-renders every route to static HTML) still produces full HTML per page. If you ever see a page rendering a blank Suspense fallback in the static build output, check that it's using this `lazy` pattern and not `React.lazy`.
- **Why this matters for adding a new page.** Copy the pattern of an existing route entry in `routes.tsx`, plus a matching nav entry in `Header.tsx`'s `NAV_ITEMS` array and a link in `Footer.tsx`. Forgetting the `Header`/`Footer` entries is the most common way a new page ends up live but unreachable from navigation — this exact situation currently applies to the Training page (see [training.md](training.md)).
- **Each page owns one i18n namespace.** `src/i18n/locales/{fr,en}/<namespace>.json`, loaded via `useTranslation('<namespace>')`. `common.json` is shared (nav, footer, shared button labels, form fallbacks). **Gotcha:** all namespaces are imported eagerly in [src/i18n/index.ts](../../src/i18n/index.ts) and bundled into the main eager chunk, not lazy-loaded per page — a very large namespace file bloats every page's initial load, not just its own page's chunk.
- **Language and theme** are both plain client-side state persisted to `localStorage` (`gama-lang`, `gama-theme`), applied via an anti-FOUC inline script in `index.html` before React hydrates. See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the full flow — this doesn't vary per page.

## Shared building blocks

These components show up across most or all pages. They're documented once here in depth; each page doc only calls out what's unique about how *that page* uses them, and links back here for the rest.

### Layout

**`Header`** — [src/components/layout/Header.tsx](../../src/components/layout/Header.tsx)
Sticky top nav. `NAV_ITEMS` (near the top of the file) is the single list driving which links appear — add/remove a page from navigation here. Renders `BrandMark`, the FR/EN toggle (writes `gama-lang` to `localStorage`), the light/dark toggle (via `useTheme`), a "get in touch" CTA, and a mobile hamburger menu. **Gotcha, load-bearing:** the background blur (`backdrop-filter`) lives on its own inner `<div>`, not on `<header>` itself — `backdrop-filter`/`filter`/`transform` on an ancestor creates a new containing block for `position: fixed` descendants, which would silently break the mobile nav panel's fixed positioning. Never move the blur onto `<header>` directly.

**`Footer`** — [src/components/layout/Footer.tsx](../../src/components/layout/Footer.tsx)
Four-column link grid (brand+tagline, Explore, Institute, Follow) plus a bottom bar with social icons. Links are a mix of internal `FooterLink to=` (React Router `Link`, no reload) and external `FooterLink href=` (opens in a new tab). Social URLs come from `SOCIAL_LINKS` in [src/constants/index.ts](../../src/constants/index.ts) — edit them there, not in this file or in JSON.

### Animation and section rhythm

**`Reveal`** — [src/components/ui/Reveal.tsx](../../src/components/ui/Reveal.tsx)
Wraps children in a `motion.div` that fades up (`opacity 0→1`, `y: 18→0`) once, the first time it scrolls into view (`viewport={{ once: true, margin: '-8% 0px' }}` — triggers ~8% before entering the viewport, never replays). Props: `delay?`, `className?`. Wrapping a whole `.map()`'d list in one `<Reveal>` animates it as a single block, not staggered per item — that's what several pages use for prose lists.

**`revealContainer` / `revealItem`** — also exported from `Reveal.tsx`, these are variant objects (not components) for the "staggered grid" pattern seen on every card grid in the site (metrics, news cards, course cards, team grids, pillar cards): apply `revealContainer` to a parent `motion.div` (`variants`, `initial="hidden"`, `whileInView="show"`), `revealItem` to each `motion.div` child. Children fade in one after another, `ANIM.STAGGER_CHILD` (0.08s) apart. All animation timing constants live in `ANIM` in [src/constants/index.ts](../../src/constants/index.ts) — change the feel of every reveal/hover animation site-wide from that one object.

**`SectionWrapper`** — [src/components/ui/SectionWrapper.tsx](../../src/components/ui/SectionWrapper.tsx)
The vertical-rhythm primitive: `alt?` toggles a tinted background (`bg-bg-alt`) so sections visually alternate down the page — when adding a new section, alternate `alt` from its neighbor to keep the banding consistent. `spacing?: 'normal' | 'tight'` controls padding (tight is for CTA/newsletter blocks). `id?` makes the section an anchor target (`/#research`, `/team#join`, etc. — check a page's `id` props before linking to it from elsewhere).

**`PageHero`** — [src/components/ui/PageHero.tsx](../../src/components/ui/PageHero.tsx)
The standard secondary-page hero: two-column grid, `Eyebrow` + `<h1>` + lead paragraph + optional CTA buttons on the left, `<NetworkArt />` on the right. Used as-is by About, Team, WeekPaper, Contact (via its own hero markup), and Training. Home does **not** use it — Home's hero is hand-built inline in `HomePage.tsx` with a different metrics-bar footer.

### Brand

**`NetworkArt`** — [src/components/brand/NetworkArt.tsx](../../src/components/brand/NetworkArt.tsx)
Purely decorative animated SVG (the 15-node knowledge-network graphic), no props, no page-specific data. Nodes/edges are static coordinates in [src/data/network.ts](../../src/data/network.ts) (`NETWORK_NODES: [x,y,r][]`, `NETWORK_EDGES: [fromIdx,toIdx][]`); colors are computed on the fly by interpolating through `GRAD_STOPS` (`src/constants/index.ts`) based on each node/edge's x-position, so the copper→teal gradient always flows left to right regardless of what nodes you add. Respects `prefers-reduced-motion` (renders static shapes instead of the animated draw-in). **Gotcha:** a `useEffect` clears the inline animation styles 3 seconds after mount so a screenshot/print capture shows the fully-drawn graph — if you significantly lengthen the animation, bump this timeout too.

**`BrandMark`** — [src/components/brand/BrandMark.tsx](../../src/components/brand/BrandMark.tsx)
The small logo mark shown in the Header and Footer. **This is currently just a static `<img>` pointing at `/logo-icon.png`** — it does **not** read `src/data/network.ts` or draw an inline SVG network graph. (CLAUDE.md's gotcha about `NetworkArt` and `BrandMark` sharing node/edge data describes an earlier version of this component and is now stale — flagged for correction, see the note at the end of this file.) To change the logo, replace `public/logo-icon.png` (and `.svg`/Apple touch icon variants referenced in `index.html`), not this component.

### Buttons, tags, labels

**`Button`** — [src/components/ui/Button.tsx](../../src/components/ui/Button.tsx)
Polymorphic via a discriminated `as` prop: `as="link"` + `to=` for internal React Router navigation (no full reload), `as="a"` + `href=` for external links, or the default `as="button"` for form/click actions. TypeScript enforces you can't mix `to`/`href` on the wrong variant. `variant`: `accent | ghost | ghost-dark | ink`. `size`: `md | sm`.

**`Eyebrow`** — [src/components/ui/Eyebrow.tsx](../../src/components/ui/Eyebrow.tsx) — small uppercase label with a short rule before it (`noRule` to omit). Purely presentational.

**`Tag`** — [src/components/ui/Tag.tsx](../../src/components/ui/Tag.tsx) — pill badge. `variant` is one of exactly three values: `default | copper | teal` — there is no mechanism to add a fourth without editing `Tag.tsx` itself, so when content-editing a `tagVariant` field in JSON, only reuse these three.

**`DarkCTA`** — [src/components/ui/DarkCTA.tsx](../../src/components/ui/DarkCTA.tsx) — the dark card used for bottom-of-page calls to action (`eyebrow`, `heading`, `body`, `children` — typically a `Button`). Self-wraps in `Reveal`, so don't wrap it again. Flips to a light bordered card in dark mode rather than staying dark-on-dark.

**`icons.tsx`** — [src/components/ui/icons.tsx](../../src/components/ui/icons.tsx) — exports exactly one icon, `LinkedInIcon`, used by `MemberCard` on the Team page. **This is not where About page's "Strategic pillars" icons come from** — those are self-hosted SVG files in `public/icons/`, referenced by path (`/icons/<name>-<hex>.svg`) directly in `about.json`, a completely different mechanism. See [about.md](about.md) for details — this is a common place to waste time grepping the wrong file.

### Modal

**`Modal`** — [src/components/ui/Modal.tsx](../../src/components/ui/Modal.tsx)
Used by WeekPaper's newsletter dialog (see [weekpaper.md](weekpaper.md)); reusable for any future modal. Props: `isOpen`, `onClose`, `closeLabel` (required — drives the close button's `aria-label`), `title?`, `children`.
- **Portal + SSR safety:** renders via `createPortal(..., document.body)`, but only after a `mounted` state flips true in a `useEffect` — this avoids a server/client hydration mismatch under `vite-react-ssg`'s prerendering, since the portal target doesn't exist during SSR.
- **Focus trap:** on open, remembers `document.activeElement`, focuses the dialog, and manually cycles Tab/Shift+Tab between the dialog's focusable descendants (queried live, not a fixed list) — closes on `Escape` and on backdrop click, and restores focus to whatever was focused before opening, when it closes.
- **Reduced motion:** zeroes transition duration and disables the scale/slide transform when `prefers-reduced-motion` is set (`useReducedMotion()` from framer-motion).

### Video

**`VideoPlayer`** — [src/components/ui/VideoPlayer.tsx](../../src/components/ui/VideoPlayer.tsx)
YouTube-only embed with a click-to-play thumbnail. Props: `label` (required — becomes both the play button's `aria-label` and the iframe's `title`), `url?`, `duration?` (small corner badge), `placeholder?` (text shown when there's no valid video), `small?` (compact aspect ratio, used by `EpisodeCard`), `gradient?` (brand-gradient placeholder background instead of plain gray), `autoplay?`.
- `videoId` is extracted from `url` by regex, matching `youtu.be/…`, `…watch?v=…`, `…/embed/…`, and `…/shorts/…` link forms. **Gotcha:** it's YouTube-only — a Vimeo or self-hosted link silently degrades to a non-functional placeholder, no error surfaced.
- Not yet playing: shows the real YouTube thumbnail (`maxresdefault.jpg`, falling back to `hqdefault.jpg` on error) with an overlaid play button; the button is `disabled` if no `videoId` resolved.
- `autoplay=true` skips the thumbnail entirely and renders the iframe immediately, muted + looped (`autoplay=1&mute=1&loop=1&playlist={videoId}`) — per the component's own doc comment, this mode is meant for temporary "coming soon" placeholder loops, not real published content, which should omit `autoplay` and use the normal click-to-play flow.
- Always passes `modestbranding=1&rel=0` to reduce YouTube's own branding/related-video suggestions, and deliberately leaves YouTube's native controls visible on autoplay so the user retains a way to pause it (WCAG 2.2.2 — auto-playing content must be stoppable).

### Newsletter

**`NewsletterForm`** — [src/components/ui/NewsletterForm.tsx](../../src/components/ui/NewsletterForm.tsx)
Self-contained form: email input + submit button, internal `idle | loading | success | error` state. On submit, solves an invisible Cloudflare Turnstile challenge via the `useTurnstileToken` hook, then `POST /api/newsletter` with `{ email, turnstileToken }`. On success, replaces itself with a thank-you message (`common.json → newsletter.success`). **Gotcha:** the `error` state has no visible message anywhere in the component — the form just silently stays on the idle layout; if you need the user to see *why* it failed, that UI doesn't exist yet.

**`NewsletterPerks`** — [src/components/ui/NewsletterPerks.tsx](../../src/components/ui/NewsletterPerks.tsx)
Pure presentational checklist. Reads `newsletter.perks_intro` / `newsletter.perks` (string array) from the **`home`** namespace (`home.json`) regardless of which page renders it — both Home's own newsletter section and WeekPaper's newsletter `Modal` render this component, so editing the perks list in `home.json` updates it in both places at once. There's no separate WeekPaper-specific perks copy.

**`useTurnstileToken`** — [src/hooks/useTurnstileToken.ts](../../src/hooks/useTurnstileToken.ts)
Shared hook behind both `NewsletterForm` and `ContactForm`'s bot protection. Takes a `RefObject<HTMLDivElement>` (an empty `<div>` you render as the widget's mount point) and returns a function that, when called, renders an invisible ("interaction-only") Turnstile widget into that container, executes it, and resolves with the solved token — removing the widget again once solved. Requires `window.turnstile` to be loaded (the `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js">` tag in `index.html`) and `VITE_TURNSTILE_SITE_KEY` set at build time. See [ARCHITECTURE.md](../../ARCHITECTURE.md) and [CLAUDE.md](../../CLAUDE.md) for the full env var picture, and `functions/_lib/turnstile.ts` for the server-side verification shared by both `functions/api/contact.ts` and `functions/api/newsletter.ts`.

### Forms

**`FormField`** — [src/components/forms/FormField.tsx](../../src/components/forms/FormField.tsx)
Polymorphic form field (`as="input" | "textarea" | "select"`, default `input`) used throughout `ContactForm`. Renders a `<label>`, the control, and an optional `<p role="alert">` error message beneath it. `as="select"` requires `children` (the `<option>`s); TypeScript enforces this per-variant via a discriminated union, same pattern as `Button`.

## Known documentation debt fixed by this pass

While researching these docs, two inaccuracies surfaced in the project's top-level docs (see the "code wins over stale docs" rule in [CLAUDE.md](../../CLAUDE.md)):

- **CLAUDE.md's gotcha** "`NetworkArt` and `BrandMark` share node/edge data... edit in `src/data/network.ts`, not in the components" is stale. `BrandMark` no longer draws an SVG graph — it's a static `<img>` of `logo-icon.png`. Only `NetworkArt` reads `network.ts` now.
- **ARCHITECTURE.md's contact-form data flow** said "Email delivery is not yet implemented." It has been implemented since — `functions/api/contact.ts` sends via Resend. Both are corrected as part of this documentation pass.
