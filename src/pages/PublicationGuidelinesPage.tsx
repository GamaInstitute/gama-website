import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'
import { Markdown, headings } from '@/components/guides/Markdown'
import frSource           from '@/content/publication-guidelines/fr.md?raw'
import enSource           from '@/content/publication-guidelines/en.md?raw'

// Both languages are bundled into this page's lazy chunk (a few KB gzipped), so
// the SSG pass can render synchronously and the language toggle switches instantly.
const SOURCES = { fr: frSource, en: enSource }

type Meta = { title: string; description: string; lead: string }

// Front matter is a `---` block of `key: value` lines, nothing more.
function parse(raw: string): { meta: Meta; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const meta: Record<string, string> = {}
  m?.[1].split('\n').forEach(l => {
    const idx = l.indexOf(':')
    if (idx > 0) meta[l.slice(0, idx).trim()] = l.slice(idx + 1).trim()
  })
  return { meta: meta as Meta, body: m ? raw.slice(m[0].length) : raw }
}

export default function PublicationGuidelinesPage() {
  const { t, i18n } = useTranslation('common')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  const { meta, body } = parse(SOURCES[lang])
  const toc = headings(body)

  return (
    <>
      <Helmet>
        <title>{`${meta.title} | Gama Institute`}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <main id="main">
        <section className="pt-[clamp(52px,7vw,96px)] pb-[clamp(28px,4vw,48px)] border-b border-hairline">
          <div className="wrap max-w-[900px]">
            <Eyebrow>{t('guides.eyebrow')}</Eyebrow>
            <h1 className="font-display font-semibold text-[clamp(2.1rem,4.2vw,3.2rem)] leading-[1.08] tracking-[-0.025em] text-ink mt-4">
              {meta.title}
            </h1>
            <p className="text-ink-soft text-[1.12rem] leading-[1.6] mt-5 max-w-[62ch]">{meta.lead}</p>
          </div>
        </section>

        <section className="py-[clamp(40px,6vw,80px)]">
          <div className="wrap grid grid-cols-[240px_minmax(0,1fr)] gap-[clamp(28px,5vw,72px)] items-start max-[860px]:grid-cols-1">
            <nav
              aria-label={t('guides.toc')}
              className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain pr-2 max-[860px]:static max-[860px]:max-h-none"
            >
              <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mb-3">{t('guides.toc')}</p>
              <ol className="list-none m-0 p-0 grid gap-1 text-[0.86rem]">
                {toc.map(h => (
                  // Sub-sections are hidden on small screens, where the list sits above the text
                  <li key={h.id} className={h.level === 2 ? 'mt-2 first:mt-0' : 'pl-3 border-l border-hairline max-[860px]:hidden'}>
                    <a
                      href={`#${h.id}`}
                      className={h.level === 2 ? 'font-semibold text-ink hover:text-[var(--accent-ink)] transition-colors' : 'text-ink-muted hover:text-ink transition-colors'}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-[72ch] text-ink-soft text-[1rem] leading-[1.7]">
              <Markdown source={body} />

              <div className="mt-16 p-[22px] rounded-lg border bg-ink border-ink dark:bg-surface-2 dark:border-hairline-2">
                <p className="m-0 font-display font-semibold text-[1.15rem] text-white dark:text-ink">{t('guides.ready')}</p>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <Button as="link" to="/research-summaries#contribute" variant="accent" size="sm">{t('guides.cta_summary')}</Button>
                  <Button as="link" to="/week-paper#contribute" variant="ghost-dark" size="sm">{t('guides.cta_weekpaper')}</Button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
