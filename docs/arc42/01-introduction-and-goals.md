# 1. Introduction and Goals

## What this is

The Gama Institute website is the public marketing and information site for Gama Institute, a bilingual (French/English) research and training institute working at the intersection of software engineering and AI. It presents the institute to three kinds of visitors: prospective students and researchers, potential university/industry partners, and press — and gives staff a way to receive messages (contact form) and grow a mailing list (newsletter signup). There is no login, no user accounts, and no database — every visible page is content, not an application in the software-product sense.

Seven pages exist: Home, About, Training, WeekPaper (a video series), Research Summaries (community-written paper summaries, with a submission form), Team, and Contact, plus a Privacy Policy and Terms of Use. Training is fully built but deliberately not yet live — see [11 — Risks and Technical Debt](11-risks-and-technical-debt.md).

## Why this document exists

The original [Software Requirements Specification (SRS v2.2)](#) defined the intended technology stack and non-functional requirements before the site was built. This document is the architecture description *after* the fact — what actually got built, verified against the running code, for anyone who needs to understand, maintain, extend, or make decisions about the system going forward. It follows the [arc42](https://arc42.org/) template, a widely-used structure for documenting software architecture, adapted here to stay readable for stakeholders who aren't developers.

## Requirements overview

From the SRS (`Gama_Institute_Website_SRS_v2.pdf`, v2.2) and the institute's own stated needs, the site had to be:

- A **marketing and informational** site — not a full application — covering the institute's mission, training offerings, a video series, team, and a way to get in touch.
- **Bilingual** (French default, English toggle) across every page.
- **Fast and good for SEO** despite not running a traditional server-rendering framework.
- **Cheap to run** — ideally near-zero hosting cost at current traffic scale.
- **Maintainable by a small or solo development team**, without a dedicated ops function.
- **Secure by default** against the kinds of abuse a public form-taking marketing site actually faces (spam, bot signups) — not enterprise-grade threat modeling, since there's no user data at stake beyond form submissions.

## Quality goals (prioritized)

Per arc42 convention, the top few quality attributes that most shaped decisions, in priority order:

| Priority | Quality goal | Why it mattered here |
|---|---|---|
| 1 | **Low operational cost** | Small institute, no dedicated ops budget — the entire stack was chosen to run on free-tier hosting (Cloudflare Pages, GitHub Pages, GitHub Actions) at current traffic. |
| 2 | **Maintainability by a small team** | No dedicated platform/DevOps role — fewer moving parts (no server to patch, no database to back up) directly reduces ongoing maintenance burden. |
| 3 | **Performance / fast first paint** | A marketing site's job is to not lose visitors before they see the content — static pre-rendering (SSG) exists specifically so a visitor gets full HTML on the very first response, not a blank page waiting on JavaScript. |
| 4 | **Security against automated abuse** | The only user-writable surfaces (contact form, newsletter signup) are public and unauthenticated — bot/spam protection on both was a deliberate, non-negotiable requirement. |
| 5 | **SEO discoverability** | Being found by prospective students/partners/press depends on search engines seeing real content, not a JavaScript shell. |

Accessibility and bilingual correctness are treated as baseline requirements throughout rather than a single prioritized line — see [8 — Cross-cutting Concepts](08-crosscutting-concepts.md).

## Stakeholders

| Role | Concern |
|---|---|
| Institute leadership | The site accurately represents the institute, costs little to run, and can be updated (new team members, news, courses) without needing a developer for every change. |
| Non-technical staff / content editors | Can update text, team photos, and course listings by editing JSON files and Google Drive links — see [docs/guides/content-editing.md](../guides/content-editing.md) — without needing to touch code or trigger a developer review for routine updates. |
| Developers / maintainers | Need to understand the system quickly, extend it safely, and keep it working across two hosting environments with different capabilities. |
| Prospective students, researchers, partners, press (visitors) | Not stakeholders of this document directly, but every architectural choice here ultimately serves making the site fast, correct, and trustworthy for them. |
