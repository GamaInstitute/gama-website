import { useId } from 'react'

interface DateWithTooltipProps {
  /** ISO date (YYYY-MM-DD) for the <time> element */
  dateTime: string
  /** Full formatted date, shown in the tooltip */
  full: string
  children: React.ReactNode
  className?: string
}

/** A <time> showing relative text ("il y a 3 jours") that reveals the full date on hover or
    keyboard focus. Custom rather than a native `title`, which is slow, unreliable inside
    animated cards, and never shows on touch or focus. */
export function DateWithTooltip({ dateTime, full, children, className = '' }: DateWithTooltipProps) {
  const tooltipId = useId()
  return (
    <span className={`group relative inline-flex ${className}`}>
      <time
        dateTime={dateTime}
        tabIndex={0}
        aria-describedby={tooltipId}
        className="cursor-help underline decoration-dotted decoration-from-font underline-offset-[3px] decoration-transparent group-hover:decoration-current focus-visible:decoration-current outline-none"
      >
        {children}
      </time>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute left-0 bottom-full mb-1.5 z-10 whitespace-nowrap rounded-md bg-ink text-bg text-[0.78rem] font-medium px-2 py-1 shadow-md opacity-0 translate-y-1 transition duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
      >
        {full}
      </span>
    </span>
  )
}
