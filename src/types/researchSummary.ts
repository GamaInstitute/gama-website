import { z } from 'zod'

// Submissions go out as Resend email attachments (see functions/api/research-summary.ts).
// Resend caps a whole email at 40MB after base64 encoding, so these stay well under it.
export const SUMMARY_FILE = {
  maxBytes: 10 * 1024 * 1024,
  types: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  accept: '.doc,.docx,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const

export const PHOTO_FILE = {
  maxBytes: 5 * 1024 * 1024,
  types: ['image/jpeg', 'image/png'],
  accept: 'image/jpeg,image/png',
} as const

export const httpsUrl = (msg: string) =>
  z.string().max(500).url(msg).refine(v => /^https?:\/\//i.test(v), msg)

// Checkbox on the client (boolean), multipart string on the server ('true').
// Must be ticked: the submitter grants publication rights (see /terms).
export const consentField = (msg: string) =>
  z.preprocess(v => v === true || v === 'true', z.literal(true, { errorMap: () => ({ message: msg }) }))

export type FieldMessages = { required: string; email: string; url: string; consent: string }

// Text fields + consent only — the two files travel alongside as multipart parts and are
// checked against SUMMARY_FILE / PHOTO_FILE on both sides.
export function makeResearchSummarySchema(m: FieldMessages) {
  return z.object({
    name:        z.string().trim().min(1, m.required).max(120),
    email:       z.string().trim().min(1, m.required).email(m.email).max(254),
    institution: z.string().trim().max(200).optional().default(''),
    linkedin:    z.union([z.literal(''), httpsUrl(m.url)]).optional().default(''),
    bio:         z.string().trim().min(1, m.required).max(300),
    paperTitle:  z.string().trim().min(1, m.required).max(300),
    paperUrl:    httpsUrl(m.url),
    consent:     consentField(m.consent),
  })
}

// Server-side copy with plain English messages (only seen in 422 response bodies)
export const researchSummarySchema = makeResearchSummarySchema({
  required: 'Required',
  email:    'Invalid email',
  url:      'Invalid URL',
  consent:  'Consent required',
})

export type ResearchSummaryFields = z.infer<typeof researchSummarySchema>

// Browsers without a MIME mapping for Office files send '' or application/octet-stream;
// only then fall back to the extension.
export const hasGenericType = (file: { type: string }) =>
  file.type === '' || file.type === 'application/octet-stream'

export function isAllowedSummaryFile(file: { name: string; type: string }): boolean {
  if ((SUMMARY_FILE.types as readonly string[]).includes(file.type)) return true
  return hasGenericType(file) && /\.(pdf|docx?)$/i.test(file.name)
}

export function isAllowedPhotoFile(file: { name: string; type: string }): boolean {
  return (PHOTO_FILE.types as readonly string[]).includes(file.type)
}
