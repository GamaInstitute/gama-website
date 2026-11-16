import { useEffect } from 'react'
import type { RouteRecord } from 'vite-react-ssg'
import { Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import research from '@/i18n/locales/fr/research.json'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { LS_KEYS } from '@/constants'
import { NewsletterProvider } from '@/components/newsletter/NewsletterProvider'

function RootLayout() {
  const { pathname } = useLocation()

  // Pages are prerendered in French (see src/i18n/index.ts). Once hydrated, switch to the
  // visitor's saved language. A passive effect on purpose: effects run children first, so
  // every useTranslation below is already subscribed and re-renders on the change.
  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(LS_KEYS.lang) } catch (_) {}
    if (saved === 'en' || saved === 'fr') {
      if (i18n.language !== saved) i18n.changeLanguage(saved)
      document.documentElement.setAttribute('lang', saved)
    }
  }, [])

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
       <NewsletterProvider>
        <a className="skip" href="#main">
          {i18n.t('skip_to_content', { ns: 'common' })}
        </a>
        <ScrollToTop />
        <Header />
        {/* Enter-only transition (plain CSS, see .page-transition in base.css):
            softens the hard cut between pages without a crossfade, which would
            visually collide with each page's own Reveal scroll-in animations.
            Deliberately not framer-motion — routes.tsx is the non-lazy root,
            so importing it here would pull the library into the eager bundle
            instead of the lazy per-page chunks that already use it. */}
        <div key={pathname} className="page-transition">
          <Outlet />
        </div>
        <Footer />
       </NewsletterProvider>
      </I18nextProvider>
    </HelmetProvider>
  )
}

// Routes are code-split with React Router's `lazy` so each page ships its own
// chunk instead of bundling all pages (+ framer-motion per page) into one file.
// Unlike React.lazy(), this resolves before render, so vite-react-ssg's SSG
// pass still produces full static HTML per page.
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,        lazy: () => import('@/pages/HomePage').then(m => ({ Component: m.default })) },
      { path: 'about',      lazy: () => import('@/pages/AboutPage').then(m => ({ Component: m.default })) },
      // TODO: Training page is built but held back for a later release — restore the route below to ship it.
      // { path: 'training',   lazy: () => import('@/pages/TrainingPage').then(m => ({ Component: m.default })) },
      { path: 'week-paper', lazy: () => import('@/pages/WeekPaperPage').then(m => ({ Component: m.default })) },
      { path: 'research-summaries', lazy: () => import('@/pages/ResearchSummariesPage').then(m => ({ Component: m.default })) },
      {
        path: 'research-summaries/:id',
        lazy: () => import('@/pages/ResearchSummaryPage').then(m => ({ Component: m.default })),
        // One static page per published summary (ids from research.json, same in both languages)
        getStaticPaths: () => research.items.map(it => `research-summaries/${it.id}`),
      },
      { path: 'team',       lazy: () => import('@/pages/TeamPage').then(m => ({ Component: m.default })) },
      { path: 'publication-guidelines', lazy: () => import('@/pages/PublicationGuidelinesPage').then(m => ({ Component: m.default })) },
      { path: 'privacy',    lazy: () => import('@/pages/PrivacyPage').then(m => ({ Component: m.default })) },
      { path: 'terms',      lazy: () => import('@/pages/TermsPage').then(m => ({ Component: m.default })) },
      { path: 'open-access', lazy: () => import('@/pages/OpenAccessPage').then(m => ({ Component: m.default })) },
      { path: 'contact',    lazy: () => import('@/pages/ContactPage').then(m => ({ Component: m.default })) },
      // Unknown URLs. '404' is prerendered as dist/404.html, which Cloudflare Pages and
      // GitHub Pages both serve (status 404) for any path with no file; the router then
      // matches the visited URL against '*' and renders the same page. vite-react-ssg
      // doesn't prerender '*' routes, hence the two entries.
      { path: '404',        lazy: () => import('@/pages/NotFoundPage').then(m => ({ Component: m.default })) },
      { path: '*',          lazy: () => import('@/pages/NotFoundPage').then(m => ({ Component: m.default })) },
    ],
  },
]
