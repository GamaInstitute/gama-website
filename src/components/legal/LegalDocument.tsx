import { Fragment } from 'react'
import { Helmet }         from 'react-helmet-async'
import { Link }           from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import i18n               from '@/i18n'
import frLegal            from '@/i18n/locales/fr/legal.json'
import enLegal            from '@/i18n/locales/en/legal.json'
import { Eyebrow }        from '@/components/ui/Eyebrow'
import { CONTACT_EMAIL }  from '@/constants'
import { formatEpisodeDate } from '@/lib/formatDate'

// The legal texts are long and only needed on two pages, so the `legal` namespace
// is registered here, inside the lazily loaded page chunk, instead of in
// src/i18n/index.ts (which bundles every namespace into the main eager chunk).
if (!i18n.hasResourceBundle('fr', 'legal')) {
  i18n.addResourceBundle('fr', 'legal', frLegal)
  i18n.addResourceBundle('en', 'legal', enLegal)
}

type Section = {
  id: string
  h: string
  p?: string[]
  list?: string[]
  p_after?: string[]
}

type LegalDoc = {
  meta: { title: string; description: string }
  eyebrow: string
  title: string
  updated_iso: string
  intro: string[]
  sections: Section[]
}

const LINK_CLS = 'font-semibold text-[var(--link)] underline underline-offset-2 decoration-[color-mix(in_srgb,currentColor_35%,transparent)] hover:decoration-current'

// Minimal inline markup for the legal JSON: **bold** and [text](href).
// href may be '#anchor', '/internal-route', 'mailto:' or an external https URL.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/)
        if (bold) return <strong key={i} className="font-semibold text-ink">{bold[1]}</strong>
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const [, label, href] = link
          if (href.startsWith('/')) return <Link key={i} to={href} className={LINK_CLS}>{label}</Link>
          const external = href.startsWith('http')
          return (
            <a key={i} href={href} className={LINK_CLS} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {label}
            </a>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function Paragraphs({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return <>{items.map((p, i) => <p key={i} className="mt-3 first:mt-0"><Inline text={p} /></p>)}</>
}

export function LegalDocument({ doc }: { doc: 'privacy' | 'terms' | 'openaccess' }) {
  const { t, i18n: inst } = useTranslation('legal')
  const data = t(doc, { returnObjects: true }) as LegalDoc

  return (
    <>
      <Helmet>
        <title>{data.meta.title}</title>
        <meta name="description" content={data.meta.description} />
      </Helmet>

      <main id="main">
        <section className="pt-[clamp(52px,7vw,96px)] pb-[clamp(28px,4vw,48px)] border-b border-hairline">
          <div className="wrap">
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h1 className="font-display font-semibold text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08] tracking-[-0.025em] text-ink mt-4">
              {data.title}
            </h1>
            <p className="text-ink-muted text-[0.92rem] mt-4">
              {t('ui.updated')} <time dateTime={data.updated_iso}>{formatEpisodeDate(data.updated_iso, inst.language)}</time>
            </p>
          </div>
        </section>

        <section className="py-[clamp(40px,6vw,80px)]">
          <div className="wrap grid grid-cols-[220px_minmax(0,1fr)] gap-[clamp(28px,5vw,72px)] items-start max-[860px]:grid-cols-1">
            <nav aria-label={t('ui.toc')} className="sticky top-[100px] max-[860px]:static">
              <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mb-3">{t('ui.toc')}</p>
              <ol className="list-none m-0 p-0 grid gap-1.5 text-[0.88rem] max-[860px]:grid-cols-2 max-[480px]:grid-cols-1">
                {data.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-ink-soft hover:text-ink transition-colors">
                      <span className="text-ink-muted tabular-nums mr-1.5">{i + 1}.</span>{s.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-[72ch] text-ink-soft text-[1rem] leading-[1.7]">
              <div className="text-[1.08rem] text-ink-soft">
                <Paragraphs items={data.intro} />
              </div>

              {data.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="mt-11 scroll-mt-[96px]">
                  <h2 className="font-display font-semibold text-[1.35rem] tracking-[-0.015em] text-ink mb-3">
                    <span className="text-[var(--accent-ink)] mr-2 tabular-nums">{i + 1}.</span>{s.h}
                  </h2>
                  <Paragraphs items={s.p} />
                  {s.list && (
                    <ul className="mt-3 pl-5 list-disc marker:text-[var(--accent)] grid gap-1.5">
                      {s.list.map((li, j) => <li key={j}><Inline text={li} /></li>)}
                    </ul>
                  )}
                  {s.p_after && <div className="mt-3"><Paragraphs items={s.p_after} /></div>}
                </section>
              ))}

              <div className="mt-14 p-[22px] rounded-lg border border-hairline bg-surface flex flex-wrap gap-x-4 gap-y-1 items-center justify-between">
                <p className="m-0 font-semibold text-ink">{t('ui.questions')}</p>
                <a href={`mailto:${CONTACT_EMAIL.general}`} className={LINK_CLS}>
                  {t('ui.write_us')} {CONTACT_EMAIL.general}
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
