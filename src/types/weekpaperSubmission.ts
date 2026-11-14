import { z } from 'zod'
import { httpsUrl, consentField, aiDisclosureField, hasGenericType, type FieldMessages } from './researchSummary'

export { PHOTO_FILE, isAllowedPhotoFile } from './researchSummary'

// The video itself is shared as a link (Drive, Dropbox…), only the slides are uploaded.
// Slides + photo stay under Resend's 40MB per-email cap once base64-encoded (~1.33x).
export const SLIDES_FILE = {
  maxBytes: 15 * 1024 * 1024,
  types: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
  ],
  accept: '.pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint',
} as const

export const PUBLISH_OPTIONS = ['yt-li', 'yt'] as const

export function makeWeekpaperSubmissionSchema(m: FieldMessages) {
  return z.object({
    name:          z.string().trim().min(1, m.required).max(120),
    email:         z.string().trim().min(1, m.required).email(m.email).max(254),
    institution:   z.string().trim().max(200).optional().default(''),
    linkedin:      z.union([z.literal(''), httpsUrl(m.url)]).optional().default(''),
    bio:           z.string().trim().min(1, m.required).max(400),
    paperTitle:    z.string().trim().min(1, m.required).max(300),
    paperAuthors:  z.string().trim().min(1, m.required).max(500),
    paperUrl:      httpsUrl(m.url),
    videoUrl:      httpsUrl(m.url),
    ytTitle:       z.string().trim().min(1, m.required).max(100),
    ytDescription: z.string().trim().min(1, m.required).max(5000),
    publish:       z.enum(PUBLISH_OPTIONS),
    aiDisclosure:  aiDisclosureField(m.required),
    consent:       consentField(m.consent),
  })
}

export const weekpaperSubmissionSchema = makeWeekpaperSubmissionSchema({
  required: 'Required',
  email:    'Invalid email',
  url:      'Invalid URL',
  consent:  'Consent required',
})

export type WeekpaperSubmissionFields = z.infer<typeof weekpaperSubmissionSchema>

export function isAllowedSlidesFile(file: { name: string; type: string }): boolean {
  if ((SLIDES_FILE.types as readonly string[]).includes(file.type)) return true
  return hasGenericType(file) && /\.pptx?$/i.test(file.name)
}
