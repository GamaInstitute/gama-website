import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  makeWeekpaperSubmissionSchema,
  isAllowedSlidesFile,
  isAllowedPhotoFile,
  SLIDES_FILE,
  PHOTO_FILE,
  PUBLISH_OPTIONS,
} from '@/types/weekpaperSubmission'
import { useTurnstileToken } from '@/hooks/useTurnstileToken'
import { FormField } from '@/components/forms/FormField'
import { FileField } from '@/components/forms/FileField'
import { ConsentCheckbox, LegalText, PrivacyNotice } from '@/components/forms/LegalNotice'
import { Button } from '@/components/ui/Button'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FileKey = 'photo' | 'slides'

function Group({ children }: { children: React.ReactNode }) {
  return (
    <p className="col-span-full text-[0.7rem] font-bold tracking-[0.13em] uppercase text-[var(--accent-ink)] border-t border-hairline pt-4 mt-2.5 -mb-1 first:border-t-0 first:pt-0 first:mt-0">
      {children}
    </p>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <small className="block text-[0.78rem] text-ink-muted -mt-[11px] col-span-full">{children}</small>
}

export function PresentationForm({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation('weekpaper')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  const [formState, setFormState] = useState<FormState>('idle')
  const [files, setFiles] = useState<Record<FileKey, File | null>>({ photo: null, slides: null })
  const [fileErrors, setFileErrors] = useState<Partial<Record<FileKey, string>>>({})
  const turnstileRef = useRef<HTMLDivElement>(null)
  const getToken = useTurnstileToken(turnstileRef)

  const schema = useMemo(() => makeWeekpaperSubmissionSchema({
    required: t('submit.errors.required'),
    email:    t('submit.errors.email'),
    url:      t('submit.errors.url'),
    consent:  t('common:forms.consent_required'),
  }), [t])
  type Fields = z.input<typeof schema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<Fields>({ resolver: zodResolver(schema), defaultValues: { publish: 'yt-li' } })

  useEffect(() => {
    if (isSubmitted) trigger()
  }, [lang, isSubmitted, trigger])

  function validateFiles(next = files) {
    const errs: Partial<Record<FileKey, string>> = {}
    const { photo, slides } = next
    if (!photo) errs.photo = t('submit.errors.required')
    else if (!isAllowedPhotoFile(photo)) errs.photo = t('submit.errors.photo_type')
    else if (photo.size > PHOTO_FILE.maxBytes) errs.photo = t('submit.errors.photo_size')
    if (!slides) errs.slides = t('submit.errors.required')
    else if (!isAllowedSlidesFile(slides)) errs.slides = t('submit.errors.slides_type')
    else if (slides.size > SLIDES_FILE.maxBytes) errs.slides = t('submit.errors.slides_size')
    setFileErrors(errs)
    return Object.keys(errs).length === 0
  }

  function setFile(key: FileKey, file: File | null) {
    const next = { ...files, [key]: file }
    setFiles(next)
    if (isSubmitted) validateFiles(next)
  }

  const onSubmit = handleSubmit(
    async (data) => {
      if (!validateFiles()) return
      setFormState('submitting')
      try {
        const token = await getToken()
        const body = new FormData()
        Object.entries(data).forEach(([k, v]) => body.append(k, String(v ?? '')))
        body.append('photo', files.photo as File)
        body.append('slides', files.slides as File)
        body.append('turnstileToken', token)
        const res = await fetch('/api/weekpaper-submission', { method: 'POST', body })
        if (!res.ok) throw new Error('Server error')
        setFormState('success')
      } catch {
        setFormState('error')
      }
    },
    () => { validateFiles() },
  )

  if (formState === 'success') {
    return (
      <div className="text-center py-5">
        <h3 className="font-display font-semibold text-[1.4rem] text-ink">{t('submit.ok_title')}</h3>
        <p className="text-ink-soft mt-3 mb-[22px]">{t('submit.ok_body')}</p>
        <Button variant="ghost" onClick={onClose}>{t('submit.close')}</Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-ink-soft text-[0.94rem] -mt-2">{t('submit.sub')}</p>
      <p className="text-ink-muted text-[0.8rem] mt-1.5 mb-[22px]">
        <span aria-hidden="true" className="text-[var(--accent-ink)]">*</span> {t('submit.required_note')}
      </p>

      <div className="grid grid-cols-2 gap-[18px] max-[620px]:grid-cols-1">
        <Group>{t('submit.grp_you')}</Group>
        <FormField id="wp-n" required label={t('submit.name')} type="text" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <FormField id="wp-e" required label={t('submit.email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField id="wp-u" label={t('submit.institution')} type="text" autoComplete="organization" error={errors.institution?.message} {...register('institution')} />
        <FormField id="wp-li" label={t('submit.linkedin')} type="url" placeholder="https://linkedin.com/in/…" error={errors.linkedin?.message} {...register('linkedin')} />
        <FormField
          id="wp-bio" required
          as="textarea"
          label={t('submit.bio')}
          rows={2}
          maxLength={400}
          fullWidth
          className="[&_textarea]:min-h-0"
          error={errors.bio?.message}
          {...register('bio')}
        />
        <Hint>{t('submit.bio_hint')}</Hint>
        <FileField
          id="wp-ph" required
          label={t('submit.photo')}
          accept={PHOTO_FILE.accept}
          file={files.photo}
          onChange={f => setFile('photo', f)}
          hint={t('submit.photo_hint')}
          error={fileErrors.photo}
        />

        <Group>{t('submit.grp_paper')}</Group>
        <FormField id="wp-t" required label={t('submit.paper_title')} type="text" fullWidth error={errors.paperTitle?.message} {...register('paperTitle')} />
        <FormField id="wp-a" required label={t('submit.paper_authors')} type="text" error={errors.paperAuthors?.message} {...register('paperAuthors')} />
        <FormField id="wp-l" required label={t('submit.paper_url')} type="url" placeholder="https://" error={errors.paperUrl?.message} {...register('paperUrl')} />

        <Group>{t('submit.grp_talk')}</Group>
        <FormField id="wp-v" required label={t('submit.video_url')} type="url" placeholder="https://" fullWidth error={errors.videoUrl?.message} {...register('videoUrl')} />
        <Hint>{t('submit.video_hint')}</Hint>
        <FileField
          id="wp-s" required
          label={t('submit.slides')}
          accept={SLIDES_FILE.accept}
          file={files.slides}
          onChange={f => setFile('slides', f)}
          hint={t('submit.slides_hint')}
          error={fileErrors.slides}
        />
        <FormField id="wp-yt" required label={t('submit.yt_title')} type="text" maxLength={100} fullWidth error={errors.ytTitle?.message} {...register('ytTitle')} />
        <FormField id="wp-yd" required as="textarea" label={t('submit.yt_desc')} rows={4} maxLength={5000} fullWidth error={errors.ytDescription?.message} {...register('ytDescription')} />
        <Hint>{t('submit.yt_desc_hint')}</Hint>

        <Group>{t('submit.grp_pub')}</Group>
        <div role="radiogroup" aria-label={t('submit.publish_label')} className="col-span-full grid grid-cols-2 gap-2.5 max-[520px]:grid-cols-1">
          {PUBLISH_OPTIONS.map(opt => (
            <label
              key={opt}
              className="flex gap-2.5 items-start p-[14px] border border-hairline-2 rounded-md cursor-pointer transition-colors has-[:checked]:border-copper has-[:checked]:bg-[rgba(181,100,24,.06)] has-[:focus-visible]:shadow-[var(--ring)]"
            >
              <input type="radio" value={opt} className="mt-[3px] accent-[var(--copper)]" {...register('publish')} />
              <span>
                <b className="block text-[0.92rem] font-semibold text-ink">{t(`submit.publish.${opt}.title`)}</b>
                <small className="block text-[0.8rem] text-ink-muted mt-0.5 leading-[1.4]">{t(`submit.publish.${opt}.desc`)}</small>
              </span>
            </label>
          ))}
        </div>

        <ConsentCheckbox id="wp-consent" required error={errors.consent?.message} {...register('consent')}>
          <LegalText ns="weekpaper" i18nKey="submit.consent" />
        </ConsentCheckbox>
      </div>

      <PrivacyNotice className="mt-4" />

      {/* Invisible Turnstile container */}
      <div ref={turnstileRef} />

      {formState === 'error' && (
        <p className="text-red-600 text-[0.9rem] mt-3" role="alert">{t('submit.error')}</p>
      )}

      <div className="flex justify-end gap-2.5 mt-6 flex-wrap">
        <Button type="button" variant="ghost" onClick={onClose}>{t('submit.cancel')}</Button>
        <Button type="submit" variant="accent" disabled={formState === 'submitting'}>
          {formState === 'submitting' ? t('submit.submitting') : <>{t('submit.submit')} <span aria-hidden="true">→</span></>}
        </Button>
      </div>
    </form>
  )
}
