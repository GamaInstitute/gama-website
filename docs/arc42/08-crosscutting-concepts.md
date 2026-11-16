# 8. Cross-cutting Concepts

Ideas and mechanisms that show up throughout the codebase rather than belonging to one building block.

## Internationalization (i18n)

Every page owns one JSON namespace, `src/i18n/locales/{fr,en}/<namespace>.json`, loaded via `react-i18next`. French is the source of truth for structure; English mirrors it key-for-key. **All namespaces load eagerly** — they're bundled into the shared main chunk regardless of which page a visitor lands on first, not lazy-loaded per page (a large namespace file affects every page's initial load, not just its own). Language selection is single-URL (no `/fr/`/`/en/` path prefixes, see [ADR 0003](../adr/0003-client-side-i18n-single-url.md)), stored in `localStorage`, and applied before React hydrates via an inline script to avoid a flash of the wrong language (see [D-4](../../DECISIONS.md#d-4-anti-fouc-inline-script-in-indexhtml)).

**Known inconsistency:** the Contact page's hero copy and meta description are hardcoded French/English strings directly in the component, not pulled from a namespace JSON file like every other page — see [docs/pages/contact.md](../pages/contact.md#a-structural-difference-from-every-other-page) and [11 — Risks and Technical Debt](11-risks-and-technical-debt.md).

## Theming (light/dark)

Same mechanism as language: a `localStorage` key (`gama-theme`), an anti-FOUC inline script, and a `data-theme` attribute on `<html>`. Almost all components use CSS custom properties (`--bg`, `--ink`, `--accent`, etc., defined in `src/styles/base.css`) that automatically flip with `data-theme`, rather than Tailwind's `dark:` utility — Tailwind's `darkMode` config is set to track the same `data-theme` attribute specifically so the few components that do use `dark:` utilities stay consistent with the app's own toggle rather than the OS preference (see [D-9](../../DECISIONS.md#d-9-tailwind-darkmode-set-to-selector-data-themedark)).

## Security

- **Bot protection:** every state-changing endpoint (`/api/contact`, `/api/newsletter`, `/api/research-summary`, `/api/weekpaper-submission`) requires a Cloudflare Turnstile token, obtained invisibly client-side and verified server-side against Cloudflare's siteverify API via a shared helper (`functions/_lib/turnstile.ts`). Both endpoints have carried this protection only since 2026-09-09 — the newsletter endpoint previously had none at all.
- **Input validation:** a shared Zod schema (`src/types/contact.ts`) validates the contact form both client-side (fast feedback) and server-side (the actual trust boundary) — never trust client-side validation alone. The newsletter endpoint uses its own narrower inline Zod schema (just email + token).
- **Content Security Policy:** set via `public/_headers`, restricting `script-src`/`style-src`/`img-src`/`connect-src`/`frame-src` to an explicit allowlist. `script-src`/`style-src` include `unsafe-inline`, required by the anti-FOUC inline script in `index.html` — this weakens CSP's defense-in-depth against injected scripts, though no actual injection vector (`dangerouslySetInnerHTML`, `eval`) exists in the codebase today.
- **Known gap — permissive CORS:** every response, including the two API endpoints, carries `Access-Control-Allow-Origin: *` — confirmed live in production, and not set anywhere in the repo's own configuration (it's a Cloudflare Pages platform default). This means any third-party page's JavaScript can call `/api/contact`/`/api/newsletter` cross-origin and read the response. See [11 — Risks and Technical Debt](11-risks-and-technical-debt.md).
- **Known gap — no confirmed rate limiting:** neither endpoint has application-level rate limiting in code, and no Cloudflare Rate Limiting rule exists in the repo's configuration (it may or may not exist at the Cloudflare dashboard level — that's outside what the repo can confirm). Turnstile is the only current abuse control.
- **Secrets handling:** build-time secrets (`VITE_TURNSTILE_SITE_KEY`) come from GitHub Actions secrets; runtime secrets (`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, etc.) are set directly in the Cloudflare Pages dashboard and never committed. `.env` is gitignored.

## Accessibility

- **Reduced motion:** every animated component (`NetworkArt`, `Reveal`, `Modal`) checks `prefers-reduced-motion` via Framer Motion's `useReducedMotion()` and renders a static equivalent when set.
- **Focus management:** `Modal` implements a full focus trap (captures the previously-focused element, cycles Tab/Shift+Tab between the dialog's own focusable descendants, restores focus on close) and closes on `Escape` or backdrop click.
- **Auto-playing video:** `VideoPlayer`'s `autoplay` mode (used for temporary "coming soon" placeholder loops) deliberately leaves YouTube's native player controls visible, satisfying WCAG 2.2.2 (auto-playing content must remain stoppable by the visitor).
- **Skip link:** `index.html`/`RootLayout` includes a "skip to content" link as the first focusable element.
- **Known gap:** `CourseCard`'s placeholder-image fallback text is hardcoded French regardless of active language — see [docs/pages/training.md](../pages/training.md).

## Animation

All Framer Motion timing constants are centralized in one object, `ANIM` in `src/constants/index.ts` (reveal duration/easing, stagger interval, hover lift distance/duration, modal transition duration) — changing the feel of every reveal/hover/modal animation site-wide is a one-file change, not a hunt through every component. Two reusable patterns cover almost every animated element: `Reveal` (fade-up once on scroll into view) and the `revealContainer`/`revealItem` variant pair (staggered grid children) — see [docs/pages/README.md](../pages/README.md#animation-and-section-rhythm).

## Error handling and logging

Server-side (`functions/api/*.ts`) errors are logged with plain `console.error` — there is no structured logging and no log shipping/aggregation configured (the SRS proposed a Workers-compatible structured logger shipping to Cloudflare Logpush; this was never built — see [11 — Risks and Technical Debt](11-risks-and-technical-debt.md)). Client-side, there's no error-tracking service (Sentry was proposed in the SRS, never implemented) — a JavaScript error in a visitor's browser today produces no signal to the team at all beyond a user complaint.

## Performance budget

`npm run test:perf` (`scripts/perf-test.mjs`) is a deliberate two-part gate, run manually (not currently wired into CI):

1. **Main bundle size** (deterministic) — fails if the shared eager JS chunk exceeds 400KB. This is the primary gate; it's what actually caught a real regression once (importing Framer Motion in the non-lazy root pulled it out of every page's lazy chunk and into the always-downloaded bundle, 340KB → 452KB, invisible to a human eyeballing the page).
2. **Cold-load timing** under simulated mid-range-mobile CPU throttling, median of 3 runs — a secondary, noisier signal, kept because shared/virtualized CI environments swing wide enough on timing alone to false-fail. See [D-8](../../DECISIONS.md#d-8-perf-test-scriptsperf-testmjs-gates-on-bundle-size-first-timing-second) for the full reasoning.
