import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'accent' | 'teal' | 'ghost' | 'ghost-dark' | 'ink'
type Size = 'md' | 'sm'

interface BaseProps {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
}

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  href?: never
  to?: never
}

interface AnchorProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as: 'a'
  href: string
  to?: never
}

interface LinkProps extends BaseProps {
  as: 'link'
  to: string
  href?: never
}

type Props = ButtonProps | AnchorProps | LinkProps

function variantClasses(variant: Variant): string {
  switch (variant) {
    case 'accent': return 'bg-[var(--copper)] text-white border-[var(--copper)] hover:bg-[#9d5515] hover:border-[#9d5515]'
    // Secondary but filled: as visible as `accent`, set apart by colour (tokens in base.css)
    case 'teal':   return 'bg-[var(--btn-teal-bg)] text-[var(--btn-teal-fg)] border-[var(--btn-teal-bg)] hover:bg-[var(--btn-teal-bg-hover)] hover:border-[var(--btn-teal-bg-hover)]'
    case 'ghost':  return 'bg-transparent text-ink border-hairline-2 hover:border-ink'
    case 'ghost-dark': return 'bg-transparent text-white border-white/30 hover:border-white'
    case 'ink':    return 'bg-ink text-surface border-ink'
  }
}

function sizeClasses(size: Size): string {
  return size === 'sm'
    ? 'py-[0.55em] px-[1.05em] text-[0.9rem]'
    : 'py-[0.82em] px-[1.4em] text-[0.98rem]'
}

const BASE = 'inline-flex items-center gap-[0.6em] font-sans font-semibold tracking-[-0.01em] rounded-pill border transition-transform duration-[180ms] ease-in-out hover:-translate-y-0.5 hover:shadow-2 active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--ring)] whitespace-nowrap'

export function Button({ variant = 'ink', size = 'md', children, className = '', ...rest }: Props) {
  const cls = `${BASE} ${variantClasses(variant)} ${sizeClasses(size)} ${className}`

  if (rest.as === 'a') {
    const { as: _a, ...props } = rest as AnchorProps
    return <a className={cls} {...props}>{children}</a>
  }
  if (rest.as === 'link') {
    const { as: _a, to } = rest as LinkProps
    return <Link to={to} className={cls}>{children}</Link>
  }
  const { as: _a, ...props } = rest as ButtonProps
  return <button className={cls} {...props}>{children}</button>
}
