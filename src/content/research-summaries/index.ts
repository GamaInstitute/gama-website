// Published Research Summaries. The list (title, author, axis…) lives in `items` of
// src/i18n/locales/{fr,en}/research.json; the text of each summary is Markdown in
// ./<id>/en.md (summaries are written in English), with an optional ./<id>/fr.md.

export type SummaryItem = {
  id: string
  axis: string
  title: string
  // Meta description of the summary page
  description: string
  date_iso: string
  author: string
  initials: string
  color: string
  // Optional: contributor bio, shown after the name when present
  bio?: string
  paper_authors: string
  // The original publication being summarized
  source_url: string
}

// Eager so the SSG pass renders the text synchronously. Only the summary page imports
// this module's values; the list page imports the type alone.
const SOURCES = import.meta.glob('./*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/** The summary's Markdown in the requested language, falling back to English. */
export function summaryText(id: string, lang: 'fr' | 'en'): { source: string; lang: 'fr' | 'en' } | null {
  const own = SOURCES[`./${id}/${lang}.md`]
  if (own) return { source: own, lang }
  const en = SOURCES[`./${id}/en.md`]
  return en ? { source: en, lang: 'en' } : null
}
