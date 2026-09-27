const LOCALES: Record<string, string> = { fr: 'fr-CA', en: 'en-CA' }

// Appending a local time-of-day avoids Date parsing the ISO string as UTC
// midnight, which would roll back a day in negative-UTC-offset timezones.
function toLocalDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatEpisodeDate(iso: string, lang: string): string {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? 'en-CA', { dateStyle: 'long' }).format(toLocalDate(iso))
}

// "yesterday" / "hier", "3 days ago" / "il y a 3 jours", escalating to
// weeks/months/years the older the date gets. `now` is injectable for tests.
export function formatRelativeEpisodeDate(iso: string, lang: string, now: Date = new Date()): string {
  const diffDays = Math.round((startOfDay(toLocalDate(iso)).getTime() - startOfDay(now).getTime()) / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat(LOCALES[lang] ?? 'en-CA', { numeric: 'auto' })

  const absDays = Math.abs(diffDays)
  if (absDays < 7)   return rtf.format(diffDays, 'day')
  if (absDays < 30)  return rtf.format(Math.round(diffDays / 7), 'week')
  if (absDays < 365) return rtf.format(Math.round(diffDays / 30), 'month')
  return rtf.format(Math.round(diffDays / 365), 'year')
}
