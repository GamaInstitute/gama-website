import { Resend } from 'resend'
import type { PagesFunction } from '@cloudflare/workers-types'
import { z } from 'zod'
import { verifyTurnstile } from '../_lib/turnstile'
import { renderWelcome, pickThumbnail, siteUrlFor, type Content } from '../_lib/newsletter'
import frWeekpaper from '../../src/i18n/locales/fr/weekpaper.json'
import enWeekpaper from '../../src/i18n/locales/en/weekpaper.json'
import frResearch  from '../../src/i18n/locales/fr/research.json'
import enResearch  from '../../src/i18n/locales/en/research.json'

interface Env {
  TURNSTILE_SECRET_KEY: string
  RESEND_API_KEY: string
  // Sender of newsletter emails, e.g. "Gama Institute <infolettre@news.gamainstitute.ca>";
  // falls back to CONTACT_EMAIL_FROM
  NEWSLETTER_FROM?: string
  CONTACT_EMAIL_FROM: string
  // Where replies go (the welcome email says "reply to unsubscribe"); falls back to EDITORIAL_EMAIL_TO
  NEWSLETTER_REPLY_TO?: string
  EDITORIAL_EMAIL_TO?: string
  // Site the email's links and images point to; by default the one that received the request
  // (see siteUrlFor in functions/_lib/newsletter.ts)
  SITE_URL?: string
}

const schema = z.object({
  email: z.string().email().max(254),
  turnstileToken: z.string().min(1),
})

const content: Content = {
  fr: { weekpaper: frWeekpaper, research: frResearch },
  en: { weekpaper: enWeekpaper, research: enResearch },
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// The welcome email is a single email, not a Broadcast, so it has no per-contact
// unsubscribe link: it asks people to reply instead (unsubscribe: 'reply').
async function sendWelcome(resend: Resend, env: Env, to: string, siteUrl: string) {
  const thumbnailUrl = await pickThumbnail(content.fr.weekpaper.featured.video_url)
  const email = renderWelcome(content, { siteUrl, thumbnailUrl, unsubscribe: 'reply', existing: false })
  const replyTo = env.NEWSLETTER_REPLY_TO || env.EDITORIAL_EMAIL_TO
  const { error } = await resend.emails.send({
    from: env.NEWSLETTER_FROM || env.CONTACT_EMAIL_FROM,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject: email.subject,
    html: email.html,
    text: email.text,
  })
  if (error) console.error('[newsletter] Welcome email not sent', error)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'validation_failed', details: parsed.error.flatten() }, 422)
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? ''
  const verified = await verifyTurnstile(parsed.data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
  if (!verified) {
    return json({ error: 'turnstile_failed' }, 403)
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const email = parsed.data.email

  // Every case answers the same `{ ok: true }`, so the form never reveals whether an
  // address is already on the list. Behind it:
  // - already subscribed: nothing to do, and no second welcome email;
  // - had unsubscribed: this form is a new, explicit request, so subscribe them again;
  // - unknown (or the lookup failed): create the contact, as before.
  const { data: existing } = await resend.contacts.get({ email })

  if (existing && !existing.unsubscribed) {
    return json({ ok: true })
  }

  const { error } = existing
    ? await resend.contacts.update({ email, unsubscribed: false })
    : await resend.contacts.create({ email })

  if (error) {
    console.error('[newsletter] Resend error', error)
    return json({ error: 'subscribe_failed' }, 500)
  }

  // After the response: a slow or failed welcome email never fails the signup
  waitUntil(sendWelcome(resend, env, email, siteUrlFor(request.url, env.SITE_URL)))

  return json({ ok: true })
}
