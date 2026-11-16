import { useTranslation } from 'react-i18next'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FormField } from '@/components/forms/FormField'

/**
 * The AI-use declaration required by section 6.4 of the Publication Guidelines, in both
 * submission forms (Research Summary, WeekPaper). Required; validated on both sides
 * (`aiDisclosure` in src/types/researchSummary.ts). `onDeclareNone` fills in the standard
 * "no AI used" sentence, so the simplest case takes one click but stays explicit.
 */
export function AiDisclosureField({ id, registration, error, onDeclareNone }: {
  id: string
  registration: UseFormRegisterReturn
  error?: string
  onDeclareNone: (sentence: string) => void
}) {
  const { t } = useTranslation('common')
  return (
    <div className="col-span-full flex flex-col gap-[7px]">
      <FormField
        id={id}
        required
        as="textarea"
        label={t('forms.ai_label')}
        rows={3}
        maxLength={1000}
        placeholder={t('forms.ai_placeholder')}
        className="[&_textarea]:min-h-0"
        error={error}
        {...registration}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <small className="text-[0.78rem] text-ink-muted">
          {t('forms.ai_hint')}{' '}
          <a className="font-semibold text-[var(--link)] hover:underline" href={`${import.meta.env.BASE_URL}publication-guidelines#ai-disclosure`} target="_blank" rel="noopener">
            {t('forms.ai_hint_link')}
          </a>
        </small>
        <button
          type="button"
          onClick={() => onDeclareNone(t('forms.ai_none_sentence'))}
          className="text-[0.8rem] font-semibold text-[var(--link)] border border-hairline-2 rounded-pill px-3 py-1.5 hover:border-ink transition-colors focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
        >
          {t('forms.ai_none_btn')}
        </button>
      </div>
    </div>
  )
}
