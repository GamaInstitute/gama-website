# 0001 — vite-react-ssg for static site generation

Date: 2026-07-03
Status: Accepted

_Reconstructed from project scaffold on 2026-07-03; not the original decision record._

## Context

The Gama Institute website is a marketing and information site with no server-rendered personalisation. It needs fast first paint, good SEO (full HTML at request time), and a simple build pipeline for a small team.

## Decision

Use [vite-react-ssg](https://github.com/yunsii/vite-react-ssg) (v0.9) to statically generate all pages at build time. The SSG output is a set of pre-rendered HTML files in `dist/` served from a CDN.

## Alternatives considered

- **Next.js** — full SSR/ISR framework; significantly heavier; App Router complexity not warranted for a purely static marketing site; would require a Node runtime or edge compute.
- **Astro** — strong SSG story, but the existing React component tree would need rewriting in Astro's component format; switching cost too high mid-build.
- **Vite + React, no SSG** — SPA with client-side rendering only; sacrifices SEO and LCP; rejected by the SRS.

## Consequences

- All six pages are pre-rendered; routing uses React Router v6 inside vite-react-ssg's wrapper.
- `src/main.tsx` exports `createRoot = ViteReactSSG({ routes })` — this is the SSG entry point.
- `react-helmet-async` must be listed in `ssr.noExternal` in `vite.config.ts`; without it the SSG build fails because the package loads as CJS in Node and named exports are not found.
- ~~A `public/_redirects` rule (`/* /index.html 200`) is required for client-side navigation fallback on Cloudflare Pages.~~ _Superseded 2026-11-12:_ Cloudflare Pages ignored that rule (it loops onto itself), and a `public/404.html` written for GitHub Pages sent every unknown URL into a redirect loop. Unknown URLs are now handled by a prerendered `404.html` (the `404` and `*` routes in `src/routes.tsx`), which both hosts serve with a 404 status; client-side navigation needs no fallback because every real page is prerendered.
