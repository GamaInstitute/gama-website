// Newsletter emails: the Thursday WeekPaper alert and the welcome email.
//
// Shared by the signup Function (welcome email, functions/api/newsletter.ts) and the
// GitHub Actions sender (scripts/newsletter.mjs), which runs this file directly with
// Node's TypeScript support. So: no imports, and only erasable TypeScript syntax
// (no enums, no namespaces). Content comes in as the parsed locale JSON.
//
// Emails are bilingual, French first then English (the subscriber's language isn't
// recorded). The markup is table-based with inline styles: mail clients ignore
// stylesheets, flexbox, CSS variables and positioning. See DECISIONS.md D-23.

export type Featured = {
  ep: string
  tag: string
  topic: string
  title: string
  body: string
  date_iso: string
  duration: string
  video_url: string
}
export type SummaryItem = {
  id: string
  no: string
  axis: string
  title: string
  description: string
  author: string
  date_iso: string
}
export type LocaleContent = {
  weekpaper: { featured: Featured }
  research: { items: SummaryItem[]; axes: Record<string, string> }
}
export type Content = { fr: LocaleContent; en: LocaleContent }

export type Unsubscribe =
  // Resend Broadcasts replace this placeholder with each contact's own link
  | 'broadcast'
  // Single emails (the welcome email) have no per-contact link: unsubscribe by replying
  | 'reply'

export type RenderedEmail = { name: string; subject: string; previewText: string; html: string; text: string }

type Lang = 'fr' | 'en'

const UNSUBSCRIBE_PLACEHOLDER = '{{{RESEND_UNSUBSCRIBE_URL}}}'

const C = {
  ink: '#0E2230', soft: '#3A4B57', muted: '#5A6B76', line: '#E2E2DC', band: '#F6F4EF',
  page: '#EEF0EE', copper: '#B56418', copperInk: '#8E4D11', teal: '#165C71',
}
const FONT_BODY = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const FONT_DISPLAY = "Sora, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"

// Same colours as TopicTag on the site (light theme), see D-21
const TOPIC: Record<string, [string, string, string]> = {
  ai:    ['#8E4D11', '#F7EFE7', '#E9CCB0'],
  se:    ['#6B5A0A', '#FBF4E9', '#F0D8B1'],
  cloud: ['#4A6537', '#F2F5EF', '#D6DFCC'],
  rai:   ['#1B6B69', '#EAF4F3', '#BCDBDA'],
  sec:   ['#165C71', '#ECF2F4', '#C1D4DA'],
}

const STR = {
  fr: {
    alsoNew: 'À lire aussi sur le site',
    watch: "Regarder l'épisode",
    present: ['Vous avez étudié un article récemment ?', 'Présentez-le sur WeekPaper : 20 à 30 minutes, en français, sur un des cinq axes de recherche de GAMA.', 'Soumettre une présentation'],
    by: 'Par',
    why: "Vous recevez ce courriel parce que vous vous êtes abonné·e à l'infolettre sur gamainstitute.ca.",
    unsub: 'Se désabonner',
    unsubReply: 'Pour vous désabonner, répondez simplement à ce courriel.',
    privacy: 'Politique de confidentialité',
    welcome: {
      subjectNew: 'Bienvenue dans la communauté GAMA',
      subjectOld: 'Votre infolettre GAMA commence cette semaine',
      h1New: 'Bienvenue dans la communauté GAMA',
      h1Old: 'Votre infolettre commence cette semaine',
      hello: 'Bonjour,',
      introNew: "Merci de vous être abonné·e. Gama Institute est un institut de recherche et de formation à la croisée du génie logiciel et de l'intelligence artificielle.",
      introOld: "Vous vous êtes inscrit·e à l'infolettre de Gama Institute sur notre site, et nous ne vous avions encore rien envoyé. Merci de votre patience : voici ce que vous recevrez désormais. Si ce n'est plus pour vous, un clic en bas de ce courriel suffit pour vous désabonner.",
      what: 'Ce que vous recevrez',
      items: [
        ['Chaque jeudi', ' : le nouvel épisode WeekPaper, un article de recherche décortiqué en vidéo.'],
        ['Dès leur parution', ' : les nouveaux Research Summaries, des résumés accessibles écrits par la relève.'],
        ['De temps en temps', ' : nos ateliers et les appels à contributions.'],
      ],
      start: 'Pour commencer',
      latest: 'Le dernier épisode',
      cta: 'Découvrir WeekPaper',
      sign: ['À jeudi,', "L'équipe Gama Institute"],
      kicker: 'Infolettre',
    },
  },
  en: {
    alsoNew: 'Also new on the site',
    watch: 'Watch the episode',
    present: ['Studied a paper recently?', "Present it on WeekPaper: 20 to 30 minutes, in French, on one of GAMA's five research areas.", 'Submit a presentation'],
    by: 'By',
    why: 'You are receiving this email because you subscribed to the newsletter on gamainstitute.ca.',
    unsub: 'Unsubscribe',
    unsubReply: 'To unsubscribe, simply reply to this email.',
    privacy: 'Privacy Policy',
    welcome: {
      subjectNew: 'Welcome to the GAMA community',
      subjectOld: 'Your GAMA newsletter starts this week',
      h1New: 'Welcome to the GAMA community',
      h1Old: 'Your newsletter starts this week',
      hello: 'Hello,',
      introNew: 'Thank you for subscribing. Gama Institute is a research and training institute at the intersection of software engineering and artificial intelligence.',
      introOld: "You signed up for the Gama Institute newsletter on our website, and we hadn't sent you anything yet. Thank you for your patience: here is what you will receive from now on. If it's no longer for you, one click at the bottom of this email unsubscribes you.",
      what: "What you'll receive",
      items: [
        ['Every Thursday', ': the new WeekPaper episode, one research paper broken down on video.'],
        ['As soon as they are published', ': new Research Summaries, accessible summaries written by early-career researchers.'],
        ['From time to time', ': our workshops and calls for contributions.'],
      ],
      start: 'Where to start',
      latest: 'The latest episode',
      cta: 'Explore WeekPaper',
      sign: ['See you Thursday,', 'The Gama Institute team'],
      kicker: 'Newsletter',
    },
  },
} as const

// ── Helpers ─────────────────────────────────────────────────────────

// Also keeps French "? ! : ;" on the same line as the word before them
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/ ([?!:;])/g, '&nbsp;$1')

const LOCALE: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' }

function longDate(iso: string, lang: Lang, weekday = false): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: weekday ? 'long' : undefined, day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)))
}

/** "29:04" → "29 min", "1:02:30" → "62 min" */
function minutes(duration: string): string {
  const parts = duration.split(':').map(Number)
  const mins = parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0]
  return `${mins} min`
}

/** "Épisode 7" → 7 */
export function episodeNumber(f: Featured): number {
  const n = Number(f.ep.match(/\d+/)?.[0])
  if (!n) throw new Error(`No episode number in "${f.ep}"`)
  return n
}

export function youtubeId(url: string): string {
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1]
  if (!id) throw new Error(`Not a YouTube URL: ${url}`)
  return id
}

/** The 1280×720 thumbnail when the video has one, else the 480×360 one every video has. */
export async function pickThumbnail(videoUrl: string): Promise<string> {
  const id = youtubeId(videoUrl)
  const hd = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  try {
    const res = await fetch(hd, { method: 'HEAD' })
    if (res.ok) return hd
  } catch (_) { /* fall back */ }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** The Research Summary to mention in an alert: one published in the 7 days up to the episode. */
export function recentSummary(c: Content, episodeIso: string): string | null {
  const latest = c.fr.research.items[0]
  if (!latest) return null
  const days = (Date.parse(episodeIso) - Date.parse(latest.date_iso)) / 86_400_000
  return days >= 0 && days < 7 ? latest.id : null
}

// ── Building blocks (table-based, inline styles) ─────────────────────

const p = (html: string, extra = '') =>
  `<p style="margin:0 0 16px;font-family:${FONT_BODY};font-size:16px;line-height:1.6;color:${C.soft};${extra}">${html}</p>`
const h1 = (text: string) =>
  `<h1 style="margin:0 0 14px;font-family:${FONT_DISPLAY};font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-0.3px;color:${C.ink};">${esc(text)}</h1>`
const h2 = (text: string) =>
  `<h2 style="margin:0 0 12px;font-family:${FONT_DISPLAY};font-size:18px;line-height:1.3;font-weight:600;color:${C.ink};">${esc(text)}</h2>`
const eyebrow = (text: string) =>
  `<p style="margin:0 0 10px;font-family:${FONT_BODY};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.copperInk};">${esc(text)}</p>`
const rule = () =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;height:24px;">&nbsp;</td></tr></table>`

function tag(topic: string, label: string): string {
  const [fg, bg, border] = TOPIC[topic] ?? TOPIC.sec
  return `<span style="display:inline-block;font-family:${FONT_BODY};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${fg};background:${bg};border:1px solid ${border};border-radius:999px;padding:3px 9px;">${esc(label)}</span>`
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 26px;"><tr>
<td style="border-radius:999px;background:${C.copper};"><a href="${esc(href)}" style="display:inline-block;padding:13px 24px;font-family:${FONT_BODY};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(label)} &rarr;</a></td>
</tr></table>`
}

function thumbnail(href: string, src: string, alt: string, duration: string): string {
  return `<a href="${esc(href)}" style="display:block;text-decoration:none;"><img src="${esc(src)}" width="536" alt="${esc(alt)}" style="display:block;width:100%;max-width:536px;height:auto;border:0;border-radius:6px;"></a>
<p style="margin:8px 0 18px;font-family:${FONT_BODY};font-size:13px;color:${C.muted};">&#9654;&nbsp; ${esc(duration)}</p>`
}

function summaryCard(item: SummaryItem, axes: Record<string, string>, lang: Lang, siteUrl: string): string {
  const href = `${siteUrl}/research-summaries/${item.id}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border:1px solid ${C.line};border-radius:6px;"><tr><td style="padding:16px 18px;">
<span style="display:inline-block;font-family:Menlo,Consolas,monospace;font-size:12px;font-weight:700;background:${C.ink};color:#F8F8F6;padding:2px 8px;border-radius:3px;">${esc(item.no)}</span>&nbsp; ${tag(item.axis, axes[item.axis] ?? item.axis)}
<p style="margin:10px 0 6px;font-family:${FONT_DISPLAY};font-size:16px;line-height:1.35;font-weight:600;"><a href="${esc(href)}" style="color:${C.ink};text-decoration:none;">${esc(item.title)}</a></p>
<p style="margin:0;font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${C.soft};">${esc(item.description)}</p>
<p style="margin:8px 0 0;font-family:${FONT_BODY};font-size:13px;color:${C.muted};">${STR[lang].by} ${esc(item.author)} · ${esc(longDate(item.date_iso, lang))}</p>
</td></tr></table>`
}

function presentBox(lang: Lang, siteUrl: string): string {
  const [title, body, link] = STR[lang].present
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:${C.band};border-radius:6px;"><tr><td style="padding:18px 20px;">
<p style="margin:0 0 6px;font-family:${FONT_DISPLAY};font-size:16px;font-weight:600;color:${C.ink};">${esc(title)}</p>
<p style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:1.55;color:${C.soft};">${esc(body)} <a href="${siteUrl}/week-paper#contribute" style="color:${C.teal};font-weight:600;">${esc(link)}&nbsp;&rarr;</a></p>
</td></tr></table>`
}

const section = (inner: string, lang: Lang) =>
  `<tr><td class="px" lang="${lang}" style="padding:28px 32px 4px;">${inner}</td></tr>`

function languageDivider(): string {
  return `<tr><td class="px" id="english" style="padding:10px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="border-top:3px double ${C.line};font-size:0;line-height:0;">&nbsp;</td>
<td style="width:1%;white-space:nowrap;padding:0 12px;font-family:${FONT_BODY};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">English version</td>
<td style="border-top:3px double ${C.line};font-size:0;line-height:0;">&nbsp;</td>
</tr></table></td></tr>`
}

function layout(o: { previewText: string; kicker: string; siteUrl: string; fr: string; en: string; unsubscribe: Unsubscribe }): string {
  const fr = STR.fr, en = STR.en
  const unsub = o.unsubscribe === 'broadcast'
    ? `<a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:${C.soft};">${fr.unsub} / ${en.unsub}</a> · `
    : `${fr.unsubReply}<br>${en.unsubReply}<br>`
  // Pads the inbox preview so mail clients don't pull body text after the preview text
  const spacer = '&#847;&zwnj;&nbsp;'.repeat(60)
  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>Gama Institute</title>
<style>
  @media (max-width: 620px) { .px { padding-left: 20px !important; padding-right: 20px !important; } .h-kicker { display: none !important; } }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(o.previewText)}${spacer}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};"><tr><td align="center" style="padding:24px 10px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:4px;">
<tr><td style="height:5px;font-size:0;line-height:0;background:${C.teal};background-image:linear-gradient(90deg,#B56418,#D8942A 30%,#8EA57A 55%,#2A8C8A 78%,#165C71);border-radius:4px 4px 0 0;">&nbsp;</td></tr>
<tr><td class="px" style="padding:22px 32px 18px;border-bottom:1px solid ${C.line};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><a href="${o.siteUrl}" style="text-decoration:none;"><img src="${o.siteUrl}/email/logo.png" width="34" height="34" alt="" style="vertical-align:middle;border:0;">&nbsp;&nbsp;<span style="vertical-align:middle;font-family:${FONT_DISPLAY};font-size:14px;font-weight:700;letter-spacing:2.5px;color:${C.ink};">GAMA INSTITUTE</span></a></td>
<td class="h-kicker" align="right" style="font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${esc(o.kicker)}</td>
</tr></table></td></tr>
<tr><td class="px" align="right" style="padding:10px 32px 0;font-family:${FONT_BODY};font-size:13px;font-weight:600;"><a href="#english" style="color:${C.teal};text-decoration:none;">English version below &darr;</a></td></tr>
${section(o.fr, 'fr')}
${languageDivider()}
${section(o.en, 'en')}
<tr><td class="px" style="padding:22px 32px 26px;background:${C.band};border-radius:0 0 4px 4px;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${C.muted};">
<p style="margin:0 0 10px;font-weight:600;"><a href="https://www.youtube.com/@gamainstitut" style="color:${C.soft};">YouTube</a> &nbsp; <a href="https://www.linkedin.com/company/gamainstitute" style="color:${C.soft};">LinkedIn</a> &nbsp; <a href="${o.siteUrl}" style="color:${C.soft};">gamainstitute.ca</a></p>
<p style="margin:0 0 8px;">${esc(fr.why)}<br><span lang="en">${esc(en.why)}</span></p>
<p style="margin:0 0 8px;">${unsub}<a href="${o.siteUrl}/privacy" style="color:${C.soft};">${fr.privacy} / ${en.privacy}</a></p>
<p style="margin:0;">Gama Institute</p>
</td></tr>
</table></td></tr></table>
</body></html>`
}

// ── Thursday WeekPaper alert ─────────────────────────────────────────

export function renderWeekpaperAlert(c: Content, o: { siteUrl: string; thumbnailUrl: string; unsubscribe: Unsubscribe }): RenderedEmail {
  const frF = c.fr.weekpaper.featured
  const n = episodeNumber(frF)
  const nn = String(n).padStart(2, '0')
  const summaryId = recentSummary(c, frF.date_iso)

  const half = (lang: Lang, second: boolean) => {
    const f = c[lang].weekpaper.featured, s = STR[lang]
    const rs = summaryId ? c[lang].research.items.find(it => it.id === summaryId) : undefined
    return eyebrow(`WeekPaper · ${f.ep}`)
      + h1(f.title)
      + `<p style="margin:0 0 14px;">${tag(f.topic, f.tag)} <span style="font-family:${FONT_BODY};font-size:14px;color:${C.muted};">&nbsp;${minutes(f.duration)}</span></p>`
      // The English half doesn't repeat the thumbnail: same video, shorter email
      + (second ? '' : thumbnail(f.video_url, o.thumbnailUrl, f.title, f.duration))
      + p(esc(f.body))
      + button(f.video_url, s.watch)
      + (rs ? rule() + h2(s.alsoNew) + summaryCard(rs, c[lang].research.axes, lang, o.siteUrl) : rule())
      + presentBox(lang, o.siteUrl)
  }

  const subject = `WeekPaper #${nn} · ${frF.title}`
  const previewText = `${minutes(frF.duration)} · English version below. ${c.en.weekpaper.featured.title}`
  const html = layout({
    previewText, kicker: longDate(frF.date_iso, 'fr', true), siteUrl: o.siteUrl,
    fr: half('fr', false), en: half('en', true), unsubscribe: o.unsubscribe,
  })

  const textHalf = (lang: Lang) => {
    const f = c[lang].weekpaper.featured
    return `WeekPaper · ${f.ep} · ${f.tag} · ${minutes(f.duration)}\n\n${f.title}\n\n${f.body}\n\n${STR[lang].watch}: ${f.video_url}`
  }
  const text = `${textHalf('fr')}\n\n----- English version -----\n\n${textHalf('en')}\n\n--\n${STR.fr.why}\n${STR.en.why}\n${
    o.unsubscribe === 'broadcast' ? `${STR.fr.unsub} / ${STR.en.unsub}: ${UNSUBSCRIBE_PLACEHOLDER}` : `${STR.fr.unsubReply}\n${STR.en.unsubReply}`}\nGama Institute`

  return { name: `weekpaper-ep-${nn}`, subject, previewText, html, text }
}

// ── Welcome email ────────────────────────────────────────────────────

/** `existing`: the one-time email to people who signed up before any newsletter went out. */
export function renderWelcome(c: Content, o: { siteUrl: string; thumbnailUrl: string; unsubscribe: Unsubscribe; existing: boolean }): RenderedEmail {
  const half = (lang: Lang, second: boolean) => {
    const w = STR[lang].welcome, f = c[lang].weekpaper.featured, rs = c[lang].research.items[0]
    return h1(o.existing ? w.h1Old : w.h1New)
      + p(w.hello)
      + p(esc(o.existing ? w.introOld : w.introNew))
      + h2(w.what)
      + w.items.map(([b, rest]) => p(`<b style="color:${C.ink};">${esc(b)}</b>${esc(rest)}`, 'margin-bottom:10px;')).join('')
      + '<div style="height:8px;line-height:8px;font-size:0;">&nbsp;</div>' + rule()
      + h2(w.start)
      + eyebrow(`${w.latest} · ${f.ep}`)
      + (second ? '' : thumbnail(f.video_url, o.thumbnailUrl, f.title, f.duration))
      + `<p style="margin:0 0 18px;font-family:${FONT_DISPLAY};font-size:17px;line-height:1.35;font-weight:600;"><a href="${esc(f.video_url)}" style="color:${C.ink};text-decoration:none;">${esc(f.title)}</a></p>`
      + (rs ? summaryCard(rs, c[lang].research.axes, lang, o.siteUrl) : '')
      + button(`${o.siteUrl}/week-paper`, w.cta)
      + p(`${esc(w.sign[0])}<br>${esc(w.sign[1])}`, 'margin-bottom:26px;')
  }

  const fr = STR.fr.welcome
  const subject = o.existing ? fr.subjectOld : fr.subjectNew
  const previewText = o.existing
    ? 'Ce que vous recevrez désormais · English version below.'
    : 'Chaque jeudi, un article décortiqué en vidéo · English version below.'
  const html = layout({
    previewText, kicker: fr.kicker, siteUrl: o.siteUrl,
    fr: half('fr', false), en: half('en', true), unsubscribe: o.unsubscribe,
  })

  const textHalf = (lang: Lang) => {
    const w = STR[lang].welcome
    return [w.hello, o.existing ? w.introOld : w.introNew, '', w.what, ...w.items.map(([b, r]) => `- ${b}${r}`), '', `${w.cta}: ${o.siteUrl}/week-paper`, '', ...w.sign].join('\n')
  }
  const text = `${textHalf('fr')}\n\n----- English version -----\n\n${textHalf('en')}\n\n--\n${
    o.unsubscribe === 'broadcast' ? `${STR.fr.unsub} / ${STR.en.unsub}: ${UNSUBSCRIBE_PLACEHOLDER}` : `${STR.fr.unsubReply}\n${STR.en.unsubReply}`}\nGama Institute`

  return { name: o.existing ? 'welcome-existing-subscribers' : 'welcome', subject, previewText, html, text }
}
