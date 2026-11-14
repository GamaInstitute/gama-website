import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTurnstileToken } from '@/hooks/useTurnstileToken'
import { LegalText } from '@/components/forms/LegalNotice'

type State = 'idle' | 'loading' | 'success' | 'error'

// `dark`: on the dark newsletter card and in the subscribe window. `light`: on a page
// background (the strip under the Home vision video).
const TONE = {
  dark: {
    input: 'text-white bg-white/10 border-white/20 placeholder:text-white/50 focus:border-white/60',
    notice: 'text-white/60',
    noticeLink: 'font-semibold text-white/85 underline underline-offset-2 hover:text-white',
    success: 'text-white/90',
  },
  light: {
    input: 'text-ink bg-surface border-hairline-2 placeholder:text-ink-muted focus:border-[var(--teal)] focus:shadow-[var(--ring)]',
    notice: 'text-ink-muted',
    noticeLink: 'font-semibold text-ink-soft underline underline-offset-2 hover:text-ink',
    success: 'text-ink',
  },
} as const

export function NewsletterForm({ tone = 'dark' }: { tone?: keyof typeof TONE }) {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const getToken = useTurnstileToken(turnstileRef)
  const c = TONE[tone]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      const turnstileToken = await getToken()
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return <p className={`${c.success} text-[0.95rem]`} role="status">{t('newsletter.success')}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-[10px] flex-wrap mt-1" noValidate>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t('newsletter.email_placeholder')}
        aria-label={t('newsletter.email_placeholder')}
        autoComplete="email"
        className={`flex-1 min-w-[200px] font-sans text-[0.97rem] border rounded-pill px-[1.1em] py-[0.75em] focus:outline-none transition-colors ${c.input}`}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="font-sans font-semibold text-[0.9rem] px-[1.4em] py-[0.75em] rounded-pill bg-[var(--accent)] text-white hover:brightness-110 transition-all disabled:opacity-60"
      >
        {state === 'loading' ? '…' : t('newsletter.subscribe')}
      </button>

      {state === 'error' && (
        <p className="basis-full text-[0.85rem] m-0 text-red-500" role="alert">{t('newsletter.error')}</p>
      )}

      <p className={`basis-full text-[0.78rem] leading-[1.5] m-0 ${c.notice}`}>
        <LegalText i18nKey="forms.newsletter_notice" linkClassName={c.noticeLink} />
      </p>

      {/* Invisible Turnstile container */}
      <div ref={turnstileRef} />
    </form>
  )
}
