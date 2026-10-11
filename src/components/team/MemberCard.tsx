import { motion } from 'framer-motion'
import { ANIM }   from '@/constants'
import { Avatar } from './Avatar'
import { LinkedInIcon } from '@/components/ui/icons'

interface MemberCardProps {
  name: string
  role: string
  photo?: string
  photoPosition?: string
  linkedin?: string
}

export function MemberCard({ name, role, photo, photoPosition, linkedin }: MemberCardProps) {
  return (
    <motion.article
      className="relative flex flex-col items-center justify-center text-center gap-3 p-6 aspect-square rounded-lg border border-hairline bg-surface shadow-[var(--sh-1)]"
      whileHover={{ y: ANIM.CARD_HOVER_Y, boxShadow: 'var(--sh-2)' }}
      transition={{ duration: ANIM.CARD_HOVER_DURATION }}
    >
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — LinkedIn`}
          className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-[4px] bg-ink text-bg hover:opacity-90"
        >
          <LinkedInIcon size={14} />
        </a>
      )}
      <div className="w-24 h-24 mt-1">
        <Avatar name={name} photo={photo} photoPosition={photoPosition} shape="circle" className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display font-bold text-[1.15rem] text-ink m-0">{name}</h3>
        <span className="text-[0.95rem] text-[var(--accent-ink)]">{role}</span>
      </div>
    </motion.article>
  )
}
