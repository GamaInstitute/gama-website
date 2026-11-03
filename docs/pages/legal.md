# Privacy Policy, Terms of Use and Open Access Policy

_Last verified: 2026-11-02_

- **Routes:** `/privacy`, `/terms`, `/open-access`
- **Files:** [src/pages/PrivacyPage.tsx](../../src/pages/PrivacyPage.tsx), [src/pages/TermsPage.tsx](../../src/pages/TermsPage.tsx), [src/pages/OpenAccessPage.tsx](../../src/pages/OpenAccessPage.tsx), all thin wrappers around [src/components/legal/LegalDocument.tsx](../../src/components/legal/LegalDocument.tsx)
- **i18n namespace:** `legal` → [src/i18n/locales/{fr,en}/legal.json](../../src/i18n/locales/fr/legal.json). **Registered lazily**, see below.
- **Linked from:** the footer's bottom bar, and every form through `PrivacyNotice` / `ConsentCheckbox` (see [README.md](README.md#forms-and-legal-notices)).

> **Status: drafted by the dev team, not reviewed by a lawyer.** The texts are written for Quebec's Law 25, PIPEDA and CASL (newsletter consent), based on what the site actually does as of the date above. Have them reviewed before relying on them. The open points are listed at the end of this file.

## How the page renders

`LegalDocument` takes `doc="privacy" | "terms" | "openaccess"` and reads `legal:<doc>`:

| Key | Use |
|---|---|
| `meta.title`, `meta.description` | `<title>` / meta description |
| `eyebrow`, `title`, `updated_iso` | Header. The date is formatted per language. **Bump `updated_iso` in both files whenever the text changes.** |
| `intro[]` | Opening paragraphs |
| `sections[]` | `{ id, h, p?, list?, p_after? }`. `id` is the anchor (`/privacy#droits`), the table of contents is built from `h` |

Strings support two bits of inline markup, rendered by `Inline` in `LegalDocument.tsx`: `**bold**` and `[label](href)`. An `href` can be `#anchor`, `/internal-route` (rendered as a router `Link`), `mailto:…`, or an external `https://…` link (opens in a new tab). No other markup is supported.

## Why the namespace is lazy

[src/i18n/index.ts](../../src/i18n/index.ts) bundles every namespace into the main eager chunk. The legal texts are long and only needed on these pages, so `LegalDocument.tsx` calls `i18n.addResourceBundle(…, 'legal', …)` when its module loads, inside the lazily loaded page chunk. Don't move `legal` into `src/i18n/index.ts`. See [D-16](../../DECISIONS.md).

## Keeping the policy true

The Privacy Policy describes concrete behaviour. If you change any of these, update `legal.json` (both languages) and `updated_iso` in the same change:

- **A new form, or new fields on one** → section `renseignements` (what is collected) and `conservation`.
- **A new third-party service** (analytics, a new email provider, a new embed or image host) → section `prestataires`, and the CSP in `public/_headers`. The policy currently says the site uses **no analytics**. If Cloudflare Web Analytics or anything similar is switched on in the dashboard, the policy becomes false.
- **New `localStorage` keys or cookies** → section `temoins`.
- **YouTube embeds** use `youtube-nocookie.com` (privacy-enhanced mode), which the policy promises. Keep it that way in `VideoPlayer.tsx`.

## The Open Access Policy

Modelled on the [Montreal AI Ethics Institute's open access policy](https://montrealethics.ai/our-open-access-policy/). Original content, published Research Summaries, WeekPaper episodes and the downloadable guides and templates (`DOWNLOADS` in `src/constants/index.ts`) are **CC BY 4.0**, unless otherwise noted. Why CC BY rather than a non-commercial licence: [D-17](../../DECISIONS.md).

Three other places must stay consistent with it. Change them together:

- **Terms of Use**, sections `propriete` (what is licensed and the brand/photo exclusions) and `contributions` (contributors agree to CC BY publication; removal from our platforms does not revoke copies already made).
- **Consent boxes**: `research:form.consent` and `weekpaper:submit.consent` both mention CC BY 4.0 and link the policy with an `<openaccess>` tag. A contributor's consent is what makes it lawful to publish their work under CC BY, so don't drop it from the wording.
- **Exclusions** in the policy's `exceptions` section: if a new kind of content appears (e.g. paid course material, third-party guest content), decide whether it is covered and say so there, or mark the item itself with its own licence.

## Open points before treating these as final

1. **Legal review** of both texts.
2. **Person in charge of personal information** (Law 25). The policy gives the role and `contact@gamainstitute.ca`. By default the law assigns this role to the organization's highest-ranking person. Confirm who it is, and consider naming them.
3. **Retention periods** (2 years for contact messages, 12 months for declined submissions) are proposed defaults. Confirm they match how the team actually handles its inbox, and actually delete on that schedule.
4. **Privacy impact assessment for transfers outside Quebec.** Law 25 expects one before sending personal information outside Quebec (Cloudflare, Resend and the email provider are US-based). The policy discloses the transfer but does not claim an assessment was done.
5. **Newsletter unsubscribe.** CASL requires a working unsubscribe link in every newsletter email. Make sure the sending template includes one (Resend broadcasts support it).
6. **Legal entity name** (and registration number, if incorporated), if you want it shown in the Terms.
7. **CC BY 4.0 is irrevocable for what is already published.** Confirm the Institute wants commercial reuse allowed (MAIEI's choice) before the policy goes live. If not, switch to CC BY-NC 4.0 in the policy, Terms and consent texts in one change, before any contribution is published.
8. **Licence notice on content.** The policy says "unless otherwise noted". Consider a short CC BY line on each published summary and in WeekPaper video descriptions, so the licence travels with the content.
