import { Resend } from 'resend'
import type { PagesFunction } from '@cloudflare/workers-types'
import {
  weekpaperSubmissionSchema,
  isAllowedSlidesFile,
  isAllowedPhotoFile,
  SLIDES_FILE,
  PHOTO_FILE,
} from '../../src/types/weekpaperSubmission'
import { verifyTurnstile } from '../_lib/turnstile'
import { esc, json, textField, filePart, toAttachment, row, link, mailto, emailLayout } from '../_lib/email'

interface Env {
  TURNSTILE_SECRET_KEY: string
  CONTACT_EMAIL_TO: string
  // Editorial inbox for submissions (editoriale@gamainstitute.ca); falls back to CONTACT_EMAIL_TO if unset
  EDITORIAL_EMAIL_TO?: string
  CONTACT_EMAIL_FROM: string
  RESEND_API_KEY: string
}

const MAX_BODY_BYTES = SLIDES_FILE.maxBytes + PHOTO_FILE.maxBytes + 64 * 1024

const PUBLISH_LABEL: Record<string, string> = {
  'yt-li': 'YouTube et LinkedIn',
  'yt':    'YouTube seulement',
}

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

  const parsed = weekpaperSubmissionSchema.safeParse({
    name:          textField(form, 'name'),
    email:         textField(form, 'email'),
    institution:   textField(form, 'institution'),
    linkedin:      textField(form, 'linkedin'),
    bio:           textField(form, 'bio'),
    paperTitle:    textField(form, 'paperTitle'),
    paperAuthors:  textField(form, 'paperAuthors'),
    paperUrl:      textField(form, 'paperUrl'),
    videoUrl:      textField(form, 'videoUrl'),
    ytTitle:       textField(form, 'ytTitle'),
    ytDescription: textField(form, 'ytDescription'),
    publish:       textField(form, 'publish'),
    aiDisclosure:  textField(form, 'aiDisclosure'),
    consent:       textField(form, 'consent'),
  })
  if (!parsed.success) {
    return json({ error: 'validation_failed', details: parsed.error.flatten() }, 422)
  }

  const slides = filePart(form, 'slides')
  if (!slides) {
    return json({ error: 'slides_missing' }, 422)
  }
  if (!isAllowedSlidesFile(slides) || slides.size > SLIDES_FILE.maxBytes) {
    return json({ error: 'slides_invalid' }, 422)
  }

  const photo = filePart(form, 'photo')
  if (!photo) {
    return json({ error: 'photo_missing' }, 422)
  }
  if (!isAllowedPhotoFile(photo) || photo.size > PHOTO_FILE.maxBytes) {
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

  const attachments = [await toAttachment(slides), await toAttachment(photo)]

  const d = parsed.data
  const rows = [
    row('Présentateur', `${esc(d.name)}<br>${mailto(d.email)}`),
    row('Établissement', esc(d.institution)),
    row('LinkedIn', link(d.linkedin)),
    row('Biographie', esc(d.bio)),
    row('Article', esc(d.paperTitle)),
    row('Auteurs', esc(d.paperAuthors)),
    row("Lien de l'article", link(d.paperUrl)),
    row('Vidéo', link(d.videoUrl)),
    row('Titre YouTube', esc(d.ytTitle)),
    row('Description YouTube', esc(d.ytDescription)),
    row('Publication', esc(PUBLISH_LABEL[d.publish] ?? d.publish)),
    row('Déclaration IA', esc(d.aiDisclosure)),
    row('Pièces jointes', attachments.map(a => esc(a.filename)).join('<br>')),
    row('Consentement', `Conditions et publication acceptées le ${new Date().toISOString()}`),
  ].join('')

  const resend = new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: env.CONTACT_EMAIL_FROM,
    to: [env.EDITORIAL_EMAIL_TO || env.CONTACT_EMAIL_TO],
    replyTo: d.email,
    subject: `[Gama Institute] WeekPaper | ${d.name} | ${d.paperTitle}`.slice(0, 200),
    html: emailLayout('Nouvelle présentation WeekPaper soumise', rows, d.name),
    attachments,
  })

  if (error) {
    console.error('[weekpaper-submission] Resend error', error)
    return json({ error: 'email_failed' }, 500)
  }

  return json({ ok: true })
}
