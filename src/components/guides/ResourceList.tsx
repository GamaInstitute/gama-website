import { Link } from 'react-router-dom'
import { DOWNLOADS, type DownloadKey } from '@/constants'

/** A page on the site (`to`) or a downloadable file (`file`, a key of DOWNLOADS). */
export type ResourceItem = { label: string; meta: string; to?: string; file?: DownloadKey }

const CARD_CLS = 'flex gap-3 items-center py-3 px-[14px] border border-hairline-2 rounded-md transition-colors hover:border-copper hover:bg-[rgba(181,100,24,.05)]'

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  )
}

function GuideIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h12M8 7h6M8 11h6" />
    </svg>
  )
}

function Body({ item }: { item: ResourceItem }) {
  return (
    <>
      <span className="text-[var(--accent-ink)] flex-none">{item.to ? <GuideIcon /> : <DownloadIcon />}</span>
      <span>
        <b className="block text-[0.92rem] font-semibold text-ink">{item.label}</b>
        <small className="block text-[0.76rem] text-ink-muted">{item.meta}</small>
      </span>
    </>
  )
}

/** Cards for the contribute sections: the guidelines open as a page, the slide template downloads. */
export function ResourceList({ items, className = '' }: { items: ResourceItem[]; className?: string }) {
  return (
    <div className={`grid gap-2.5 ${className}`}>
      {items.map(item => item.to
        ? <Link key={item.to} to={item.to} className={CARD_CLS}><Body item={item} /></Link>
        : <a key={item.file} href={item.file && DOWNLOADS[item.file]} download className={CARD_CLS}><Body item={item} /></a>,
      )}
    </div>
  )
}
