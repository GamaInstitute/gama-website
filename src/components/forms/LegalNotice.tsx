import { forwardRef, type InputHTMLAttributes } from 'react'
import { Trans } from 'react-i18next'

// Legal links inside forms open in a new tab so a half-filled form isn't lost.
const LINK_CLS = 'font-semibold text-[var(--link)] underline-offset-2 hover:underline'
// Plain <a>, not a router Link (new tab), so the deploy base path must be added by hand.
const BASE = import.meta.env.BASE_URL

/**
 * Renders an i18n string that may contain <privacy>, <terms> or <openaccess> tags
 * tags as links to the legal pages.
 */
export function LegalText({ i18nKey, ns = 'common', linkClassName = LINK_CLS }: { i18nKey: string; ns?: string; linkClassName?: string }) {
  return (
    <Trans
      i18nKey={i18nKey}
      ns={ns}
      components={{
        privacy: <a href={`${BASE}privacy`} target="_blank" rel="noopener" className={linkClassName} />,
        terms:   <a href={`${BASE}terms`}   target="_blank" rel="noopener" className={linkClassName} />,
        openaccess: <a href={`${BASE}open-access`} target="_blank" rel="noopener" className={linkClassName} />,
      }}
    />
  )
}

/** Collection notice shown under every form that sends personal information. */
export function PrivacyNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[0.8rem] leading-[1.5] text-ink-muted ${className}`}>
      <LegalText i18nKey="forms.privacy_notice" />
    </p>
  )
}

interface ConsentCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  children: React.ReactNode
  error?: string
}

/** Required, unticked-by-default consent box (express consent, Loi 25). */
export const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  function ConsentCheckbox({ id, children, error, ...rest }, ref) {
    return (
      <div className="col-span-full">
        <label htmlFor={id} className="flex gap-2.5 items-start text-[0.86rem] leading-[1.5] text-ink-soft cursor-pointer">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            aria-invalid={!!error}
            className="mt-[3px] w-4 h-4 flex-none accent-[var(--copper)]"
            {...rest}
          />
          <span>{children}{rest.required && <span aria-hidden="true" className="text-[var(--accent-ink)] ml-1">*</span>}</span>
        </label>
        {error && <p className="text-[0.82rem] text-red-600 mt-1.5 pl-[26px]" role="alert">{error}</p>}
      </div>
    )
  },
)
