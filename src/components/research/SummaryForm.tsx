import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  makeResearchSummarySchema,
  isAllowedSummaryFile,
  isAllowedPhotoFile,
  SUMMARY_FILE,
  PHOTO_FILE,
} from '@/types/researchSummary'
import { useTurnstileToken } from '@/hooks/useTurnstileToken'
import { FormField } from '@/components/forms/FormField'
import { FileField } from '@/components/forms/FileField'
import { ConsentCheckbox, LegalText, PrivacyNotice } from '@/components/forms/LegalNotice'
import { Button } from '@/components/ui/Button'
import { DOWNLOADS } from '@/constants'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FileKey = 'summary' | 'photo'

const TEMPLATES = {
  fr: DOWNLOADS.summary_template_fr,
  en: DOWNLOADS.summary_template_en,
} as const

export function SummaryForm({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation('research')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  const [formState, setFormState] = useState<FormState>('idle')
  const [files, setFiles] = useState<Record<FileKey, File | null>>({ summary: null, photo: null })
  const [fileErrors, setFileErrors] = useState<Partial<Record<FileKey, string>>>({})
  const turnstileRef = useRef<HTMLDivElement>(null)
  const getToken = useTurnstileToken(turnstileRef)

  const schema = useMemo(() => makeResearchSummarySchema({
    required: t('form.errors.required'),
    email:    t('form.errors.email'),
    url:      t('form.errors.url'),
    consent:  t('common:forms.consent_required'),
  }), [t])
  type Fields = z.input<typeof schema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<Fields>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isSubmitted) trigger()
  }, [lang, isSubmitted, trigger])

  function validateFiles(next = files) {
    const errs: Partial<Record<FileKey, string>> = {}
    const { summary, photo } = next
    if (!summary) errs.summary = t('form.errors.required')
    else if (!isAllowedSummaryFile(summary)) errs.summary = t('form.errors.summary_type')
    else if (summary.size > SUMMARY_FILE.maxBytes) errs.summary = t('form.errors.summary_size')
    if (photo && !isAllowedPhotoFile(photo)) errs.photo = t('form.errors.photo_type')
    else if (photo && photo.size > PHOTO_FILE.maxBytes) errs.photo = t('form.errors.photo_size')
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
        body.append('summary', files.summary as File)
        if (files.photo) body.append('photo', files.photo)
        body.append('turnstileToken', token)
        const res = await fetch('/api/research-summary', { method: 'POST', body })
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
        <h3 className="font-display font-semibold text-[1.4rem] text-ink">{t('form.ok_title')}</h3>
        <p className="text-ink-soft mt-3 mb-[22px]">{t('form.ok_body')}</p>
        <Button variant="ghost" onClick={onClose}>{t('form.close')}</Button>
      </div>
    )
  }

  // Lead with the template in the visitor's own language
  const tplOrder = lang === 'fr' ? (['fr', 'en'] as const) : (['en', 'fr'] as const)

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-ink-soft text-[0.94rem] -mt-2 mb-[22px]">{t('form.sub')}</p>

      <div className="grid grid-cols-2 gap-[18px] max-[620px]:grid-cols-1">
        <FormField id="rs-n" label={t('form.name')} type="text" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <FormField id="rs-e" label={t('form.email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField id="rs-u" label={t('form.institution')} type="text" autoComplete="organization" error={errors.institution?.message} {...register('institution')} />
        <FormField id="rs-li" label={t('form.linkedin')} type="url" placeholder="https://linkedin.com/in/…" error={errors.linkedin?.message} {...register('linkedin')} />

        <div className="col-span-full flex flex-col gap-[7px]">
          <FormField
            id="rs-bio"
            as="textarea"
            label={t('form.bio')}
            rows={2}
            maxLength={300}
            placeholder={t('form.bio_ph')}
            className="[&_textarea]:min-h-0"
            error={errors.bio?.message}
            {...register('bio')}
          />
          <small className="block text-[0.78rem] text-ink-muted">{t('form.bio_hint')}</small>
        </div>

        <FileField
          id="rs-ph"
          label={t('form.photo')}
          accept={PHOTO_FILE.accept}
          file={files.photo}
          onChange={f => setFile('photo', f)}
          hint={t('form.photo_hint')}
          error={fileErrors.photo}
        />

        <FormField id="rs-t" label={t('form.paper_title')} type="text" fullWidth error={errors.paperTitle?.message} {...register('paperTitle')} />
        <FormField id="rs-l" label={t('form.paper_url')} type="url" placeholder="https://" fullWidth error={errors.paperUrl?.message} {...register('paperUrl')} />

        <FileField
          id="rs-f"
          label={t('form.summary')}
          accept={SUMMARY_FILE.accept}
          file={files.summary}
          onChange={f => setFile('summary', f)}
          error={fileErrors.summary}
          hint={
            <>
              {t('form.summary_hint')} (
              {tplOrder.map((l, i) => (
                <span key={l}>
                  {i > 0 && ' · '}
                  <a className="font-semibold text-[var(--link)] hover:underline" href={TEMPLATES[l]} download>{l.toUpperCase()}</a>
                </span>
              ))}
              ).
            </>
          }
        />

        <ConsentCheckbox id="rs-consent" error={errors.consent?.message} {...register('consent')}>
          <LegalText ns="research" i18nKey="form.consent" />
        </ConsentCheckbox>
      </div>

      <PrivacyNotice className="mt-4" />

      {/* Invisible Turnstile container */}
      <div ref={turnstileRef} />

      {formState === 'error' && (
        <p className="text-red-600 text-[0.9rem] mt-3" role="alert">{t('form.error')}</p>
      )}

      <div className="flex justify-end gap-2.5 mt-6 flex-wrap">
        <Button type="button" variant="ghost" onClick={onClose}>{t('form.cancel')}</Button>
        <Button type="submit" variant="accent" disabled={formState === 'submitting'}>
          {formState === 'submitting' ? t('form.submitting') : <>{t('form.submit')} <span aria-hidden="true">→</span></>}
        </Button>
      </div>
    </form>
  )
}
