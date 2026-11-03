import { Resend } from 'resend'
import type { PagesFunction } from '@cloudflare/workers-types'
import {
  researchSummarySchema,
  isAllowedSummaryFile,
  isAllowedPhotoFile,
  SUMMARY_FILE,
  PHOTO_FILE,
} from '../../src/types/researchSummary'
import { verifyTurnstile } from '../_lib/turnstile'
import { esc, json, textField, filePart, toAttachment, row, link, mailto, emailLayout } from '../_lib/email'

interface Env {
  TURNSTILE_SECRET_KEY: string
  CONTACT_EMAIL_TO: string
  CONTACT_EMAIL_FROM: string
  RESEND_API_KEY: string
}

// Both files at their max plus the text fields and multipart overhead
const MAX_BODY_BYTES = SUMMARY_FILE.maxBytes + PHOTO_FILE.maxBytes + 64 * 1024

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const length = Number(request.headers.get('Content-Length') ?? 0)
  if (length > MAX_BODY_BYTES) {
    return json({ error: 'too_large' }, 413)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'invalid_form' }, 400)
  }

  const parsed = researchSummarySchema.safeParse({
    name:        textField(form, 'name'),
    email:       textField(form, 'email'),
    institution: textField(form, 'institution'),
    linkedin:    textField(form, 'linkedin'),
    bio:         textField(form, 'bio'),
    paperTitle:  textField(form, 'paperTitle'),
    paperUrl:    textField(form, 'paperUrl'),
    consent:     textField(form, 'consent'),
  })
  if (!parsed.success) {
    return json({ error: 'validation_failed', details: parsed.error.flatten() }, 422)
  }

  const summary = filePart(form, 'summary')
  if (!summary) {
    return json({ error: 'summary_missing' }, 422)
  }
  if (!isAllowedSummaryFile(summary) || summary.size > SUMMARY_FILE.maxBytes) {
    return json({ error: 'summary_invalid' }, 422)
  }

  const photo = filePart(form, 'photo')
  if (photo && (!isAllowedPhotoFile(photo) || photo.size > PHOTO_FILE.maxBytes)) {
    return json({ error: 'photo_invalid' }, 422)
  }

  const token = textField(form, 'turnstileToken')
  if (!token) {
    return json({ error: 'turnstile_failed' }, 403)
  }
  const ip = request.headers.get('CF-Connecting-IP') ?? ''
  const verified = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip)
  if (!verified) {
    return json({ error: 'turnstile_failed' }, 403)
  }

  const attachments = [await toAttachment(summary)]
  if (photo) attachments.push(await toAttachment(photo))

  const d = parsed.data
  const rows = [
    row('Contributeur', `${esc(d.name)}<br>${mailto(d.email)}`),
    row('Établissement', esc(d.institution)),
    row('LinkedIn', link(d.linkedin)),
    row('Biographie', esc(d.bio)),
    row('Papier original', esc(d.paperTitle)),
    row('Lien du papier', link(d.paperUrl)),
    row('Pièces jointes', attachments.map(a => esc(a.filename)).join('<br>')),
    row('Consentement', `Conditions et publication acceptées le ${new Date().toISOString()}`),
  ].join('')

  const resend = new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: env.CONTACT_EMAIL_FROM,
    to: [env.CONTACT_EMAIL_TO],
    replyTo: d.email,
    subject: `[Gama Institute] Research Summary | ${d.name} | ${d.paperTitle}`.slice(0, 200),
    html: emailLayout('Nouveau Research Summary soumis', rows, d.name),
    attachments,
  })

  if (error) {
    console.error('[research-summary] Resend error', error)
    return json({ error: 'email_failed' }, 500)
  }

  return json({ ok: true })
}
