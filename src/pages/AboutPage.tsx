import { Helmet }         from 'react-helmet-async'
import { useTranslation }  from 'react-i18next'
import { motion }          from 'framer-motion'

import { PageHero }       from '@/components/ui/PageHero'
import { Button }         from '@/components/ui/Button'
import { Eyebrow }        from '@/components/ui/Eyebrow'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Reveal, revealContainer, revealItem } from '@/components/ui/Reveal'
import { publicUrl }      from '@/constants'

type Value   = { title: string; body: string }
type Pillar  = { no: string; title: string; body: string; icon: string }

export default function AboutPage() {
  const { t } = useTranslation('about')

  const values  = t('values.items',  { returnObjects: true }) as Value[]
  const pillars = t('pillars.items', { returnObjects: true }) as Pillar[]

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <main id="main">

        {/* ── HERO ──────────────────────────────────────────── */}
        <PageHero
          eyebrow={t('hero.eyebrow')}
          h1={t('hero.h1')}
          lead={t('hero.lead')}
        />

        {/* ── MISSION / VISION ──────────────────────────────── */}
        <SectionWrapper alt>
          <div className="wrap grid grid-cols-2 gap-[clamp(32px,5vw,72px)] max-[700px]:grid-cols-1">
            <Reveal>
              <Eyebrow>{t('mv.mission.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.7rem,2.8vw,2.3rem)] tracking-[-0.02em] text-ink mt-3">
                {t('mv.mission.h2')}
              </h2>
              <p className="text-ink-soft text-base leading-[1.6] mt-4 m-0">{t('mv.mission.lead')}</p>
            </Reveal>
            <Reveal>
              <Eyebrow>{t('mv.vision.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.7rem,2.8vw,2.3rem)] tracking-[-0.02em] text-ink mt-3">
                {t('mv.vision.h2')}
              </h2>
              <p className="text-ink-soft text-base leading-[1.6] mt-4 m-0">{t('mv.vision.lead')}</p>
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ── VALUES ────────────────────────────────────────── */}
        <SectionWrapper>
          <div className="wrap">
            <Reveal className="mb-[clamp(32px,4vw,52px)]">
              <Eyebrow>{t('values.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                {t('values.h2')}
              </h2>
            </Reveal>

            <Reveal>
              {values.map(v => (
                <div key={v.title} className="flex gap-[clamp(20px,3vw,40px)] py-[clamp(18px,2.5vw,28px)] border-t border-hairline max-[640px]:flex-col">
                  <h3 className="font-display font-semibold text-[1.1rem] text-ink min-w-[180px] max-w-[220px] m-0 leading-snug max-[640px]:max-w-none">
                    {v.title}
                  </h3>
                  <p className="text-ink-soft text-base leading-[1.6] m-0 flex-1">{v.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ── STRATEGIC PILLARS ─────────────────────────────── */}
        <SectionWrapper alt>
          <div className="wrap">
            <Reveal className="mb-[clamp(32px,4vw,52px)]">
              <Eyebrow>{t('pillars.eyebrow')}</Eyebrow>
              <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                {t('pillars.h2')}
              </h2>
              <p className="text-ink-soft text-base max-w-[44ch] mt-3">{t('pillars.lead')}</p>
            </Reveal>

            <motion.div
              className="grid grid-cols-4 gap-[clamp(18px,2.5vw,32px)] max-[900px]:grid-cols-2 max-[500px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {pillars.map(p => (
                <motion.div key={p.no} variants={revealItem} className="flex flex-col items-center gap-3 text-center">
                  <img src={publicUrl(p.icon)} alt="" width={32} height={32} loading="lazy" />
                  <span className="font-mono text-[0.72rem] text-ink-muted">{p.no}</span>
                  <h3 className="font-display font-semibold text-[1.05rem] text-ink m-0">{p.title}</h3>
                  <p className="text-ink-soft text-[0.9rem] leading-[1.55] m-0">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionWrapper>

        {/* TODO: History timeline — add real milestones and restore this section */}

        {/* ── JOIN CTA ──────────────────────────────────────── */}
        <SectionWrapper spacing="tight">
          <div className="wrap">
            <Reveal>
              <div className="rounded-xl bg-[var(--card-dark)] p-[clamp(32px,5vw,64px)] text-white">
                <p className="font-sans text-[0.76rem] font-semibold tracking-[0.16em] uppercase text-[var(--copper-bright)] m-0 mb-[14px]">
                  {t('cta.eyebrow')}
                </p>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-white mt-0 mb-[14px]">
                  {t('cta.h2')}
                </h2>
                <p className="text-white/70 text-base m-0 mb-8 max-w-[52ch]">{t('cta.body')}</p>
                <div className="flex gap-4 flex-wrap">
                  <Button as="link" to="/contact?subject=other" variant="accent">
                    {t('cta.btn_contact')} <span aria-hidden="true">→</span>
                  </Button>
                  {/* TODO: "See open positions" button — restore once the positions page is built */}
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

      </main>
    </>
  )
}
