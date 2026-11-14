import { useCallback, useEffect, useState } from 'react'
import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion }         from 'framer-motion'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'
import { Tag, TopicTag }  from '@/components/ui/Tag'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Reveal, revealContainer, revealItem } from '@/components/ui/Reveal'
import { VideoPlayer }    from '@/components/ui/VideoPlayer'
import { DateWithTooltip } from '@/components/ui/DateWithTooltip'
import { EpisodeCard }    from '@/components/weekpaper/EpisodeCard'
import { Modal }          from '@/components/ui/Modal'
import { useOpenNewsletter } from '@/components/newsletter/NewsletterProvider'
import { PresentationForm } from '@/components/weekpaper/PresentationForm'
import { SOCIAL_LINKS, publicUrl } from '@/constants'
import { ResourceList, type ResourceItem } from '@/components/guides/ResourceList'
import { formatEpisodeDate, formatRelativeEpisodeDate } from '@/lib/formatDate'
import { useHydrated } from '@/hooks/useHydrated'
import { Pagination }     from '@/components/ui/Pagination'
import type { Topic } from '@/constants'

type EpisodeItem = {
  no: string
  topic: Topic
  tag: string
  title: string
  date_iso: string
  duration: string
  video_url: string
}

type FormatItem   = { label: string; value: string }
type StepItem     = { title: string; desc: string }

type PlaylistItem = {
  label: string
  title: string
  count: string
  duration: string
  icon: string
}

// Episodes listed in the grid, newest first. Older ones stay in weekpaper.json so their
// links (/week-paper#ep-3, from past newsletter emails) still open them, as an archive box.
const MAX_EPISODES = 10

// Columns of the episode grid at each width; keep in sync with its grid-cols classes below
const EPISODE_COLUMNS: [query: string, columns: number][] = [['(max-width: 560px)', 1], ['(max-width: 900px)', 2]]

/** Columns the episode grid shows right now. 3 during prerender and hydration (see useHydrated);
 *  `ready` once the real value for this screen is known. */
function useEpisodeColumns(): { columns: number; ready: boolean } {
  const hydrated = useHydrated()
  const read = () => EPISODE_COLUMNS.find(([q]) => window.matchMedia(q).matches)?.[1] ?? 3
  const [columns, setColumns] = useState(3)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!hydrated) return
    setColumns(read())
    setReady(true)
    const mqls = EPISODE_COLUMNS.map(([q]) => window.matchMedia(q))
    const onChange = () => setColumns(read())
    mqls.forEach(m => m.addEventListener('change', onChange))
    return () => mqls.forEach(m => m.removeEventListener('change', onChange))
  }, [hydrated])
  return { columns, ready }
}

/** Address of one episode on this page: /week-paper#ep-7. Newsletter emails link here (episodeAnchor in functions/_lib/newsletter.ts). */
export function episodeAnchor(no: string): string {
  return `ep-${Number(no.match(/\d+/)?.[0] ?? 0)}`
}

export default function WeekPaperPage() {
  const { t, i18n } = useTranslation('weekpaper')
  // "il y a 3 jours" depends on today's date: the prerendered HTML (and so the hydration
  // render) shows the fixed date, the relative one replaces it right after (useHydrated).
  const hydrated = useHydrated()
  const airDate = (iso: string) => hydrated ? formatRelativeEpisodeDate(iso, i18n.language) : formatEpisodeDate(iso, i18n.language)
  const { t: tCommon } = useTranslation('common')
  const openNewsletter = useOpenNewsletter()
  const [submitOpen, setSubmitOpen] = useState(false)
  // Stable identity: Modal's focus-trap effect depends on onClose
  const closeSubmit = useCallback(() => setSubmitOpen(false), [])

  // Filter keys come from `filters` in weekpaper.json ('all' plus one per episode topic)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const episodes  = t('episodes.items',   { returnObjects: true }) as EpisodeItem[]
  const filters   = t('filters',          { returnObjects: true }) as Record<string, string>
  const recent  = episodes.slice(0, MAX_EPISODES)
  const visible = recent.filter(ep => filter === 'all' || ep.topic === filter)
  // Only topics that have a listed episode get a filter chip
  const filterKeys = Object.keys(filters).filter(key => key === 'all' || recent.some(ep => ep.topic === key))
  // Two rows of the grid per page: 3 columns → 6 episodes, 2 → 4, 1 → 2 (see EPISODE_COLUMNS)
  const { columns, ready: columnsReady } = useEpisodeColumns()
  const pageSize = columns * 2
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const current = Math.min(page, pageCount)
  const pageEpisodes = visible.slice((current - 1) * pageSize, current * pageSize)
  const card = (ep: EpisodeItem) => (
    <EpisodeCard
      no={ep.no}
      tag={ep.tag}
      topic={ep.topic}
      title={ep.title}
      date={airDate(ep.date_iso)}
      dateIso={ep.date_iso}
      dateFull={formatEpisodeDate(ep.date_iso, i18n.language)}
      duration={ep.duration}
      videoUrl={ep.video_url}
      playLabel={t('episodes.play_label')}
      placeholder={tCommon('video_placeholder')}
    />
  )
  function goToPage(n: number) {
    setPage(n)
    document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Link to one episode (/week-paper#ep-7, used by the newsletter): show all episodes, open the
  // page of the grid that holds it, scroll to its card and highlight it.
  const [target, setTarget] = useState<string | null>(null)
  const [pendingScroll, setPendingScroll] = useState(false)
  useEffect(() => {
    const readHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!/^ep-\d+$/.test(id)) return
      setTarget(id); setFilter('all'); setPendingScroll(true)
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])
  useEffect(() => {
    if (!target || !columnsReady) return
    const i = recent.findIndex(ep => episodeAnchor(ep.no) === target)
    if (i >= 0) setPage(Math.floor(i / pageSize) + 1)
    // Only when a link is followed or the page size changes, so the reader can still change page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, columnsReady, pageSize])
  const archived = target && !recent.some(ep => episodeAnchor(ep.no) === target)
    ? episodes.find(ep => episodeAnchor(ep.no) === target) ?? null
    : null
  function leaveArchive() {
    setTarget(null)
    // Drop #ep-N from the address, so a reload shows the recent episodes
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  useEffect(() => {
    if (!pendingScroll || !columnsReady || !target) return
    const el = document.getElementById(target)
    if (!el) return
    el.scrollIntoView({ block: 'center' })
    setPendingScroll(false)
  }, [pendingScroll, columnsReady, target, current])
  const playlists = t('playlists.items',  { returnObjects: true }) as PlaylistItem[]
  const format    = t('contribute.format',    { returnObjects: true }) as FormatItem[]
  const structure = t('contribute.structure', { returnObjects: true }) as StepItem[]
  const resources = t('contribute.resources', { returnObjects: true }) as ResourceItem[]

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <main id="main">

        {/* ── FEATURED HERO ─────────────────────────────────── */}
        <SectionWrapper spacing="tight">
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-7">
              <div>
                <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
                <h1 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('hero.h1')}
                </h1>
              </div>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[0.45em] font-semibold text-[var(--link)] text-[0.98rem] group">
                {t('hero.link_youtube')} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>

            <Reveal className="grid grid-cols-[1fr_1fr] gap-[clamp(28px,4vw,56px)] items-start max-[840px]:grid-cols-1">
              <VideoPlayer
                label={t('featured.video_label')}
                url={t('featured.video_url')}
                duration={t('featured.duration')}
                placeholder={tCommon('video_placeholder')}
                gradient
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag variant="copper">{t('featured.ep')}</Tag>
                  <TopicTag topic={t('featured.topic') as Topic}>{t('featured.tag')}</TopicTag>
                </div>
                <h2 className="font-display font-semibold text-[clamp(1.5rem,2.4vw,2.1rem)] tracking-[-0.02em] text-ink m-0">
                  {t('featured.title')}
                </h2>
                <p className="text-ink-soft text-base leading-[1.6] m-0">{t('featured.body')}</p>
                <DateWithTooltip
                  dateTime={t('featured.date_iso')}
                  full={formatEpisodeDate(t('featured.date_iso'), i18n.language)}
                  className="text-ink-muted text-[0.85rem] self-start"
                >
                  {t('featured.date_prefix')} {airDate(t('featured.date_iso'))}
                </DateWithTooltip>
                <div className="pt-1">
                  <Button as="a" href={t('featured.video_url')} target="_blank" rel="noopener noreferrer" variant="accent">
                    {t('featured.cta')} <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ── EPISODES + FILTERS ────────────────────────────── */}
        <SectionWrapper alt id="episodes">
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(28px,3.5vw,44px)]">
              <div>
                <Eyebrow>{t('episodes.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('episodes.h2')}
                </h2>
              </div>

              {/* Filter chips */}
              <div role="group" aria-label={t('episodes.filters_label')} className="flex flex-wrap gap-2">
                {filterKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => { setFilter(key); setPage(1); setTarget(null) }}
                    aria-pressed={filter === key}
                    className={`px-[0.9em] py-[0.45em] rounded-pill text-[0.85rem] font-medium border transition-colors ${
                      filter === key
                        ? 'bg-ink text-bg border-ink'
                        : 'border-hairline-2 text-ink-soft hover:border-ink-soft'
                    }`}
                  >
                    {filters[key]}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* A link to an episode no longer listed (/week-paper#ep-3) shows it here, outlined */}
            {archived && (
              <div id={episodeAnchor(archived.no)} className="mb-[clamp(28px,3vw,40px)] p-[clamp(18px,2.5vw,28px)] rounded-xl border border-hairline bg-surface scroll-mt-[96px] outline outline-2 outline-offset-4 outline-[var(--accent)]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-[18px]">
                  <p className="m-0 text-[0.76rem] font-bold tracking-[0.13em] uppercase text-[var(--accent-ink)]">{t('episodes.archive_label')}</p>
                  <button type="button" onClick={leaveArchive} className="text-[0.88rem] font-semibold text-[var(--link)] hover:underline">
                    {t('episodes.archive_back')} <span aria-hidden="true">↓</span>
                  </button>
                </div>
                <div className="max-w-[420px]">{card(archived)}</div>
              </div>
            )}

            {visible.length > 0 ? (
              <motion.div
                key={`${filter}-${current}`}
                className="grid grid-cols-3 auto-rows-fr gap-[clamp(18px,2.5vw,32px)] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
                variants={revealContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-8% 0px' }}
              >
                {pageEpisodes.map(ep => (
                  <motion.div
                    key={ep.no}
                    id={episodeAnchor(ep.no)}
                    variants={revealItem}
                    className={`h-full rounded-lg scroll-mt-[96px] ${episodeAnchor(ep.no) === target ? 'outline outline-2 outline-offset-4 outline-[var(--accent)]' : ''}`}
                  >
                    {card(ep)}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-ink-muted mt-6">{t('episodes.empty')}</p>
            )}

            <Pagination
              page={current}
              pageCount={pageCount}
              onChange={goToPage}
              labels={{ nav: t('episodes.pagination_label'), prev: t('episodes.prev'), next: t('episodes.next') }}
              className="mt-[clamp(28px,3vw,40px)]"
            />
          </div>
        </SectionWrapper>

        {/* ── PLAYLISTS ─────────────────────────────────────── */}
        <SectionWrapper>
          <div className="wrap">
            <Reveal className="mb-[clamp(32px,4vw,52px)]">
              <Eyebrow>{t('playlists.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                {t('playlists.h2')}
              </h2>
            </Reveal>

            <motion.div
              className="grid grid-cols-3 gap-[clamp(18px,2.5vw,32px)] max-[800px]:grid-cols-2 max-[520px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {playlists.map((pl, i) => (
                <motion.article
                  key={i}
                  variants={revealItem}
                  className="flex flex-col rounded-lg border border-hairline bg-surface overflow-hidden"
                >
                  <div className="aspect-[16/9] relative">
                    <div className="ph" style={{ position: 'absolute', inset: 0 }}>
                      <div className="w-16 h-16 rounded-full bg-white/92 grid place-items-center shadow-lg">
                        <img src={publicUrl(pl.icon)} alt={pl.label} width={32} height={32} loading="lazy" />
                      </div>
                    </div>
                  </div>
                  <div className="p-[clamp(16px,2vw,22px)] flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-semibold text-[1.05rem] text-ink leading-[1.3] m-0">{pl.title}</h3>
                    <p className="text-ink-muted text-[0.85rem] m-0">{pl.count} · {pl.duration}</p>
                    <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--link)] text-[0.88rem] font-semibold group mt-auto">
                      {t('playlists.link')} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ── CONTRIBUTE ────────────────────────────────────── */}
        <SectionWrapper alt id="contribute">
          <div className="wrap">
            <Reveal className="mb-[clamp(28px,3.5vw,44px)]">
              <Eyebrow>{t('contribute.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-[14px]">
                {t('contribute.h2')}
              </h2>
              <p className="max-w-[60ch] text-ink-soft mt-[14px]">{t('contribute.body')}</p>
            </Reveal>

            <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] gap-[clamp(28px,4vw,56px)] items-start max-[960px]:grid-cols-1">
              <Reveal>
                <dl className="grid grid-cols-3 border border-hairline rounded-lg bg-surface overflow-hidden m-0 max-[520px]:grid-cols-1">
                  {format.map(f => (
                    <div key={f.label} className="py-4 px-[18px] border-r border-hairline last:border-r-0 max-[520px]:border-r-0 max-[520px]:border-b max-[520px]:last:border-b-0">
                      <dt className="text-[0.68rem] font-bold tracking-[0.13em] uppercase text-ink-muted">{f.label}</dt>
                      <dd className="m-0 mt-1 font-display font-semibold text-[1.08rem] text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted mt-7 mb-1.5">{t('contribute.structure_label')}</p>
                <ol className="list-none m-0 p-0 border-t border-hairline">
                  {structure.map((step, i) => (
                    <li key={step.title} className="grid grid-cols-[48px_1fr] gap-[14px] py-4 border-b border-hairline">
                      <span className="font-display font-semibold text-[0.86rem] text-[var(--accent-ink)] pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <b className="font-display font-semibold text-[1.04rem] text-ink">{step.title}</b>
                        <p className="mt-1 text-[0.92rem] text-ink-soft">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={0.1} className="grid gap-[18px] sticky top-[100px] max-[960px]:static">
                <div className="bg-surface border border-hairline rounded-lg p-[22px]">
                  <p className="text-[0.72rem] font-bold tracking-[0.13em] uppercase text-ink-muted">{t('contribute.resources_label')}</p>
                  <ResourceList items={resources} className="mt-4" />
                </div>
                <div className="rounded-lg p-[22px] border bg-ink border-ink dark:bg-surface-2 dark:border-hairline-2">
                  <h3 className="font-display font-semibold text-[1.15rem] text-white dark:text-ink">{t('contribute.cta_h')}</h3>
                  <p className="text-[0.9rem] text-white/75 dark:text-ink-soft mt-2.5 mb-4">{t('contribute.cta_body')}</p>
                  <Button variant="accent" size="sm" onClick={() => setSubmitOpen(true)}>
                    {t('contribute.cta')} <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        {/* ── SUBSCRIBE ─────────────────────────────────────── */}
        <SectionWrapper spacing="tight" id="subscribe">
          <div className="wrap">
            <Reveal>
              <div className="rounded-xl bg-[var(--card-dark)] p-[clamp(32px,5vw,64px)] text-white">
                <div className="grid grid-cols-[1fr_auto] gap-[clamp(24px,4vw,56px)] items-center max-[700px]:grid-cols-1">
                  <div>
                    <p className="font-sans text-[0.76rem] font-semibold tracking-[0.16em] uppercase text-[var(--copper-bright)] m-0 mb-[14px]">
                      {t('subscribe.eyebrow')}
                    </p>
                    <h2 className="font-display font-semibold text-[clamp(1.9rem,3.2vw,2.6rem)] tracking-[-0.02em] text-white mt-0 mb-[14px]">
                      {t('subscribe.h2')}
                    </h2>
                    <p className="text-white/70 text-base m-0 max-w-[46ch]">{t('subscribe.lead')}</p>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[200px] max-[700px]:flex-row max-[700px]:flex-wrap">
                    <Button as="a" href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" variant="accent">
                      {t('subscribe.btn_youtube')}
                    </Button>
                    <Button as="button" onClick={openNewsletter} variant="ghost-dark">
                      {t('subscribe.btn_email')}
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

        <Modal
          isOpen={submitOpen}
          onClose={closeSubmit}
          closeLabel={tCommon('close')}
          title={t('submit.title')}
          tone="light"
        >
          <PresentationForm onClose={closeSubmit} />
        </Modal>

      </main>
    </>
  )
}
