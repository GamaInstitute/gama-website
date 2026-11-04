import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Button }         from '@/components/ui/Button'
import { Tag }            from '@/components/ui/Tag'
import { Markdown }       from '@/components/guides/Markdown'
import { formatEpisodeDate } from '@/lib/formatDate'
import { summaryText, type SummaryItem } from '@/content/research-summaries'

const BACK_CLS = 'inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-ink-muted hover:text-ink transition-colors'

/** One published Research Summary: /research-summaries/:id */
export default function ResearchSummaryPage() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation('research')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'

  const items = t('items', { returnObjects: true }) as SummaryItem[]
  const axes  = t('axes',  { returnObjects: true }) as Record<string, string>
  const item  = items.find(it => it.id === id)
  const text  = item && summaryText(item.id, lang)

  const back = (
    <Link to="/research-summaries#summaries" className={BACK_CLS}>
      <span aria-hidden="true">←</span> {t('article.back')}
    </Link>
  )

  if (!item || !text) {
    return (
      <main id="main" className="wrap py-[clamp(52px,7vw,96px)]">
        {back}
        <p className="mt-6 text-ink-soft" role="status">{t('article.not_found')}</p>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${item.title} | Gama Institute`}</title>
        <meta name="description" content={item.description} />
      </Helmet>

      <main id="main">
        <header className="pt-[clamp(40px,6vw,80px)] pb-[clamp(28px,4vw,48px)] border-b border-hairline">
          <div className="wrap"><div className="max-w-[820px]">
            {back}
            <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.84rem] font-semibold text-ink-muted tracking-[0.02em]">
              <time dateTime={item.date_iso}>{formatEpisodeDate(item.date_iso, i18n.language)}</time>
              <span aria-hidden="true">·</span>
              <Tag variant="copper">{axes[item.axis]}</Tag>
            </p>
            <h1 className="font-display font-semibold text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.025em] text-ink mt-4">
              {item.title}
            </h1>
            <p className="mt-5 text-[0.95rem] text-ink-soft leading-[1.6]">
              <b className="text-ink font-semibold">{t('list.by')} {item.author}</b>{item.bio && `, ${item.bio}`}
            </p>
            <p className="mt-1 text-[0.95rem] text-ink-muted leading-[1.6]">
              {t('article.orig')}{' '}
              <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline-offset-2 hover:underline">
                {item.paper_authors}
              </a>
            </p>
          </div></div>
        </header>

        <section className="py-[clamp(40px,6vw,72px)]">
          <div className="wrap"><div className="max-w-[72ch]">
            {text.lang !== lang && (
              <p className="mb-8 text-[0.88rem] text-ink-muted py-3 px-4 border border-dashed border-hairline-2 rounded-md">
                {t('article.lang_note')}
              </p>
            )}

            <article lang={text.lang} className="text-ink-soft text-[1.02rem] leading-[1.75]">
              <Markdown source={text.source} compact />
            </article>

            <div className="mt-16 p-[22px] rounded-lg border bg-ink border-ink dark:bg-surface-2 dark:border-hairline-2">
              <p className="m-0 font-display font-semibold text-[1.15rem] text-white dark:text-ink">{t('article.cta_h')}</p>
              <p className="mt-2 text-[0.92rem] text-white/75 dark:text-ink-soft">{t('article.cta_body')}</p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Button as="link" to="/research-summaries#contribute" variant="accent" size="sm">{t('article.cta_btn')}</Button>
                <Button as="link" to="/publication-guidelines#research-summaries" variant="ghost-dark" size="sm">{t('sidebar.guide')}</Button>
              </div>
            </div>

            <div className="mt-10">{back}</div>
          </div></div>
        </section>
      </main>
    </>
  )
}
