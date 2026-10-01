import { useState }       from 'react'
import { Helmet }         from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion }         from 'framer-motion'

import { Eyebrow }        from '@/components/ui/Eyebrow'
import { Button }         from '@/components/ui/Button'
import { Tag }            from '@/components/ui/Tag'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Reveal, revealContainer, revealItem } from '@/components/ui/Reveal'
import { VideoPlayer }    from '@/components/ui/VideoPlayer'
// TODO: hidden pending real episodes — restore along with the EPISODES + FILTERS section below
// import { EpisodeCard }    from '@/components/weekpaper/EpisodeCard'
import { Modal }          from '@/components/ui/Modal'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { NewsletterPerks } from '@/components/ui/NewsletterPerks'
import { SOCIAL_LINKS }   from '@/constants'
import { formatEpisodeDate, formatRelativeEpisodeDate } from '@/lib/formatDate'
import type { TagVariant } from '@/types/course'

// TODO: hidden pending real episodes — restore along with the EPISODES + FILTERS section below
// type FilterKey = 'all' | 'ai' | 'respai' | 'se' | 'cloud' | 'sec'
//
// type EpisodeItem = {
//   no: string
//   topic: string
//   tagVariant: string
//   tag: string
//   title: string
//   date_iso: string
//   duration: string
//   video_url: string
// }

type PlaylistItem = {
  label: string
  title: string
  count: string
  duration: string
  icon: string
}

export default function WeekPaperPage() {
  const { t, i18n } = useTranslation('weekpaper')
  const { t: tCommon } = useTranslation('common')
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  // TODO: hidden pending real episodes — restore along with the EPISODES + FILTERS section below
  // const [filter, setFilter] = useState<FilterKey>('all')
  // const episodes  = t('episodes.items',   { returnObjects: true }) as EpisodeItem[]
  // const filters   = t('filters',          { returnObjects: true }) as Record<string, string>
  // const visible = episodes.filter(ep => filter === 'all' || ep.topic === filter)
  const playlists = t('playlists.items',  { returnObjects: true }) as PlaylistItem[]

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
                  <Tag variant={t('featured.tagVariant') as TagVariant}>{t('featured.tag')}</Tag>
                </div>
                <h2 className="font-display font-semibold text-[clamp(1.5rem,2.4vw,2.1rem)] tracking-[-0.02em] text-ink m-0">
                  {t('featured.title')}
                </h2>
                <p className="text-ink-soft text-base leading-[1.6] m-0">{t('featured.body')}</p>
                <time
                  dateTime={t('featured.date_iso')}
                  title={formatEpisodeDate(t('featured.date_iso'), i18n.language)}
                  className="text-ink-muted text-[0.85rem]"
                >
                  {t('featured.date_prefix')} {formatRelativeEpisodeDate(t('featured.date_iso'), i18n.language)}
                </time>
                <div className="pt-1">
                  <Button as="a" href={t('featured.video_url')} target="_blank" rel="noopener noreferrer" variant="accent">
                    {t('featured.cta')} <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

        {/* TODO: EPISODES + FILTERS hidden pending real episodes to list — `episodes.items` in
            weekpaper.json is placeholder data. Restore this section (and the episodes/filters
            hooks, EpisodeCard import, and FilterKey/EpisodeItem types above) once real episodes exist.
        <SectionWrapper alt id="episodes">
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(28px,3.5vw,44px)]">
              <div>
                <Eyebrow>{t('episodes.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('episodes.h2')}
                </h2>
              </div>

              {/* Filter chips *}
              <div role="group" aria-label="Filtres par thème" className="flex flex-wrap gap-2">
                {(Object.keys(filters) as FilterKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
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

            {visible.length > 0 ? (
              <motion.div
                key={filter}
                className="grid grid-cols-3 gap-[clamp(18px,2.5vw,32px)] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
                variants={revealContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-8% 0px' }}
              >
                {visible.map(ep => (
                  <motion.div key={ep.no} variants={revealItem}>
                    <EpisodeCard
                      no={ep.no}
                      tag={ep.tag}
                      tagVariant={ep.tagVariant as TagVariant}
                      title={ep.title}
                      date={formatRelativeEpisodeDate(ep.date_iso, i18n.language)}
                      duration={ep.duration}
                      videoUrl={ep.video_url}
                      playLabel={t('episodes.play_label')}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-ink-muted mt-6">{t('episodes.empty')}</p>
            )}
          </div>
        </SectionWrapper>
        */}

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
                        <img src={pl.icon} alt={pl.label} width={32} height={32} loading="lazy" />
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
                    <Button as="button" onClick={() => setNewsletterOpen(true)} variant="ghost-dark">
                      {t('subscribe.btn_email')}
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

        <Modal
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          closeLabel={tCommon('close')}
          title={t('subscribe.h2')}
        >
          <NewsletterPerks />
          <NewsletterForm />
        </Modal>

      </main>
    </>
  )
}
