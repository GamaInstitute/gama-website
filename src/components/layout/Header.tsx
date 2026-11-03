import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'
import { useScrolled } from '@/hooks/useScrolled'
import { LS_KEYS } from '@/constants'

const NAV_ITEMS = [
  { key: 'home',      to: '/' },
  { key: 'about',     to: '/about' },
  // { key: 'training',  to: '/training' }, // TODO: restore once the Training page ships
  { key: 'weekpaper', to: '/week-paper' },
  { key: 'research',  to: '/research-summaries' },
  { key: 'team',      to: '/team' },
  { key: 'contact',   to: '/contact' },
] as const

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function Header() {
  const { t, i18n } = useTranslation('common')
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [menuOpen])

  const isDark = theme === 'dark'

  function switchLang(lang: string) {
    i18n.changeLanguage(lang)
    document.documentElement.setAttribute('data-lang', lang)
    document.documentElement.setAttribute('lang', lang)
    try { localStorage.setItem(LS_KEYS.lang, lang) } catch (_) {}
  }

  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr'

  return (
    <header
      className={`sticky top-0 z-[60] border-b transition-colors duration-300 ${
        scrolled ? 'border-hairline' : 'border-transparent'
      }`}
    >
      {/* Background + blur live on their own layer, not on <header> itself —
          backdrop-filter on an ancestor creates a new containing block for
          position:fixed descendants (the mobile nav + its scrim below), which
          would otherwise anchor them to this 72px box instead of the viewport. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
          backdropFilter: 'saturate(1.4) blur(14px)',
          WebkitBackdropFilter: 'saturate(1.4) blur(14px)',
        }}
        aria-hidden="true"
      />
      <div className="wrap flex items-center gap-[18px] h-[72px]">
        {/* Brand */}
        <Link
          to="/"
          className="inline-flex items-center gap-[11px] mr-auto"
          aria-label="Gama Institute, accueil"
        >
          <BrandMark />
          <span className="flex flex-col leading-none">
            <b className="font-display font-semibold text-[1.18rem] tracking-[-0.02em] text-ink">Gama</b>
            <span className="font-display font-normal text-[0.82rem] tracking-[0.02em] text-ink-muted max-[520px]:hidden">
              Institute
            </span>
          </span>
        </Link>

        {/* Backdrop scrim behind the open mobile menu */}
        {menuOpen && (
          <div
            className="hidden max-[1080px]:block fixed inset-0 top-[72px] z-[54] bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Desktop nav */}
        <nav
          className={`
            flex items-center gap-1
            max-[1080px]:fixed max-[1080px]:inset-x-0 max-[1080px]:top-[72px] max-[1080px]:auto
            max-[1080px]:flex-col max-[1080px]:items-stretch max-[1080px]:gap-0.5
            max-[1080px]:bg-bg max-[1080px]:border-b max-[1080px]:border-hairline
            max-[1080px]:px-[var(--gutter)] max-[1080px]:pt-[14px] max-[1080px]:pb-[24px]
            max-[1080px]:shadow-2 max-[1080px]:z-[55]
            max-[1080px]:transition-transform max-[1080px]:duration-[340ms] max-[1080px]:ease-[cubic-bezier(0.4,0,0.2,1)]
            ${menuOpen ? 'max-[1080px]:translate-y-0' : 'max-[1080px]:-translate-y-[130%]'}
          `}
          aria-label={t('nav.home')}
        >
          {NAV_ITEMS.map(({ key, to }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to)
            return (
              <Link
                key={key}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`
                  relative text-[0.95rem] font-medium px-[0.8em] py-[0.5em] rounded-sm
                  transition-colors duration-[180ms]
                  max-[1080px]:py-[0.8em] max-[1080px]:px-[0.4em] max-[1080px]:text-[1.05rem]
                  max-[1080px]:border-b max-[1080px]:border-hairline max-[1080px]:last:border-b-0
                  ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}
                  group
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {t(`nav.${key}`)}
                {/* Animated underline */}
                {isActive ? (
                  <span className="absolute left-[0.8em] right-[0.8em] bottom-[0.12em] h-0.5 bg-[var(--copper)] rounded-sm max-[1080px]:hidden" />
                ) : (
                  <span className="absolute left-[0.8em] right-[0.8em] bottom-[0.12em] h-0.5 bg-[var(--copper)] rounded-sm scale-x-0 origin-left transition-transform duration-[260ms] group-hover:scale-x-100 max-[1080px]:hidden" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {/* Language switch */}
          <div
            role="group"
            aria-label={t('lang_label')}
            className="inline-flex items-center border border-hairline-2 rounded-pill p-0.5 gap-0.5 bg-surface"
          >
            {(['fr', 'en'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                aria-pressed={currentLang === lang}
                className={`border-0 font-semibold text-[0.82rem] min-w-[40px] min-h-[40px] flex items-center justify-center rounded-pill transition-colors duration-200 ${
                  currentLang === lang
                    ? 'bg-ink text-bg'
                    : 'bg-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? t('toggle_light') : t('toggle_dark')}
            className="w-11 h-11 rounded-pill border border-hairline-2 bg-surface text-ink-soft grid place-items-center transition-colors duration-200 hover:text-ink hover:border-ink focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CTA - hidden on mobile */}
          <Button as="link" to="/contact" variant="accent" size="sm" className="max-[1080px]:hidden">
            {t('get_in_touch')}
          </Button>

          {/* Hamburger */}
          <button
            className="hidden max-[1080px]:grid w-11 h-11 rounded-pill border border-hairline-2 bg-surface text-ink-soft place-items-center transition-colors duration-200 hover:text-ink hover:border-ink focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
