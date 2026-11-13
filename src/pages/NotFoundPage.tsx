import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'

/** Any unknown URL. Prerendered as 404.html, see the '404' and '*' routes in routes.tsx. */
export default function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <>
      <Helmet>
        <title>{t('not_found.meta_title')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main id="main" className="wrap py-[clamp(64px,10vw,140px)]">
        <div className="max-w-[640px]">
          <Eyebrow>404</Eyebrow>
          <h1 className="font-display font-semibold text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.08] tracking-[-0.025em] text-ink mt-4">
            {t('not_found.h1')}
          </h1>
          <p className="text-[clamp(1.02rem,1.4vw,1.15rem)] leading-[1.6] text-ink-soft mt-5">
            {t('not_found.body')}
          </p>
          <div className="flex gap-[14px] flex-wrap mt-8">
            <Button as="link" to="/" variant="accent">{t('not_found.home')} <span aria-hidden="true">→</span></Button>
            <Button as="link" to="/contact" variant="ghost">{t('not_found.contact')}</Button>
          </div>
        </div>
      </main>
    </>
  )
}
