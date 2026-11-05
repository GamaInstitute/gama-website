import { useCallback, useMemo, useState } from 'react'
import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link }           from 'react-router-dom'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Reveal }         from '@/components/ui/Reveal'
import { Modal }          from '@/components/ui/Modal'
import { SummaryForm }    from '@/components/research/SummaryForm'
import { formatEpisodeDate } from '@/lib/formatDate'
import { ResourceList, type ResourceItem } from '@/components/guides/ResourceList'
import type { SummaryItem } from '@/content/research-summaries'



const PAGE_SIZE = 5
const RECENT_CONTRIBUTORS = 4

// Avatar background per `color` key in research.json (literal classes so Tailwind keeps them)
const AVATAR_BG: Record<string, string> = {
  c1: 'bg-copper',
  c2: 'bg-copper-bright',
  c3: 'bg-sage',
  c4: 'bg-teal-mid',
  c5: 'bg-teal',
}


const H2_CLS = 'font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink'
const LABEL_CLS = 'text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted'
const BOX_CLS = 'bg-surface border border-hairline rounded-lg p-[22px]'

function Avatar({ initials, color, size = 30 }: { initials: string; color: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`rounded-full grid place-items-center font-display text-[0.72rem] font-semibold text-white flex-none border-2 border-surface ${AVATAR_BG[color] ?? AVATAR_BG.c5}`}
    >
      {initials}
    </span>
  )
}

export default function ResearchSummariesPage() {
  const { t, i18n } = useTranslation('research')
  const { t: tCommon } = useTranslation('common')
  const [formOpen, setFormOpen] = useState(false)
  const [axis, setAxis] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const items = t('items',                 { returnObjects: true }) as SummaryItem[]
  const axes  = t('axes',                  { returnObjects: true }) as Record<string, string>
  const steps = t('hero.steps',            { returnObjects: true }) as string[]
  const files = t('contribute.files',      { returnObjects: true }) as ResourceItem[]
  const includes = t('contribute.includes', { returnObjects: true }) as string[]

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    return items.filter(it =>
      (axis === 'all' || it.axis === axis) &&
      (!q || [it.title, it.author, it.bio ?? '', it.paper_authors, axes[it.axis] ?? '']
        .some(s => s.toLocaleLowerCase().includes(q)))
    )
  }, [items, axes, axis, query])

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const pageItems = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  // Unique authors, newest first (items are stored newest first)
  const contributors = items
    .filter((it, i) => items.findIndex(o => o.author === it.author) === i)
    .slice(0, RECENT_CONTRIBUTORS)

  function goToPage(n: number) {
    setPage(n)
    document.getElementById('summaries')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openForm = () => setFormOpen(true)
  // Stable identity: Modal's focus-trap effect depends on onClose
  const closeForm = useCallback(() => setFormOpen(false), [])
  const submitLabel = <>{t('hero.cta_submit')} <span aria-hidden="true">→</span></>

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <main id="main">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="pt-[clamp(52px,7vw,96px)] pb-[clamp(36px,5vw,60px)]">
          <div className="wrap grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-[clamp(28px,5vw,80px)] items-end max-[900px]:grid-cols-1">
            <Reveal>
              <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
              <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,4rem)] leading-[1.06] tracking-[-0.025em] text-ink mt-4 max-w-[20ch]">
                {t('hero.h1')}
              </h1>
              <p className="text-[clamp(1.05rem,1.5vw,1.22rem)] leading-[1.6] text-ink-soft mt-[22px] max-w-[58ch]">
                {t('hero.lead')}
              </p>
              <div className="flex gap-[14px] flex-wrap mt-[30px]">
                <Button variant="accent" onClick={openForm}>{submitLabel}</Button>
                <Button as="a" href="#summaries" variant="ghost">{t('hero.cta_read')}</Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={`${LABEL_CLS} mb-[14px]`}>{t('hero.how_label')}</p>
              <ol className="flex flex-wrap gap-2.5 items-center text-[0.9rem] text-ink-soft list-none p-0 m-0">
                {steps.map((step, i) => (
                  <li key={step} className="contents">
                    {i > 0 && <span aria-hidden="true" className="text-ink-muted">→</span>}
                    <span className="inline-flex items-center gap-[0.5em] py-[0.45em] px-[0.9em] border border-hairline-2 rounded-pill bg-surface font-medium">
                      <b className="font-display font-semibold text-[var(--accent-ink)]">{i + 1}</b>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="text-ink-muted text-[0.9rem] mt-4">{t('hero.note')}</p>
            </Reveal>
          </div>
        </section>

        {/* ── SUMMARIES LIST + SIDEBAR ──────────────────────── */}
        <section id="summaries" className="bg-bg-alt pt-[clamp(48px,6vw,80px)] pb-[clamp(64px,9vw,124px)] scroll-mt-[72px]">
          <div className="wrap">
            <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-[clamp(32px,5vw,72px)] items-start max-[960px]:grid-cols-1">
              {/* Main list */}
              <div>
                <h2 className="font-display font-semibold text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.02em] text-ink pb-[18px] border-b-2 border-ink">
                  {t('list.h2')}
                </h2>

                {pageItems.length > 0 ? (
                  pageItems.map(it => (
                    <article key={it.id} className="py-[30px] border-b border-hairline">
                      <h3 className="font-display font-semibold text-[clamp(1.25rem,2vw,1.55rem)] leading-[1.28] tracking-[-0.015em] text-ink">
                        <Link to={`/research-summaries/${it.id}`} className="hover:text-[var(--accent-ink)] transition-colors">{it.title}</Link>
                      </h3>
                      <p className="mt-2 mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.84rem] font-semibold text-ink-muted tracking-[0.02em]">
                        <time dateTime={it.date_iso}>{formatEpisodeDate(it.date_iso, i18n.language)}</time>
                        <span aria-hidden="true">·</span>
                        {/* Axis tag: filters the list by this axis, same as the sidebar chips */}
                        <button
                          type="button"
                          onClick={() => { setAxis(it.axis); goToPage(1) }}
                          aria-label={t('list.filter_axis', { axis: axes[it.axis] })}
                          className="inline-flex items-center text-[0.7rem] font-semibold tracking-[0.08em] uppercase py-[0.3em] px-[0.7em] rounded-pill border text-[var(--accent-ink)] bg-[rgba(181,100,24,.08)] border-[rgba(181,100,24,.2)] transition-colors hover:bg-[rgba(181,100,24,.16)] focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
                        >
                          {axes[it.axis]}
                        </button>
                      </p>
                      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-5 items-start max-[520px]:grid-cols-[72px_1fr] max-[520px]:gap-[14px]">
                        <div className="relative aspect-square rounded-md overflow-hidden border border-hairline" aria-hidden="true">
                          <div className="ph"><span className="!text-[0.62rem]">{t('list.image_placeholder')}</span></div>
                        </div>
                        <p className="m-0 text-[0.95rem] text-ink-soft leading-[1.6]">
                          <b className="text-ink font-semibold">{t('list.by')} {it.author}</b>
                          <span className="block mt-1.5 italic text-ink-muted">
                            {t('list.orig_by')} {it.paper_authors}
                          </span>
                          <Link
                            to={`/research-summaries/${it.id}`}
                            className="flex w-fit items-center gap-[0.35em] mt-2 text-[0.9rem] font-semibold text-[var(--link)] group"
                          >
                            {t('list.read_summary')}
                            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                          </Link>
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-ink-muted py-7" role="status">{t('list.empty')}</p>
                )}

                {pageCount > 1 && (
                  <nav aria-label={t('list.pagination_label')} className="flex gap-2 items-center flex-wrap mt-[30px] text-[0.92rem] font-semibold">
                    {current > 1 && (
                      <button type="button" onClick={() => goToPage(current - 1)} className="h-[38px] px-3 rounded-pill grid place-items-center border border-hairline-2 text-ink-soft transition-colors hover:border-ink hover:text-ink">
                        {t('list.prev')}
                      </button>
                    )}
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => goToPage(n)}
                        aria-current={n === current ? 'page' : undefined}
                        className={`min-w-[38px] h-[38px] px-3 rounded-pill grid place-items-center border transition-colors ${
                          n === current ? 'bg-ink text-bg border-ink' : 'border-hairline-2 text-ink-soft hover:border-ink hover:text-ink'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    {current < pageCount && (
                      <button type="button" onClick={() => goToPage(current + 1)} className="h-[38px] px-3 rounded-pill grid place-items-center border border-hairline-2 text-ink-soft transition-colors hover:border-ink hover:text-ink">
                        {t('list.next')}
                      </button>
                    )}
                  </nav>
                )}
              </div>

              {/* Sidebar */}
              <aside className="grid gap-[18px] sticky top-[100px] max-[960px]:static max-[960px]:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                <div className="rounded-lg p-[22px] border bg-ink border-ink dark:bg-surface-2 dark:border-hairline-2">
                  <h3 className="font-display font-semibold text-[1.15rem] text-white dark:text-ink">{t('sidebar.cta_h')}</h3>
                  <p className="text-[0.9rem] text-white/75 dark:text-ink-soft mt-2.5 mb-4">{t('sidebar.cta_body')}</p>
                  <Button variant="accent" size="sm" onClick={openForm}>{submitLabel}</Button>
                  <Link to="/publication-guidelines#research-summaries" className="block mt-[14px] text-[0.84rem] font-semibold text-white/85 hover:text-white dark:text-ink-soft dark:hover:text-ink">
                    {t('sidebar.guide')} <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className={BOX_CLS}>
                  <label htmlFor="rs-search" className={`block ${LABEL_CLS} mb-3`}>{t('sidebar.search_h')}</label>
                  <input
                    id="rs-search"
                    type="search"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setPage(1) }}
                    placeholder={t('sidebar.search_ph')}
                    className="font-sans text-[0.98rem] text-ink w-full py-[0.8em] px-[1em] border border-hairline-2 rounded-md bg-surface transition-[border-color,box-shadow] duration-200 placeholder:text-ink-muted focus:outline-none focus:border-[var(--teal)] focus:shadow-[var(--ring)]"
                  />
                </div>

                <div className={BOX_CLS}>
                  <h4 className={`${LABEL_CLS} mb-3`} id="rs-axes">{t('sidebar.axes_h')}</h4>
                  <div role="group" aria-labelledby="rs-axes" className="flex flex-col gap-1.5">
                    {Object.keys(axes).map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setAxis(key); setPage(1) }}
                        aria-pressed={axis === key}
                        className={`text-left px-[0.9em] py-[0.45em] rounded-sm text-[0.85rem] font-medium border transition-colors focus-visible:outline-none focus-visible:shadow-[var(--ring)] ${
                          axis === key
                            ? 'bg-ink text-bg border-ink'
                            : 'border-hairline-2 text-ink-soft hover:border-ink hover:text-ink'
                        }`}
                      >
                        {axes[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={BOX_CLS}>
                  <h4 className={`${LABEL_CLS} mb-3`}>{t('sidebar.contributors_h')}</h4>
                  <ul className="list-none m-0 p-0 grid gap-2.5">
                    {contributors.map(c => (
                      <li key={c.author} className="flex gap-2.5 items-center text-[0.92rem] font-medium text-ink">
                        <Avatar initials={c.initials} color={c.color} />
                        {c.author}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── CONTRIBUTE ────────────────────────────────────── */}
        <SectionWrapper id="contribute">
          <div className="wrap grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-[clamp(28px,5vw,80px)] items-start max-[900px]:grid-cols-1">
            <Reveal>
              <Eyebrow>{t('contribute.eyebrow')}</Eyebrow>
              <h2 className={`${H2_CLS} mt-[14px]`}>{t('contribute.h2')}</h2>
              <p className="max-w-[60ch] text-ink-soft mt-[14px]">{t('contribute.body')}</p>
              <div className="mt-[26px]">
                <Button variant="accent" onClick={openForm}>{submitLabel}</Button>
              </div>

              <div className={`${BOX_CLS} mt-[30px]`}>
                <p className={LABEL_CLS}>{t('contribute.tpl_label')}</p>
                <p className="mt-2 text-[0.92rem] text-ink-soft">{t('contribute.tpl_body')}</p>
                <ResourceList items={files} className="mt-4" />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className={`${LABEL_CLS} mb-1.5`}>{t('contribute.includes_label')}</p>
              <ul className="list-none m-0 p-0 border-t border-hairline">
                {includes.map(line => (
                  <li key={line} className="grid grid-cols-[28px_1fr] gap-3 py-[14px] border-b border-hairline text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="w-[18px] h-[18px] mt-1 rounded-full border-2 border-sage"
                      style={{ background: 'radial-gradient(circle, var(--sage) 0 3px, transparent 3.5px)' }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </SectionWrapper>

        <Modal
          isOpen={formOpen}
          onClose={closeForm}
          closeLabel={tCommon('close')}
          title={t('form.title')}
          tone="light"
        >
          <SummaryForm onClose={closeForm} />
        </Modal>

      </main>
    </>
  )
}
