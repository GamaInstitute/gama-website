import type { RouteObject } from 'react-router-dom'
import { Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

function RootLayout() {
  const { pathname } = useLocation()

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
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
      </I18nextProvider>
    </HelmetProvider>
  )
}

// Routes are code-split with React Router's `lazy` so each page ships its own
// chunk instead of bundling all pages (+ framer-motion per page) into one file.
// Unlike React.lazy(), this resolves before render, so vite-react-ssg's SSG
// pass still produces full static HTML per page.
export const routes: RouteObject[] = [
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
      { path: 'team',       lazy: () => import('@/pages/TeamPage').then(m => ({ Component: m.default })) },
      // One route per guide (not `guides/:slug`) so the SSG pass knows every page to prerender.
      ...(['research-summary', 'weekpaper', 'finding-papers'] as const).map(slug => ({
        path: `guides/${slug}`,
        lazy: () => import('@/pages/GuidePage').then(m => ({ Component: () => <m.GuidePage slug={slug} /> })),
      })),
      { path: 'privacy',    lazy: () => import('@/pages/PrivacyPage').then(m => ({ Component: m.default })) },
      { path: 'terms',      lazy: () => import('@/pages/TermsPage').then(m => ({ Component: m.default })) },
      { path: 'open-access', lazy: () => import('@/pages/OpenAccessPage').then(m => ({ Component: m.default })) },
      { path: 'contact',    lazy: () => import('@/pages/ContactPage').then(m => ({ Component: m.default })) },
    ],
  },
]
