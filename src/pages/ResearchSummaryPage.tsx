import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Button }         from '@/components/ui/Button'
import { TopicTag }       from '@/components/ui/Tag'
import { LinkedInIcon }   from '@/components/ui/icons'
import { Avatar }         from '@/components/team/Avatar'
import { Markdown, headings } from '@/components/guides/Markdown'
import { formatEpisodeDate } from '@/lib/formatDate'
import { summaryText, type SummaryItem } from '@/content/research-summaries'

// Plain <img> paths, so the deploy base path is added by hand (as in Markdown.tsx)
const BASE = import.meta.env.BASE_URL

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
              <TopicTag topic={item.axis}>{axes[item.axis]}</TopicTag>
            </p>
            <h1 className="font-display font-semibold text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.025em] text-ink mt-4">
              {item.title}
            </h1>
            {/* Contributor, as on the Montreal AI Ethics Institute's summaries: photo, name, bio, LinkedIn */}
            <div className="mt-7 flex gap-4 items-start">
              <div className="w-14 h-14 flex-none rounded-full overflow-hidden border border-hairline bg-surface">
                <Avatar name={item.author} photo={item.photo && (item.photo.startsWith('/') ? BASE + item.photo.slice(1) : item.photo)} shape="circle" />
              </div>
              <div className="min-w-0 text-[0.95rem] leading-[1.6]">
                <p className="m-0 flex flex-wrap items-center gap-x-2">
                  <span className="text-ink-soft">{t('list.by')}</span>
                  <b className="text-ink font-semibold">{item.author}</b>
                  {item.linkedin && (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('article.linkedin', { name: item.author })}
                      className="text-ink-muted hover:text-[var(--link)] transition-colors"
                    >
                      <LinkedInIcon size={15} />
                    </a>
                  )}
                </p>
                {(item.bio || item.institution) && (
                  <p className="mt-1 text-ink-muted max-w-[60ch]">
                    {[item.bio, item.institution].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </div>

            {/* The original paper: title (linked), authors, venue */}
            <div className="mt-6 border-l-[3px] border-[var(--accent)] pl-4 py-1 text-[0.95rem] leading-[1.6]">
              <p className="m-0 text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted">{t('article.orig')}</p>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline font-semibold text-[var(--link)] underline-offset-2 hover:underline"
              >
                {item.paper_title} <span aria-hidden="true">↗</span>
              </a>
              <p className="m-0 mt-0.5 text-ink-soft">{item.paper_authors}</p>
              {item.paper_venue && <p className="m-0 italic text-ink-muted">{item.paper_venue}</p>}
            </div>
          </div></div>
        </header>

        <section className="py-[clamp(40px,6vw,72px)]">
          <div className="wrap"><div className="max-w-[72ch]">
            {text.lang !== lang && (
              <p className="mb-8 text-[0.88rem] text-ink-muted py-3 px-4 border border-dashed border-hairline-2 rounded-md">
                {t('article.lang_note')}
              </p>
            )}

            {/* Table of contents, required by the Publication Guidelines, built from the ## / ### headings */}
            <nav aria-label={t('article.toc')} className="mb-10 p-[22px] rounded-lg border border-hairline bg-surface">
              <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mb-3">{t('article.toc')}</p>
              <ol lang={text.lang} className="list-none m-0 p-0 grid gap-1.5 text-[0.92rem]">
                {headings(text.source).map(h => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a href={`#${h.id}`} className="font-semibold text-[var(--link)] underline-offset-2 hover:underline">{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>

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
