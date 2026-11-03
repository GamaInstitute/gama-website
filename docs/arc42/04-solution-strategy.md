# 4. Solution Strategy

The handful of decisions that shaped everything else, each with the one-line reason. Full rationale and alternatives considered live in [DECISIONS.md](../../DECISIONS.md) and [docs/adr/](../adr/) — this section is the map, not the territory; see [9 — Architecture Decisions](09-architecture-decisions.md) for the full index.

| Decision | One-line reason | Full rationale |
|---|---|---|
| React + Vite, statically pre-rendered (`vite-react-ssg`), instead of Next.js | The site's content isn't dynamic or personalized per visitor — a full SSR framework was judged to be more machinery than a marketing/informational site needs. Static pre-rendering keeps the SEO/fast-first-paint benefit without the operational weight. | [ADR 0001](../adr/0001-vite-react-ssg.md) |
| Cloudflare Pages + Pages Functions for hosting | One platform for both static assets and the small amount of serverless logic (contact form, newsletter) needed, at no additional cost, on infrastructure the team was already using (Cloudflare DNS). | [ADR 0002](../adr/0002-cloudflare-pages-functions.md) |
| Single URL structure with client-side language toggle (no `/fr/`, `/en/` prefixes) | Matches the SRS's requirement for a single domain/URL structure; avoids doubling the number of pre-rendered routes. | [ADR 0003](../adr/0003-client-side-i18n-single-url.md) |
| Two hosting environments from one repo — GitHub Pages (staging) and Cloudflare Pages (production) | Lets changes be reviewed on a stable public URL before touching production, without needing Cloudflare account access for routine review. | [D-6](../../DECISIONS.md#d-6-production-deploy-on-main-branch) |
| Pure Tailwind CSS + custom properties, no component library | DaisyUI's own component styles conflicted with the project's custom design-token system (`--bg`, `--ink`, `--accent`, etc.). | [D-1](../../DECISIONS.md#d-1-drop-daisyui-use-pure-tailwind-v3--css-custom-properties) |
| Invisible Cloudflare Turnstile (no visible challenge widget) | Obtains a bot-protection token silently on submit — no interruption to the form-filling flow. | [D-2](../../DECISIONS.md#d-2-invisible-cloudflare-turnstile--no-visible-widget) |
| Resend for both the contact form's email and the newsletter list — no separate CRM | One vendor, one SDK already needed for the contact form, covers both use cases via its Contacts API. | [D-3](../../DECISIONS.md#d-3-contact-form-and-newsletter-both-use-resend--no-separate-crm) |
| Team photos linked via URL (Google Drive), not committed to the repo | Lets non-technical staff swap a photo without a pull request or a rebuild. | [D-10](../../DECISIONS.md#d-10-team-member-photos-are-linked-via-url-google-drive-not-committed-to-the-repo) |

## Quality goal → approach

How the top quality goals from [1 — Introduction and Goals](01-introduction-and-goals.md) map to concrete architectural choices:

| Quality goal | Architectural approach |
|---|---|
| Low operational cost | Cloudflare Pages, GitHub Pages, and GitHub Actions all run within their free tiers at current traffic — no paid infrastructure exists today. |
| Maintainability by a small team | Small, deliberately narrow dependency footprint (React, Vite, Tailwind, react-i18next, react-hook-form + Zod, Resend, Framer Motion — no state-management library, no component library, no ORM); documentation-heavy repo ([CLAUDE.md](../../CLAUDE.md), [docs/pages/](../pages/README.md), this document). |
| Performance / fast first paint | Static pre-rendering (`vite-react-ssg`) delivers full HTML on first response; every page is code-split so visiting one page doesn't download every other page's JavaScript; a bundle-size budget script (`npm run test:perf`) catches regressions where something accidentally leaks into the shared eager bundle — see [D-8](../../DECISIONS.md#d-8-perf-test-scriptsperf-testmjs-gates-on-bundle-size-first-timing-second). |
| Security against automated abuse | Every state-changing endpoint (`/api/contact`, `/api/newsletter`, `/api/research-summary`, `/api/weekpaper-submission`) requires a verified Cloudflare Turnstile token, checked server-side; all input is re-validated server-side with Zod regardless of client-side validation. See [8 — Cross-cutting Concepts](08-crosscutting-concepts.md) and [10 — Quality Requirements](10-quality-requirements.md) for the current state, including known gaps. |
| SEO discoverability | Static pre-rendering means crawlers receive complete HTML, not a JavaScript shell; per-page `<title>`/meta description via `react-helmet-async`. |
