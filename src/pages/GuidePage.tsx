import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'
import { Markdown, headings } from '@/components/guides/Markdown'

export const GUIDE_SLUGS = ['research-summary', 'weekpaper', 'finding-papers'] as const
export type GuideSlug = typeof GUIDE_SLUGS[number]

// Every guide in both languages is bundled into this page's lazy chunk (a few KB
// gzipped), so the SSG pass can render them synchronously.
const SOURCES = import.meta.glob('/src/content/guides/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

type Meta = { title: string; description: string; lead: string; cta_label?: string; cta_href?: string }

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

export function GuidePage({ slug }: { slug: GuideSlug }) {
  const { t, i18n } = useTranslation('common')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  const { meta, body } = parse(SOURCES[`/src/content/guides/${lang}/${slug}.md`])
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
          <div className="wrap grid grid-cols-[220px_minmax(0,1fr)] gap-[clamp(28px,5vw,72px)] items-start max-[860px]:grid-cols-1">
            <nav aria-label={t('guides.toc')} className="sticky top-[100px] max-[860px]:static">
              <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mb-3">{t('guides.toc')}</p>
              <ol className="list-none m-0 p-0 grid gap-1.5 text-[0.88rem] max-[860px]:grid-cols-2 max-[480px]:grid-cols-1">
                {toc.map(h => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-ink-soft hover:text-ink transition-colors">{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-[72ch] text-ink-soft text-[1rem] leading-[1.7]">
              <Markdown source={body} />

              {meta.cta_href && (
                <div className="mt-14 p-[22px] rounded-lg border bg-ink border-ink dark:bg-surface-2 dark:border-hairline-2 flex flex-wrap gap-4 items-center justify-between">
                  <p className="m-0 font-display font-semibold text-[1.1rem] text-white dark:text-ink">{t('guides.ready')}</p>
                  <Button as="link" to={meta.cta_href} variant="accent" size="sm">{meta.cta_label}</Button>
                </div>
              )}
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
