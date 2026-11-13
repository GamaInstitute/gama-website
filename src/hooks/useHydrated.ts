import { useEffect, useLayoutEffect, useState } from 'react'

// useLayoutEffect in the browser, useEffect during the SSG pass (where layout
// effects don't run and React warns about them).
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Set once the first page has hydrated: components that mount later (client-side
// navigation) can read browser-only values straight away.
let appHydrated = false

/**
 * False during the SSG pass and the hydration render, true right after (before paint).
 *
 * Every page is prerendered once, at build time, with no browser: French, light theme,
 * the build date. The first browser render must produce the same HTML, or React throws
 * the whole prerendered page away and re-renders it (errors #418/#423 in production).
 * So anything that depends on the browser (localStorage, prefers-color-scheme, today's
 * date) renders the build-time value until this returns true.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(appHydrated)
  useIsomorphicLayoutEffect(() => {
    appHydrated = true
    setHydrated(true)
  }, [])
  return hydrated
}
