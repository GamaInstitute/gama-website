import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DOWNLOADS, publicUrl, type DownloadKey } from '@/constants'

/*
 * Small Markdown renderer for the publication guidelines (src/content/publication-guidelines/).
 * It supports only what that page uses, so no Markdown library ships to the browser:
 *
 *   ## Heading {#anchor}   h2, a part of the page, in the table of contents (anchor optional)
 *   ### Heading {#anchor}  h3, a sub-section, also in the table of contents
 *   #### Heading           h4
 *   - item / 1. item       lists (one level)
 *   | a | b |              table (first row is the header; leave it empty for none)
 *   > text                 callout box; start it with [!rule], [!tip] or [!example] for those styles
 *   ```                    code block (used for search queries)
 *   ![alt](src "caption"){1280x600}  figure; the optional {WxH} reserves the space, so anchors below don't shift as it loads
 *   **bold** _italic_ `code` [label](href)
 *
 * Links: `/route` → router Link, `download:<key>` → file from DOWNLOADS,
 * `#anchor` / `mailto:` → plain anchor, anything else opens in a new tab.
 */

export type Heading = { id: string; text: string; level: 2 | 3 }

const LINK_CLS = 'font-semibold text-[var(--link)] underline underline-offset-2 decoration-[color-mix(in_srgb,currentColor_35%,transparent)] hover:decoration-current'

export function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseHeading(raw: string, level: 2 | 3): Heading {
  const m = raw.match(/^(.*?)\s*\{#([\w-]+)\}\s*$/)
  return m ? { text: m[1], id: m[2], level } : { text: raw, id: slugify(raw), level }
}

export function headings(md: string): Heading[] {
  return md.split('\n')
    .filter(l => l.startsWith('## ') || l.startsWith('### '))
    .map(l => l.startsWith('## ') ? parseHeading(l.slice(3), 2) : parseHeading(l.slice(4), 3))
}

function MdLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith('/')) return <Link to={href} className={LINK_CLS}>{children}</Link>
  if (href.startsWith('download:')) {
    const url = DOWNLOADS[href.slice(9) as DownloadKey]
    return <a href={url} download className={LINK_CLS}>{children}</a>
  }
  if (href.startsWith('#') || href.startsWith('mailto:')) return <a href={href} className={LINK_CLS}>{children}</a>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>{children}</a>
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\b_[^_\s][^_]*_\b)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i} className="font-semibold text-ink"><Inline text={part.slice(2, -2)} /></strong>
        if (/^`[^`]+`$/.test(part)) return <code key={i} className="font-mono text-[0.88em] px-1.5 py-0.5 rounded bg-bg-alt border border-hairline text-ink">{part.slice(1, -1)}</code>
        if (/^_[^_]+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) return <MdLink key={i} href={link[2]}><Inline text={link[1]} /></MdLink>
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())

// `compact` tones down the h2 for article pages (Research Summaries): no rule or large gap between parts.
const H2_CLS = {
  guide:   'font-display font-semibold text-[1.75rem] tracking-[-0.02em] text-ink mt-20 pt-10 border-t border-hairline mb-1 scroll-mt-[96px] first:mt-0 first:pt-0 first:border-t-0',
  compact: 'font-display font-semibold text-[1.45rem] tracking-[-0.015em] text-ink mt-12 scroll-mt-[96px] first:mt-0',
}

// A rule must stand out from tips and examples: thicker accent border, stronger tint, an icon.
type CalloutKind = 'note' | 'rule' | 'tip' | 'example'
const CALLOUT_CLS: Record<CalloutKind, string> = {
  note:    'border-l-[3px] border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_6%,transparent)]',
  rule:    'border border-l-[5px] border-[color:color-mix(in_srgb,var(--accent)_45%,transparent)] border-l-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_13%,transparent)]',
  tip:     'border-l-[3px] border-[var(--link)] bg-[color:color-mix(in_srgb,var(--link)_8%,transparent)]',
  example: 'border-l-[3px] border-hairline-2 bg-bg-alt',
}

export function Markdown({ source, compact = false }: { source: string; compact?: boolean }) {
  const lines = source.split('\n')
  const out: ReactNode[] = []
  let i = 0
  const key = () => out.length

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) { i++; continue }

    if (trimmed.startsWith('```')) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++])
      i++
      out.push(
        <pre key={key()} className="mt-4 overflow-x-auto rounded-md border border-hairline bg-bg-alt px-4 py-3 text-[0.86rem] leading-[1.7] text-ink">
          <code className="font-mono">{code.join('\n')}</code>
        </pre>,
      )
      continue
    }

    if (trimmed.startsWith('## ')) {
      const h = parseHeading(trimmed.slice(3), 2)
      out.push(
        <h2 key={key()} id={h.id} className={H2_CLS[compact ? 'compact' : 'guide']}>
          <Inline text={h.text} />
        </h2>,
      )
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      const h = parseHeading(trimmed.slice(4), 3)
      out.push(
        <h3 key={key()} id={h.id} className="font-display font-semibold text-[1.3rem] tracking-[-0.015em] text-ink mt-12 scroll-mt-[96px]">
          <Inline text={h.text} />
        </h3>,
      )
      i++
      continue
    }

    if (trimmed.startsWith('#### ')) {
      out.push(<h4 key={key()} className="font-display font-semibold text-[1.08rem] text-ink mt-8"><Inline text={trimmed.slice(5)} /></h4>)
      i++
      continue
    }

    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)(?:\{(\d+)x(\d+)\})?$/)
    if (img) {
      const [, alt, src, caption, width, height] = img
      out.push(
        <figure key={key()} className="mt-6">
          <img src={publicUrl(src)} alt={alt} width={width} height={height} loading="lazy" className="w-full h-auto rounded-md border border-hairline" />
          {caption && <figcaption className="mt-2 text-[0.84rem] text-ink-muted"><Inline text={caption} /></figcaption>}
        </figure>,
      )
      i++
      continue
    }

    if (trimmed.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!/^\|[\s:|-]*-[\s:|-]*\|$/.test(lines[i].trim())) rows.push(cells(lines[i]))
        i++
      }
      const [head, ...body] = rows
      out.push(
        <div key={key()} className="mt-5 overflow-x-auto rounded-md border border-hairline">
          <table className="w-full text-[0.92rem] border-collapse">
            {head.some(Boolean) && (
              <thead className="bg-bg-alt text-left">
                <tr>{head.map((c, j) => <th key={j} className="px-4 py-2.5 font-semibold text-ink border-b border-hairline"><Inline text={c} /></th>)}</tr>
              </thead>
            )}
            <tbody>
              {body.map((r, j) => (
                <tr key={j} className="border-b border-hairline last:border-b-0 align-top">
                  {/* The first column is a label: kept on one line when short, wrapped when it is a sentence */}
                  {r.map((c, k) => <td key={k} className={`px-4 py-2.5 ${k === 0 ? `font-semibold text-ink ${c.length <= 30 ? 'whitespace-nowrap' : 'min-w-[16ch]'}` : ''}`}><Inline text={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    if (trimmed.startsWith('> ')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) quote.push(lines[i++].trim().replace(/^>\s?/, ''))
      const kind = (quote[0].match(/^\[!(rule|tip|example)\]\s*/)?.[1] ?? 'note') as CalloutKind
      if (kind !== 'note') quote[0] = quote[0].replace(/^\[!\w+\]\s*/, '')
      out.push(
        <aside key={key()} className={`mt-6 rounded-md px-5 py-4 text-ink ${CALLOUT_CLS[kind]}`}>
          {kind === 'rule' && (
            <span aria-hidden="true" className="float-left mr-3 mt-[2px] grid place-items-center w-[22px] h-[22px] rounded-full bg-[var(--accent)] text-white text-[0.8rem] font-bold">!</span>
          )}
          {quote.join('\n').split(/\n\s*\n/).map((p, j) => <p key={j} className="mt-2 first:mt-0"><Inline text={p.replace(/\n/g, ' ')} /></p>)}
        </aside>,
      )
      continue
    }

    if (/^(- |\d+\. )/.test(trimmed)) {
      const ordered = /^\d+\. /.test(trimmed)
      const items: string[] = []
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i].trim())) {
        items.push(lines[i++].trim().replace(/^(- |\d+\. )/, ''))
      }
      const Tag = ordered ? 'ol' : 'ul'
      out.push(
        <Tag key={key()} className={`mt-3 pl-5 grid gap-1.5 ${ordered ? 'list-decimal marker:font-semibold' : 'list-disc'} marker:text-[var(--accent)]`}>
          {items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
        </Tag>,
      )
      continue
    }

    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{2,4} |```|\||> |- |\d+\. |!\[)/.test(lines[i].trim())) para.push(lines[i++].trim())
    out.push(<p key={key()} className="mt-4"><Inline text={para.join(' ')} /></p>)
  }

  return <>{out}</>
}
