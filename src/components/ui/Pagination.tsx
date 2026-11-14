const STEP_CLS = 'h-[38px] px-3 rounded-pill grid place-items-center border border-hairline-2 text-ink-soft transition-colors hover:border-ink hover:text-ink'

/** Page buttons: « previous · 1 2 3 · next ». Renders nothing when there's a single page. */
export function Pagination({ page, pageCount, onChange, labels, className = '' }: {
  page: number
  pageCount: number
  onChange: (page: number) => void
  labels: { nav: string; prev: string; next: string }
  className?: string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label={labels.nav} className={`flex gap-2 items-center flex-wrap text-[0.92rem] font-semibold ${className}`}>
      {page > 1 && (
        <button type="button" onClick={() => onChange(page - 1)} className={STEP_CLS}>{labels.prev}</button>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`min-w-[38px] h-[38px] px-3 rounded-pill grid place-items-center border transition-colors ${
            n === page ? 'bg-ink text-bg border-ink' : 'border-hairline-2 text-ink-soft hover:border-ink hover:text-ink'
          }`}
        >
          {n}
        </button>
      ))}
      {page < pageCount && (
        <button type="button" onClick={() => onChange(page + 1)} className={STEP_CLS}>{labels.next}</button>
      )}
    </nav>
  )
}
