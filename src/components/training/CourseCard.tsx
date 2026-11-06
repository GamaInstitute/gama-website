import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TopicTag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { ANIM, type Topic } from '@/constants'

interface CourseCardProps {
  category:    string
  topic:       Topic
  title:       string
  excerpt:     string
  duration:    string
  level:       string
  enrollHref?: string
  imageSrc?:   string
}

export function CourseCard({
  category,
  topic,
  title,
  excerpt,
  duration,
  level,
  enrollHref = '#',
  imageSrc,
}: CourseCardProps) {
  const { t } = useTranslation('common')

  return (
    <motion.article
      className="bg-surface border border-hairline rounded-lg overflow-hidden flex flex-col"
      whileHover={{ y: ANIM.CARD_HOVER_Y, boxShadow: 'var(--sh-3)', borderColor: 'var(--hairline-2)' }}
      transition={{ duration: ANIM.CARD_HOVER_DURATION, ease: 'easeOut' }}
    >
      {/* Media */}
      <div className="aspect-[16/10] relative overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.045]"
          />
        ) : (
          <div className="ph"><span>image · cours</span></div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 flex-1 p-[22px_24px_26px]">
        <div className="flex items-center gap-3 flex-wrap">
          <TopicTag topic={topic}>{category}</TopicTag>
        </div>
        <h3 className="font-display font-semibold text-[clamp(1.25rem,2vw,1.5rem)] tracking-[-0.015em] text-ink">
          <a href={enrollHref} className="hover:text-[var(--accent-ink)] transition-colors duration-[180ms]">
            {title}
          </a>
        </h3>
        <p className="text-ink-soft text-[0.95rem] m-0">{excerpt}</p>
        <div className="flex items-center gap-3 flex-wrap text-[0.82rem] text-ink-muted">
          <span>{duration}</span>
          <span aria-hidden="true">·</span>
          <span>{level}</span>
        </div>
        <div className="mt-auto pt-1">
          <Button as="a" href={enrollHref} variant="ghost" size="sm">
            {t('enroll')}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
