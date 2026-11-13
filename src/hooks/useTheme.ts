import { useCallback, useEffect, useRef, useState } from 'react'
import { LS_KEYS } from '@/constants'
import { useIsomorphicLayoutEffect } from '@/hooks/useHydrated'

type Theme = 'light' | 'dark'

function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(LS_KEYS.theme)
    if (stored === 'dark' || stored === 'light') return stored
  } catch (_) {}
  return null
}

export function useTheme() {
  // Starts as 'light', like the prerendered HTML, so hydration matches (see useHydrated).
  // The page itself is already in the right colours: the anti-FOUC script in index.html
  // set data-theme before paint. Only the toggle's icon waits for the sync below.
  const [theme, setThemeState] = useState<Theme>('light')
  // Whether the user has explicitly picked a theme (vs. following the OS).
  // Only an explicit choice gets persisted to localStorage.
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false)
  const synced = useRef(false)

  // Declared before the sync effect so it skips the hydration commit, where `theme`
  // is still the placeholder 'light' and would overwrite the anti-FOUC value.
  useIsomorphicLayoutEffect(() => {
    if (synced.current) document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Right after hydration, before paint: pick up the stored or OS theme.
  useIsomorphicLayoutEffect(() => {
    const stored = readStoredTheme()
    setHasExplicitPreference(stored !== null)
    setThemeState(stored ?? systemTheme())
    synced.current = true
  }, [])

  // Live-follow the OS theme for as long as no explicit choice has been made.
  useEffect(() => {
    if (hasExplicitPreference) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setThemeState(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [hasExplicitPreference])

  const persistTheme = useCallback((t: Theme) => {
    setHasExplicitPreference(true)
    try { localStorage.setItem(LS_KEYS.theme, t) } catch (_) {}
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    persistTheme(t)
  }, [persistTheme])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
  }, [persistTheme])

  return { theme, setTheme, toggleTheme }
}
