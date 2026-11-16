import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { NetworkArt }      from '@/components/brand/NetworkArt'
import { Button }          from '@/components/ui/Button'
import { Eyebrow }         from '@/components/ui/Eyebrow'
import { SectionWrapper }  from '@/components/ui/SectionWrapper'
import { DarkCTA }         from '@/components/ui/DarkCTA'
import { Reveal, revealContainer, revealItem } from '@/components/ui/Reveal'
import { CategoryCard }    from '@/components/training/CategoryCard'
import { CourseCard }      from '@/components/training/CourseCard'
import { LearningJourney } from '@/components/training/LearningJourney'

import { CATEGORIES, FEATURED_COURSES } from '@/data/courses'

export default function TrainingPage() {
  const { t } = useTranslation('training')

  const steps = t('journey.steps', { returnObjects: true }) as Array<{ title: string; description: string }>

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <main id="main">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="wrap grid grid-cols-[1.05fr_0.95fr] gap-[clamp(28px,4vw,60px)] items-center py-[clamp(56px,8vw,104px)] pb-[clamp(20px,3vw,32px)] max-[920px]:grid-cols-1">
            {/* Left: copy */}
            <div>
              <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
              <h1 className="font-display font-semibold text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.04] tracking-[-0.025em] text-ink mt-4 max-w-[16ch]">
                {t('hero.h1')}
              </h1>
              <p className="text-[clamp(1.1rem,1.6vw,1.32rem)] leading-[1.55] text-ink-soft font-normal mt-[22px] max-w-[56ch]">
                {t('hero.lead')}
              </p>
              <div className="flex gap-[14px] flex-wrap mt-8">
                <Button as="a" href="#courses" variant="accent">
                  {t('hero.cta_browse')} <span aria-hidden="true">→</span>
                </Button>
                <Button as="a" href="#journey" variant="ghost">
                  {t('hero.cta_journey')}
                </Button>
              </div>
            </div>

            {/* Right: network art */}
            <div>
              <NetworkArt />
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────── */}
        <SectionWrapper alt>
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(32px,4vw,52px)]">
              <div>
                <Eyebrow>{t('categories.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('categories.h2')}
                </h2>
              </div>
            </Reveal>

            <motion.div
              className="grid grid-cols-5 gap-[14px] max-[900px]:grid-cols-3 max-[560px]:grid-cols-2"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {CATEGORIES.map(({ key, color }) => (
                <motion.div key={key} variants={revealItem}>
                  <CategoryCard
                    name={t(`categories.items.${key}.name`)}
                    count={t(`categories.items.${key}.count`)}
                    color={color}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ── FEATURED COURSES ──────────────────────────────── */}
        <SectionWrapper id="courses">
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(32px,4vw,52px)]">
              <div>
                <Eyebrow>{t('featured.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('featured.h2')}
                </h2>
              </div>
              <Link
                to="#"
                className="inline-flex items-center gap-[0.45em] font-semibold text-[var(--link)] text-[0.98rem] group"
              >
                {t('featured.link_all')}{' '}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>

            <motion.div
              className="grid grid-cols-3 gap-[clamp(20px,2.4vw,32px)] max-[960px]:grid-cols-2 max-[620px]:grid-cols-1"
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {FEATURED_COURSES.map((course) => (
                <motion.div key={course.id} variants={revealItem}>
                  <CourseCard
                    category={t(`courses.${course.id}.category`)}
                    topic={course.topic}
                    title={t(`courses.${course.id}.title`)}
                    excerpt={t(`courses.${course.id}.excerpt`)}
                    duration={t(`courses.${course.id}.duration`)}
                    level={t(`courses.${course.id}.level`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ── LEARNING JOURNEY ──────────────────────────────── */}
        <SectionWrapper alt id="journey">
          <div className="wrap">
            <Reveal className="flex items-end justify-between gap-6 flex-wrap mb-[clamp(32px,4vw,52px)]">
              <div>
                <Eyebrow>{t('journey.eyebrow')}</Eyebrow>
                <h2 className="font-display font-semibold text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-[-0.02em] text-ink mt-3">
                  {t('journey.h2')}
                </h2>
              </div>
              <p className="text-ink-soft text-base max-w-[46ch] m-0">{t('journey.lead')}</p>
            </Reveal>

            <LearningJourney steps={steps} />
          </div>
        </SectionWrapper>

        {/* ── CTA ───────────────────────────────────────────── */}
        <SectionWrapper spacing="tight">
          <div className="wrap">
            <DarkCTA
              eyebrow={t('cta.eyebrow')}
              heading={t('cta.h2')}
              body={t('cta.body')}
            >
              <Button as="link" to="/contact" variant="accent">
                {t('cta.button')} <span aria-hidden="true">→</span>
              </Button>
            </DarkCTA>
          </div>
        </SectionWrapper>
      </main>
    </>
  )
}
