type TagVariant = 'default' | 'copper' | 'teal'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const variantCls: Record<TagVariant, string> = {
  default: 'bg-bg-alt text-ink-soft border-hairline',
  copper:  'text-[var(--accent-ink)] bg-[rgba(181,100,24,.08)] border-[rgba(181,100,24,.2)]',
  teal:    'text-[var(--teal)] bg-[rgba(22,92,113,.08)] border-[rgba(22,92,113,.2)] dark:text-[var(--link)] dark:bg-[rgba(89,184,201,.08)] dark:border-[rgba(89,184,201,.28)]',
}

export function Tag({ variant = 'default', children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-[0.4em] text-[0.72rem] font-semibold tracking-[0.08em] uppercase py-[0.42em] px-[0.7em] rounded-pill border ${variantCls[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
