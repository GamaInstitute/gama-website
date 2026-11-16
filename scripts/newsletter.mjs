// Sends newsletter emails as Resend Broadcasts to the newsletter audience.
//
//   node scripts/newsletter.mjs alert             Thursday WeekPaper alert for the featured episode
//   node scripts/newsletter.mjs welcome-existing  one-time email to people who signed up before any newsletter
//
// Options:
//   --dry-run              render only: writes <name>.html/.txt to ./newsletter-out, sends nothing
//   --test=<email>         send one copy to that address now (subject prefixed [TEST]), no Broadcast
//   --force                alert: send even if the featured episode is more than 3 days old
//   --skip-if-unconfigured exit quietly when the Resend secrets aren't set (used by the deploy job)
//   --env=production|staging  site the links and images point to (default production); staging
//                          only with --test or --dry-run, subscribers always get production links
//
// Env: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_FROM ("Gama Institute <infolettre@…>"),
//      optional NEWSLETTER_REPLY_TO, SITE_URL (overrides --env),
//      SEND_AT (Resend schedule, default "in 1 hour" for alerts, "in 10 minutes" otherwise).
//
// Safe to re-run: each Broadcast is named after its content (weekpaper-ep-07,
// welcome-existing-subscribers) and is never created twice. See DECISIONS.md D-23.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resend } from 'resend'
import { renderWeekpaperAlert, renderWelcome, pickThumbnail, SITE_URLS } from '../functions/_lib/newsletter.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MAX_EPISODE_AGE_DAYS = 3

const args = process.argv.slice(2)
const command = args.find(a => !a.startsWith('--'))
const flag = name => args.some(a => a === `--${name}`)
const option = name => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')

const env = process.env
const testTo = option('test')
const dryRun = flag('dry-run')
// Environment the email's links and images point to: production (default) or staging
const siteEnv = option('env') || 'production'
if (!(siteEnv in SITE_URLS)) fail(`--env must be one of: ${Object.keys(SITE_URLS).join(', ')}`)
const SITE_URL = (env.SITE_URL || SITE_URLS[siteEnv]).replace(/\/$/, '')
// Subscribers only ever get production links: staging is for test emails and dry runs
if (SITE_URL !== SITE_URLS.production && !testTo && !dryRun) {
  fail(`A send to subscribers must use production links (got ${SITE_URL}). Use --test=<email> or --dry-run to try another environment.`)
}
console.log(`• Links and images: ${SITE_URL}`)

function fail(msg) { console.error(`✗ ${msg}`); process.exit(1) }
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) }

const content = Object.fromEntries(['fr', 'en'].map(lang => [lang, {
  weekpaper: readJson(`src/i18n/locales/${lang}/weekpaper.json`),
  research:  readJson(`src/i18n/locales/${lang}/research.json`),
}]))

if (!['alert', 'welcome-existing'].includes(command)) fail('Usage: node scripts/newsletter.mjs <alert|welcome-existing> [--dry-run] [--test=<email>] [--force]')

// ── Render ──────────────────────────────────────────────────────────
const featured = content.fr.weekpaper.featured
const thumbnailUrl = await pickThumbnail(featured.video_url)
const unsubscribe = 'broadcast'
let email
if (command === 'alert') {
  const ageDays = (Date.now() - Date.parse(`${featured.date_iso}T00:00:00Z`)) / 86_400_000
  if (!flag('force') && !dryRun && !testTo && (ageDays > MAX_EPISODE_AGE_DAYS || ageDays < -1)) {
    console.log(`• Featured episode (${featured.ep}, ${featured.date_iso}) isn't new: ${ageDays.toFixed(1)} days old. No alert sent (use --force to override).`)
    process.exit(0)
  }
  email = renderWeekpaperAlert(content, { siteUrl: SITE_URL, thumbnailUrl, unsubscribe })
} else {
  email = renderWelcome(content, { siteUrl: SITE_URL, thumbnailUrl, unsubscribe, existing: true })
}
console.log(`• ${email.name}: "${email.subject}"`)

// The images are loaded from the live site and YouTube when the email is opened. Check they
// exist before sending: e.g. public/email/logo.png only exists once the release that added
// it is deployed. A real send refuses; a test or dry run only warns.
const images = [`${SITE_URL}/email/logo.png`, thumbnailUrl]
const missingImages = []
for (const url of images) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('image/')) missingImages.push(`${url} (${res.status})`)
  } catch (e) { missingImages.push(`${url} (${e.message})`) }
}
if (missingImages.length) {
  const msg = `Image(s) not reachable, they would show as broken in the email:\n  ${missingImages.join('\n  ')}`
  if (dryRun || testTo) console.warn(`! ${msg}`)
  else fail(`${msg}\nDeploy the site first (or set SITE_URL), then send again.`)
}

if (dryRun) {
  const out = path.join(ROOT, 'newsletter-out')
  fs.mkdirSync(out, { recursive: true })
  fs.writeFileSync(path.join(out, `${email.name}.html`), email.html)
  fs.writeFileSync(path.join(out, `${email.name}.txt`), email.text)
  console.log(`✓ Dry run: wrote newsletter-out/${email.name}.html and .txt. Nothing sent.`)
  process.exit(0)
}

// ── Send ────────────────────────────────────────────────────────────
const missing = ['RESEND_API_KEY', 'NEWSLETTER_FROM', ...(testTo ? [] : ['RESEND_AUDIENCE_ID'])].filter(k => !env[k])
if (missing.length) {
  if (flag('skip-if-unconfigured')) { console.log(`• Newsletter not configured (missing ${missing.join(', ')}). Skipping.`); process.exit(0) }
  fail(`Missing environment variables: ${missing.join(', ')}`)
}
const resend = new Resend(env.RESEND_API_KEY)
const replyTo = env.NEWSLETTER_REPLY_TO || undefined

if (testTo) {
  // A plain email has no per-contact unsubscribe link: point it at the site instead
  const unsub = `${SITE_URL}/#newsletter-test-unsubscribe`
  const { data, error } = await resend.emails.send({
    from: env.NEWSLETTER_FROM, to: testTo, replyTo,
    subject: `[TEST] ${email.subject}`,
    html: email.html.replaceAll('{{{RESEND_UNSUBSCRIBE_URL}}}', unsub),
    text: email.text.replaceAll('{{{RESEND_UNSUBSCRIBE_URL}}}', unsub),
  })
  if (error) fail(`Resend refused the test email: ${error.message ?? JSON.stringify(error)}`)
  console.log(`✓ Test sent to ${testTo} (${data.id}). No Broadcast created.`)
  process.exit(0)
}

// Never create the same Broadcast twice
async function findBroadcast(name) {
  let after
  for (;;) {
    const { data, error } = await resend.broadcasts.list({ limit: 100, ...(after ? { after } : {}) })
    if (error) fail(`Could not list Broadcasts: ${error.message ?? JSON.stringify(error)}`)
    const hit = data.data.find(b => b.name === name)
    if (hit) return hit
    if (!data.has_more || data.data.length === 0) return null
    after = data.data[data.data.length - 1].id
  }
}
const existing = await findBroadcast(email.name)
if (existing) {
  console.log(`• Broadcast "${email.name}" already exists (${existing.status}, ${existing.id}). Nothing sent.`)
  process.exit(0)
}

const scheduledAt = env.SEND_AT || (command === 'alert' ? 'in 1 hour' : 'in 10 minutes')
const payload = {
  name: email.name, from: env.NEWSLETTER_FROM, replyTo,
  subject: email.subject, html: email.html, text: email.text,
  send: true, scheduledAt,
}
// Resend renamed audiences to segments; accept either kind of ID
let { data, error } = await resend.broadcasts.create({ ...payload, segmentId: env.RESEND_AUDIENCE_ID })
if (error && /segment/i.test(error.message ?? '')) {
  ;({ data, error } = await resend.broadcasts.create({ ...payload, audienceId: env.RESEND_AUDIENCE_ID }))
}
if (error) fail(`Resend refused the Broadcast: ${error.message ?? JSON.stringify(error)}`)
console.log(`✓ Broadcast "${email.name}" scheduled ${scheduledAt} (${data.id}).`)
console.log(`  To cancel before it goes out: https://resend.com/broadcasts/${data.id}`)
