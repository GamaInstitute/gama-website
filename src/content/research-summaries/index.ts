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
  // Contributor, from the submission form: name, short bio, optional institution,
  // LinkedIn and photo (a path under public/, e.g. /research-summaries/contributors/x.webp)
  author: string
  initials: string
  color: string
  bio?: string
  institution?: string
  linkedin?: string
  photo?: string
  // The original publication being summarized
  paper_title: string
  paper_authors: string
  // Where and when it was published, e.g. "Proceedings of NAACL 2025, pages 11995–12041"
  paper_venue?: string
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
