# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/).

## [Unreleased]

### Security

- Newsletter signup (`POST /api/newsletter`) now requires a verified Cloudflare Turnstile token, same invisible bot check already used on the contact form — previously open to unauthenticated scripted signups
- Bumped `postcss` to patch an arbitrary `.map` file disclosure vulnerability (GHSA-r28c-9q8g-f849)

### Changed

- WeekPaper featured episode now plays the real Episode 1 video (`youtu.be/lFz45XSy_dk`, 23:31) instead of a placeholder loop. It no longer autoplays (click-to-play thumbnail), and the "Watch the episode" button now opens the video on YouTube instead of going nowhere
- Homepage "News & events" Research card now links to the published Empirical Software Engineering article (Springer, `doi.org/10.1007/s10664-025-10656-8`) instead of the arXiv preprint, and its date line now reads "EMSE Journal · April 2025" to show the venue
- Home page "Notre vision" video updated to the real vision video (`youtu.be/4ZHByQvt1Uk`) and no longer autoplays — shows the YouTube thumbnail with a click-to-play button instead
- Home page "Notre vision" intro copy updated to "Découvrez la vision qui guide GAMA Institute" / "Discover the vision that guides GAMA Institute"
- Contact email updated to `contact@gamainstitute.ca` (displayed on the Contact page and used as the contact-form recipient)
- About page "Strategic pillars" cards now show a category icon (flask, school, rocket, people — Iconify `mdi` set, brand-colored) instead of a plain gradient bar
- Team page "Équipe de direction" section now lists both real current team members (Patrick Loic Foalem as Founder and Principal Research Scientist, Foutse Khomh) in place of the placeholder roster. Photos are committed to `public/team/` per [D-13](DECISIONS.md), replacing the temporary hotlinks to their public academic/GitHub profiles
- `MemberCard` redesigned: larger circular centered photo (bio text removed to give it the room), role/title now shown above the name, and an optional LinkedIn badge pinned to the card's top-right corner when a member's `linkedin` URL is set
- Team page "Researchers" and "The people who move the work forward" (contributors) sections hidden pending real people to list — current entries were placeholder data
- Homepage "News & events" cards now show real content: the Research card links to Patrick Foalem's published paper on logging for responsible-ML auditing, and the Workshop card describes a session on how to read a research paper. Cards now show a brand-colored category icon over the gradient placeholder instead of a plain "image · category" label
- WeekPaper's newsletter modal now shows the same "Every month, receive: ..." perks list as the homepage newsletter section (new shared `NewsletterPerks` component), instead of WeekPaper-specific copy that implied a narrower episode-only alert — there's one shared subscriber list, not per-page segments, so the copy now matches
- WeekPaper featured episode updated to Episode 1 ("Vers une nouvelle vision du génie logiciel" / "Toward a new vision for software engineering"), replacing the placeholder Episode 24 content; no video is linked yet, so the player shows its gradient placeholder pending the actual recording
- Home page "Notre vision" video and WeekPaper's featured episode video both now play a "Coming soon" placeholder video (youtube.com/watch?v=Y-x0efG1seA) instead of the previous placeholder content, until each real video is ready
- `VideoPlayer` gained an `autoplay` prop (muted, looped, skips the click-to-start thumbnail) used by both placeholder videos above; YouTube's native controls stay visible so playback can still be paused, per WCAG 2.2.2
- All `VideoPlayer` embeds now pass `modestbranding=1&rel=0` to reduce YouTube's own branding and related-video suggestions

### Added

- New `Modal` UI primitive (`src/components/ui/Modal.tsx`) — portal-rendered, focus-trapped, closes on Esc or backdrop click, respects reduced-motion. WeekPaper page's "Email alert" button now opens the newsletter signup form in this modal instead of linking out to the generic Contact page
- Newsletter signups (`POST /api/newsletter`) now register the subscriber as a Resend Contact instead of being discarded — no separate CRM added, reuses the same Resend account as the contact form (see [D-3](DECISIONS.md))
- Team member photos: `team.json` (fr/en) carries a per-member `photo` URL field (Google Drive-hosted in production), rendered via the new `Avatar` component; falls back to a generated initials avatar on a solid accent background when no photo is set. Currently populated with `randomuser.me` stock placeholder headshots pending real photos
- Contact form now sends email via Resend (`POST /api/contact`) — requires `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, and `CONTACT_EMAIL_FROM` in Cloudflare Pages env vars
- Favicon: SVG + PNG + Apple Touch Icon (`logo-icon.svg` / `logo-icon.png`)
- Five-page website: Home, About, WeekPaper, Team, Contact (Training page is built but held back for a later release)
- Bilingual support (French / English) with client-side language toggle via react-i18next; persisted in `localStorage`
- Dark mode with system-preference detection and manual toggle; persisted in `localStorage`
- Animated NetworkArt hero graphic — 15-node knowledge network with copper-to-teal gradient, Framer Motion entrance, reduced-motion fallback
- BrandMark SVG logo icon using the full 15-node network; Footer uses the STACKED brand variant
- Contact form with Cloudflare Turnstile invisible bot protection and Zod validation (`POST /api/contact`)
- Newsletter subscription stub endpoint (`POST /api/newsletter`)
- GitHub Actions workflows: staging (develop → GitHub Pages) and production (main → Cloudflare Pages)
- Keyboard-accessible skip-to-content link and reduced-motion support throughout

### Removed

- Homepage "Featured papers" cards (under the Research section) hidden pending a dedicated Research page, which will carry this content instead
- Homepage "Toutes les actualités" / "All news" link (News & events section) hidden — no news/archive page exists yet to point it to
- Team page "Conseil consultatif" / "Advisory board" section hidden — Foutse Khomh moved to the Leadership section alongside Patrick Foalem; `advisory.members` is now an empty array pending real advisory board members
- WeekPaper page "Épisodes récents" / "Recent episodes" section (browsable episode grid + topic filters) hidden pending real episodes — `episodes.items` in `weekpaper.json` was placeholder data

### Fixed

- `VideoPlayer` thumbnails were blurry — the component requested YouTube's `hqdefault.jpg` (480×360, 4:3) and stretched it to fill the 16:9 card. Now requests `maxresdefault.jpg` (1280×720) first, falling back to `hqdefault.jpg` if a given video has no maxres thumbnail
- Several images and videos were blocked on the deployed site by the CSP, which was missing their host domains: YouTube video thumbnails and playback (Home "Notre vision" section, WeekPaper episodes) needed `img.youtube.com`/`i.ytimg.com` in `img-src` and `www.youtube.com` in `frame-src`; About page pillar icons needed `api.iconify.design`; Team page photos for Patrick Loic Foalem and Foutse Khomh needed `avatars.githubusercontent.com` and `swat.polymtl.ca` in `img-src`
- Homepage news/events cards, featured papers, metrics bar, and WeekPaper playlists could vanish (opacity stuck at 0) after switching language, since translated card titles were used as React keys, which forced Framer Motion's scroll-triggered reveal to remount cards after their one-time `viewport={{ once: true }}` animation had already fired. Cards are now keyed by array index instead
- `VideoPlayer`'s play button icon was invisible on its white circle background — the SVG used `fill="var(--ink)"` as a presentation attribute, which didn't resolve; now hardcoded to the same dark ink color used elsewhere in the component
