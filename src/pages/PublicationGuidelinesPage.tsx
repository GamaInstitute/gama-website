import { useEffect, useRef, useState } from 'react'
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

  // Scrollspy: the last heading above the header line is the current one. The sidebar
  // follows it so the reader always sees where they are; on small screens, where the
  // contents list sits above the text, a floating button leads back to it instead.
  const navRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState('')
  const [pastToc, setPastToc] = useState(false)

  useEffect(() => {
    const els = toc.map(h => document.getElementById(h.id)).filter((e): e is HTMLElement => e !== null)
    let frame = 0
    const update = () => {
      frame = 0
      let current = ''
      for (const el of els) {
        if (el.getBoundingClientRect().top > 120) break
        current = el.id
      }
      // The last sections are too short to reach the top, so the page bottom selects the last one
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = els[els.length - 1]?.id ?? current
      setActive(current)
      const nav = navRef.current
      setPastToc(!!nav && nav.getBoundingClientRect().bottom < 0)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [lang]) // headings change only with the language

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`)
    if (!nav || !link || nav.scrollHeight <= nav.clientHeight) return
    const top = link.offsetTop
    if (top < nav.scrollTop + 40 || top > nav.scrollTop + nav.clientHeight - 60) {
      nav.scrollTo({ top: top - nav.clientHeight / 3, behavior: 'smooth' })
    }
  }, [active])

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
              ref={navRef}
              id="toc"
              aria-label={t('guides.toc')}
              className="scroll-mt-[96px] sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain pr-2 max-[860px]:static max-[860px]:max-h-none"
            >
              <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mb-3">{t('guides.toc')}</p>
              <ol className="list-none m-0 p-0 grid gap-1 text-[0.86rem]">
                {toc.map(h => {
                  const on = h.id === active
                  return (
                  // Sub-sections are hidden on small screens, where the list sits above the text
                  <li key={h.id} className={h.level === 2 ? 'mt-2 first:mt-0' : `pl-3 border-l max-[860px]:hidden ${on ? 'border-[color:var(--accent)]' : 'border-hairline'}`}>
                    <a
                      href={`#${h.id}`}
                      aria-current={on ? 'location' : undefined}
                      className={h.level === 2
                        ? `font-semibold transition-colors hover:text-[var(--accent-ink)] ${on ? 'text-[var(--accent-ink)]' : 'text-ink'}`
                        : `transition-colors hover:text-ink ${on ? 'text-ink font-semibold' : 'text-ink-muted'}`}
                    >
                      {h.text}
                    </a>
                  </li>
                  )
                })}
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

        <a
          href="#toc"
          tabIndex={pastToc ? 0 : -1}
          aria-hidden={!pastToc}
          className={`min-[861px]:hidden fixed bottom-5 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-[var(--copper)] hover:bg-[#9d5515] px-4 py-2.5 text-[0.88rem] font-semibold text-white shadow-[var(--sh-2)] transition-[opacity,transform] duration-200 ${pastToc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        >
          {t('guides.back_to_toc')} <span aria-hidden="true">↑</span>
        </a>
      </main>
    </>
  )
}
