import { Helmet }         from 'react-helmet-async'
import { useTranslation }  from 'react-i18next'
import { motion }          from 'framer-motion'
import { Link }            from 'react-router-dom'

import { NetworkArt }     from '@/components/brand/NetworkArt'
import { Button }         from '@/components/ui/Button'
import { Eyebrow }        from '@/components/ui/Eyebrow'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Tag }            from '@/components/ui/Tag'
import { VideoPlayer }    from '@/components/ui/VideoPlayer'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { NewsletterPerks } from '@/components/ui/NewsletterPerks'
import { useOpenNewsletter } from '@/components/newsletter/NewsletterProvider'
import { MailIcon } from '@/components/ui/icons'
import { Reveal, revealContainer, revealItem } from '@/components/ui/Reveal'
import { SOCIAL_LINKS, publicUrl } from '@/constants'
import type { TagVariant }  from '@/types/course'

type Metric     = { value: string; label: string; caption: string; color: string }
type NewsItem   = { tag: string; tagVariant: string; date: string; title: string; excerpt: string; link: string; url?: string; icon?: string }
type Area       = { no: string; title: string; desc: string }
// TODO: hidden pending the dedicated Research page — restore along with the FEATURED PAPERS section below, or move there instead
// type Paper      = { tag: string; tagVariant: string; venue: string; title: string; excerpt: string; link: string }
// TODO: hidden pending confirmed partnerships — restore along with the PARTNERS section below
// type LogoCat    = { label: string; logos: { name: string; logo: string }[] }

function NewsLink({ url, className, children }: { url?: string; className: string; children: React.ReactNode }) {
  if (!url) return <a href="#" className={className}>{children}</a>
  if (url.startsWith('/')) return <Link to={url} className={className}>{children}</Link>
  return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
}

function SectionHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Reveal className={`flex items-end justify-between gap-6 flex-wrap mb-[clamp(32px,4vw,52px)] ${className}`}>
      {children}
    </Reveal>
  )
}

export default function HomePage() {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const openNewsletter = useOpenNewsletter()

  const metrics   = t('metrics', { returnObjects: true }) as Metric[]
  const newsItems = t('news.items', { returnObjects: true }) as NewsItem[]
  const areas     = t('research.areas', { returnObjects: true }) as Area[]
  // TODO: hidden pending the dedicated Research page — restore along with the FEATURED PAPERS section below, or move there instead
  // const papers    = t('research.papers', { returnObjects: true }) as Paper[]
  // TODO: hidden pending confirmed partnerships — restore along with the PARTNERS section below
  // const partnerCats = t('partners.categories', { returnObjects: true }) as LogoCat[]

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <main id="main">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section>
          <div className="wrap grid grid-cols-[1.1fr_0.9fr] gap-[clamp(28px,4vw,60px)] items-center py-[clamp(56px,8vw,100px)] max-[960px]:grid-cols-1">
            <div>
              <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
              <h1 className="font-display font-semibold text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.02] tracking-[-0.03em] text-ink mt-4 max-w-[15ch]">
                {t('hero.h1_before')}
              </h1>
              <p className="text-[clamp(1.1rem,1.6vw,1.32rem)] leading-[1.55] text-ink-soft font-normal mt-[22px] max-w-[52ch]">
                {t('hero.lead')}
              </p>
              <div className="flex gap-[14px] flex-wrap mt-8">
                <Button as="a" href="#research" variant="accent">
                  {t('hero.cta_research')} <span aria-hidden="true">→</span>
                </Button>
                {/* Filled so it isn't skipped; teal + mail icon keep it distinct from the main copper CTA */}
                <Button as="button" variant="teal" onClick={openNewsletter}>
                  <MailIcon /> {tCommon('newsletter.cta')}
                </Button>
                {/* TODO: restore training CTA once the page ships */}
              </div>
            </div>

            {/* Right: network art */}
            <div>
              <NetworkArt />
            </div>
          </div>

          {/* Metrics bar */}
          <div className="wrap">
            <motion.div
              className="grid grid-cols-4 gap-[clamp(12px,2vw,28px)] border-t border-hairline pt-[clamp(28px,3vw,40px)] pb-[clamp(28px,3vw,40px)] max-[760px]:grid-cols-2 max-[460px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {metrics.map((m, i) => (
                <motion.div key={i} variants={revealItem} className="flex flex-col gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: m.color }} aria-hidden="true" />
                  <strong className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-none text-ink mt-1">{m.value}</strong>
                  <span className="text-ink text-[0.9rem] font-medium leading-snug">{m.label}</span>
                  <span className="text-ink-muted text-[0.78rem] leading-snug">{m.caption}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── VISION VIDEO ──────────────────────────────────── */}
        <SectionWrapper alt id="vision">
          <div className="wrap">
            <Reveal className="max-w-[62ch] mb-[clamp(28px,3vw,40px)]">
              <Eyebrow>{t('vision.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                {t('vision.h2')}
              </h2>
              <p className="text-ink-soft text-base mt-4 m-0">{t('vision.lead')}</p>
            </Reveal>
            <Reveal>
              <VideoPlayer
                label={t('vision.video_label')}
                url={t('vision.video_url')}
                placeholder={tCommon('video_placeholder')}
                gradient
              />
            </Reveal>
            {/* Subscribe strip: right after the video, where interest is highest */}
            <Reveal className="mt-[clamp(28px,3vw,40px)] pt-[clamp(22px,2.5vw,32px)] border-t border-hairline grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-[clamp(20px,3vw,48px)] gap-y-3 items-start max-[860px]:grid-cols-1">
              <p className="font-display font-semibold text-[clamp(1.15rem,1.8vw,1.4rem)] leading-[1.3] tracking-[-0.01em] text-ink m-0 mt-2 max-w-[30ch]">
                {t('newsletter.strip')}
              </p>
              <NewsletterForm tone="light" />
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ── NEWS & EVENTS ─────────────────────────────────── */}
        <SectionWrapper id="news">
          <div className="wrap">
            <SectionHead>
              <div>
                <Eyebrow>{t('news.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('news.h2')}
                </h2>
              </div>
              {/* TODO: "All news" link hidden pending a dedicated news/archive page — no
                  accurate destination exists yet. Restore with `t('news.link_all')` once it ships.
              <a href="#" className="inline-flex items-center gap-[0.45em] font-semibold text-[var(--link)] text-[0.98rem] group">
                {t('news.link_all')} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              */}
            </SectionHead>

            <motion.div
              className="grid grid-cols-3 gap-[clamp(20px,2.4vw,32px)] max-[900px]:grid-cols-2 max-[580px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {newsItems.map((item, i) => (
                <motion.article
                  key={i}
                  variants={revealItem}
                  className="flex flex-col rounded-lg border border-hairline bg-surface overflow-hidden"
                >
                  <div className="aspect-[16/9] relative">
                    <div className="ph" style={{ position: 'absolute', inset: 0 }}>
                      {item.icon && (
                        <div className="w-16 h-16 rounded-full bg-white/92 grid place-items-center shadow-lg">
                          <img src={publicUrl(item.icon)} alt="" width={32} height={32} loading="lazy" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-[clamp(16px,2vw,22px)] flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag variant={item.tagVariant as TagVariant}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1" aria-hidden="true" />
                        {item.tag}
                      </Tag>
                      <time className="text-[0.82rem] text-ink-muted">{item.date}</time>
                    </div>
                    <h3 className="font-display font-semibold text-[1.05rem] text-ink leading-[1.3] m-0">
                      <NewsLink url={item.url} className="hover:text-[var(--link)] transition-colors">{item.title}</NewsLink>
                    </h3>
                    <p className="text-ink-soft text-[0.9rem] leading-[1.55] m-0 flex-1">{item.excerpt}</p>
                    <NewsLink url={item.url} className="inline-flex items-center gap-1 text-[var(--link)] text-[0.88rem] font-semibold group mt-auto">
                      {item.link} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </NewsLink>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ── RESEARCH ──────────────────────────────────────── */}
        <SectionWrapper id="research">
          <div className="wrap">
            <Reveal className="mb-[clamp(32px,4vw,52px)]">
              <Eyebrow>{t('research.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                {t('research.h2_l1')}<br />{t('research.h2_l2')}
              </h2>
              <p className="text-ink-soft text-base max-w-[44ch] mt-3">{t('research.lead')}</p>
            </Reveal>

            {/* Research area rows */}
            <Reveal>
              {areas.map(area => (
                <a
                  key={area.no}
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 border-b border-hairline py-[18px] group hover:text-[var(--accent-ink)] transition-colors"
                >
                  <span className="font-mono text-[0.78rem] text-ink-muted w-7 flex-shrink-0 pt-0.5">{area.no}</span>
                  <span className="flex-1">
                    <span className="font-display font-semibold text-[1.08rem] text-ink block group-hover:text-[var(--accent-ink)] transition-colors leading-snug">{area.title}</span>
                    <span className="text-ink-soft text-[0.88rem] leading-[1.5]">{area.desc}</span>
                  </span>
                  <span aria-hidden="true" className="text-ink-muted transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0 mt-0.5">→</span>
                </a>
              ))}
            </Reveal>

            {/* TODO: FEATURED PAPERS hidden pending the dedicated Research page — restore here
                (and the `papers`/`Paper` hook and type above) or move this content there instead.
            <motion.div
              className="grid grid-cols-2 gap-[clamp(20px,2.4vw,32px)] mt-[clamp(40px,5vw,64px)] max-[640px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {papers.map((paper, i) => (
                <motion.article
                  key={i}
                  variants={revealItem}
                  className="p-[clamp(20px,2.5vw,28px)] rounded-lg border border-hairline bg-surface flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag variant={paper.tagVariant as TagVariant}>{paper.tag}</Tag>
                    <span className="text-[0.82rem] text-ink-muted">{paper.venue}</span>
                  </div>
                  <h3 className="font-display font-semibold text-[1.05rem] text-ink leading-[1.3] m-0">
                    <a href="#" className="hover:text-[var(--link)] transition-colors">{paper.title}</a>
                  </h3>
                  <p className="text-ink-soft text-[0.9rem] leading-[1.55] m-0 flex-1">{paper.excerpt}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[var(--link)] text-[0.88rem] font-semibold group mt-auto">
                    {paper.link} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                </motion.article>
              ))}
            </motion.div>
            */}
          </div>
        </SectionWrapper>

        {/* TODO: Training preview section — restore once the Training page ships */}

        {/* ── PARTNERS ──────────────────────────────────────── */}
        {/* TODO: hidden pending confirmed partnerships — restore once real logos/agreements are in.
            Also make logos link to each partner's homepage (target="_blank" rel="noopener")
            once real partnerships are confirmed — see D-11. Add pause-on-focus to
            .logo-marquee alongside pause-on-hover, since the logos become keyboard-focusable
            links (WCAG 2.2.2 requires a way to pause auto-moving content).
        <SectionWrapper id="partners">
          <div className="wrap">
            <SectionHead>
              <div>
                <Eyebrow>{t('partners.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('partners.h2')}
                </h2>
              </div>
            </SectionHead>

            <Reveal className="flex flex-col gap-[32px]">
              {partnerCats.map(cat => (
                <div key={cat.label}>
                  <h3 className="font-sans text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink-muted mb-[14px]">{cat.label}</h3>
                  <div className="logo-marquee">
                    <div className="logo-marquee__viewport">
                      {[cat.logos, cat.logos].map((set, i) => (
                        <div
                          key={i}
                          className={`flex gap-[12px] pr-[12px] ${i === 1 ? 'logo-marquee__dup' : ''}`}
                          aria-hidden={i === 1 || undefined}
                        >
                          {set.map(logo => (
                            <div
                              key={logo.name}
                              className="flex items-center justify-center w-[180px] h-[88px] flex-shrink-0 border border-hairline rounded-lg px-5 py-6 bg-white"
                            >
                              <img
                                src={logo.logo}
                                alt={logo.name}
                                loading="lazy"
                                className="max-h-9 max-w-[85%] object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </SectionWrapper>
        */}

        {/* ── NEWSLETTER ────────────────────────────────────── */}
        <SectionWrapper spacing="tight" id="contact">
          <div className="wrap">
            <Reveal>
              <div className="rounded-xl bg-[var(--card-dark)] p-[clamp(32px,5vw,64px)] text-white">
                <p className="font-sans text-[0.76rem] font-semibold tracking-[0.16em] uppercase text-[var(--copper-bright)] m-0 mb-[14px]">
                  {t('newsletter.eyebrow')}
                </p>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-white mt-0 mb-[14px]">
                  {t('newsletter.h2')}
                </h2>
                <NewsletterPerks />
                <NewsletterForm />
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

      </main>
    </>
  )
}
