# Architecture — Gama Institute website

_Last updated: 2026-09-09_

## Summary

A bilingual (FR default / EN toggle) static marketing website for Gama Institute. Built with Vite + React 18 + TypeScript and pre-rendered at build time by vite-react-ssg. Deployed to Cloudflare Pages; four serverless CF Functions handle the contact form, newsletter subscription, Research Summary submissions and WeekPaper presentation submissions. No database, no auth.

## Components

| Layer | Technology | Notes |
|---|---|---|
| Build / SSG | Vite 5, vite-react-ssg 0.9, React 18 | Pre-renders all routes to static HTML at build time |
| UI | React 18, TypeScript, Tailwind CSS v3 | Pure Tailwind utilities + CSS custom properties; no component library |
| Routing | React Router v6 | `RootLayout` wraps all pages via `<Outlet>`; defined in `src/routes.tsx` |
| i18n | react-i18next | FR default (pages are prerendered in French); EN toggled client-side, stored in `localStorage` (`gama-lang`) and re-applied after hydration ([D-22](DECISIONS.md)) |
| Animation | Framer Motion | `whileInView` reveals, NetworkArt entrance, card hover |
| Forms | react-hook-form + Zod | Shared Zod schemas in `src/types/` (`contact.ts`, `researchSummary.ts`, `weekpaperSubmission.ts`) |
| Fonts | @fontsource-variable/sora, @fontsource-variable/inter | Self-hosted; `@import` must precede `@tailwind` directives in `base.css` |
| Meta / SEO | react-helmet-async | Per-page `<title>` and `<meta>`; must be in `ssr.noExternal` in vite.config.ts |
| Server-side | Cloudflare Pages Functions | `POST /api/contact`, `POST /api/newsletter`, `POST /api/research-summary` and `POST /api/weekpaper-submission` (the last two multipart, emailing the uploaded files as attachments via `functions/_lib/email.ts`), all Turnstile-verified; shared verification helper in `functions/_lib/turnstile.ts` |
| Bot protection | Cloudflare Turnstile — invisible mode | Token obtained client-side on submit for both the contact form and newsletter signup; verified server-side in each CF Function |
| Hosting — production | Cloudflare Pages | Triggered by push to `main`; serves static files + CF Functions |
| Hosting — staging | GitHub Pages | Triggered by push to `develop`; static files only (no CF Functions) |

## Pages

`/` Home · `/about` About · `/week-paper` WeekPaper · `/team` Team · `/contact` Contact

Training page (`src/pages/TrainingPage.tsx`) is built but not routed — held back for a later release. Route is commented out in `src/routes.tsx`.

For how each page is actually put together — section-by-section breakdown, which component renders what, exact i18n/data sources, and step-by-step recipes for common changes — see [docs/pages/](docs/pages/README.md), one file per page.

## Key data flows

**Contact form submit:**
1. User submits form → `react-hook-form` validates client-side via Zod schema
2. Turnstile token obtained silently (invisible mode)
3. `POST /api/contact` with JSON payload + token
4. CF Function verifies token with Cloudflare siteverify, re-validates body, sends the message via Resend (`CONTACT_EMAIL_TO`/`CONTACT_EMAIL_FROM`/`RESEND_API_KEY`), returns `{ ok: true }`
5. The same Turnstile-then-Resend pattern is shared with `POST /api/newsletter` (`resend.contacts.create`) via `functions/_lib/turnstile.ts` — see [DECISIONS.md D-3](DECISIONS.md)

**Language toggle:**
1. User clicks FR / EN in header → `i18n.changeLanguage()` updates react-i18next state
2. Selection written to `localStorage` (`gama-lang`) and applied to `<html lang>`
3. On next page load, anti-FOUC inline script in `index.html` reads `localStorage` and sets `lang` before React hydrates — see [DECISIONS.md D-4](DECISIONS.md)

**Theme toggle:** Same pattern — `gama-theme` in `localStorage`, applied by the same anti-FOUC script.

## Deployment topology

```
develop ──► GitHub Actions ──► GitHub Pages (staging — static only, no CF Functions)
main    ──► GitHub Actions ──► Cloudflare Pages (production — static + CF Functions)
```

`VITE_TURNSTILE_SITE_KEY` is injected at build time via GitHub Actions secrets. Runtime secrets (`TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL_TO`, `EDITORIAL_EMAIL_TO`, `CONTACT_EMAIL_FROM`, `RESEND_API_KEY`) are set in the Cloudflare Pages dashboard.

This is the quick map. For the full picture, including how domain registration (Namecheap), DNS, and TLS fit in ahead of this pipeline, CI/CD detail, and every known gap versus the original SRS, see [docs/arc42/07-deployment-view.md](docs/arc42/07-deployment-view.md).

## ADRs

- [ADR 0001 — vite-react-ssg for static site generation](docs/adr/0001-vite-react-ssg.md)
- [ADR 0002 — Cloudflare Pages and Functions for hosting](docs/adr/0002-cloudflare-pages-functions.md)
- [ADR 0003 — Single URL with client-side i18n toggle](docs/adr/0003-client-side-i18n-single-url.md)

For every other non-obvious decision (not just the three above), see [DECISIONS.md](DECISIONS.md) or the topic-indexed [docs/arc42/09-architecture-decisions.md](docs/arc42/09-architecture-decisions.md).
