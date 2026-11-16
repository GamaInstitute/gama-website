import { useRef, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeContactFormSchema, type ContactFormPayload, type ContactSubject } from '@/types/contact'
import { useTurnstileToken } from '@/hooks/useTurnstileToken'
import { FormField } from './FormField'
import { Button } from '@/components/ui/Button'
import { PrivacyNotice } from './LegalNotice'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  defaultSubject?: ContactSubject
}

export function ContactForm({ defaultSubject }: ContactFormProps) {
  const { i18n } = useTranslation('common')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  const [formState, setFormState] = useState<FormState>('idle')
  const turnstileRef = useRef<HTMLDivElement>(null)

  const schema = useMemo(() => makeContactFormSchema(lang), [lang])

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<ContactFormPayload>({
    resolver: zodResolver(schema),
    defaultValues: defaultSubject ? { subject: defaultSubject } : undefined,
  })

  useEffect(() => {
    if (isSubmitted) trigger()
  }, [lang, isSubmitted, trigger])

  const getToken = useTurnstileToken(turnstileRef)

  const onSubmit = handleSubmit(async (data) => {
    setFormState('submitting')
    try {
      const token = await getToken()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: token }),
      })
      if (!res.ok) throw new Error('Server error')
      setFormState('success')
    } catch {
      setFormState('error')
    }
  })

  if (formState === 'success') {
    return (
      <div className="bg-surface border border-hairline rounded-lg p-[clamp(24px,3vw,36px)] text-center">
        <p className="font-display text-[1.4rem] font-semibold text-ink">
          {lang === 'fr' ? 'Message envoyé ✓' : 'Message sent ✓'}
        </p>
        <p className="text-ink-soft mt-2">
          {lang === 'fr'
            ? 'Merci ! Nous vous répondrons sous deux jours ouvrables.'
            : 'Thank you! We\'ll reply within two business days.'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface border border-hairline rounded-lg p-[clamp(24px,3vw,36px)]"
      noValidate
    >
      <h2 className="font-display text-[1.5rem] font-semibold text-ink mb-1.5">
        {lang === 'fr' ? 'Écrivez-nous' : 'Send us a message'}
      </h2>
      <p className="text-ink-soft mb-6">
        {lang === 'fr'
          ? 'Dites-nous comment nous pouvons vous aider.'
          : 'Tell us how we can help.'}
      </p>

      <div className="grid grid-cols-2 gap-[18px] max-[620px]:grid-cols-1">
        <FormField
          id="fn"
          label={lang === 'fr' ? 'Prénom' : 'First name'}
          type="text"
          placeholder={lang === 'fr' ? 'Marie' : 'Marie'}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          id="ln"
          label={lang === 'fr' ? 'Nom' : 'Last name'}
          type="text"
          placeholder={lang === 'fr' ? 'Tremblay' : 'Smith'}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <FormField
          id="em"
          as="input"
          label={lang === 'fr' ? 'Courriel' : 'Email'}
          type="email"
          placeholder={lang === 'fr' ? 'marie@exemple.com' : 'marie@example.com'}
          fullWidth
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          id="sub"
          as="select"
          label={lang === 'fr' ? 'Sujet' : 'Subject'}
          fullWidth
          error={errors.subject?.message}
          {...register('subject')}
        >
          <option value="research">{lang === 'fr' ? 'Collaboration de recherche' : 'Research collaboration'}</option>
          <option value="supervision">{lang === 'fr' ? 'Supervision étudiante' : 'Student supervision'}</option>
          <option value="university">{lang === 'fr' ? 'Partenariat universitaire' : 'University partnership'}</option>
          <option value="industry">{lang === 'fr' ? 'Partenariat industriel' : 'Industry partnership'}</option>
          <option value="training">{lang === 'fr' ? 'Formation & Cours' : 'Training & courses'}</option>
          <option value="weekpaper">WeekPaper</option>
          <option value="press">{lang === 'fr' ? 'Presse & Médias' : 'Press & media'}</option>
          <option value="other">{lang === 'fr' ? 'Autre' : 'Other'}</option>
        </FormField>
        <FormField
          id="msg"
          as="textarea"
          label={lang === 'fr' ? 'Message' : 'Message'}
          placeholder={lang === 'fr' ? 'Décrivez votre demande…' : 'Tell us about your request…'}
          fullWidth
          error={errors.message?.message}
          {...register('message')}
        />
      </div>

      {/* Invisible Turnstile container */}
      <div ref={turnstileRef} />

      {formState === 'error' && (
        <p className="text-red-600 text-[0.9rem] mt-3">
          {lang === 'fr' ? 'Une erreur est survenue. Réessayez.' : 'Something went wrong. Please try again.'}
        </p>
      )}

      <div className="mt-[22px] flex items-center gap-4 flex-wrap">
        <Button type="submit" variant="accent" disabled={formState === 'submitting'}>
          {formState === 'submitting'
            ? (lang === 'fr' ? 'Envoi…' : 'Sending…')
            : (lang === 'fr' ? 'Envoyer le message →' : 'Send message →')}
        </Button>
      </div>

      <PrivacyNotice className="mt-4" />
    </form>
  )
}
