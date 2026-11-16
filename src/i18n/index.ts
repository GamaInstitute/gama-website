import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import frCommon     from './locales/fr/common.json'
import frTraining   from './locales/fr/training.json'
import frHome       from './locales/fr/home.json'
import frAbout      from './locales/fr/about.json'
import frTeam       from './locales/fr/team.json'
import frWeekpaper  from './locales/fr/weekpaper.json'
import frResearch   from './locales/fr/research.json'

import enCommon     from './locales/en/common.json'
import enTraining   from './locales/en/training.json'
import enHome       from './locales/en/home.json'
import enAbout      from './locales/en/about.json'
import enTeam       from './locales/en/team.json'
import enWeekpaper  from './locales/en/weekpaper.json'
import enResearch   from './locales/en/research.json'

i18next
  .use(initReactI18next)
  .init({
    resources: {
      fr: { common: frCommon, training: frTraining, home: frHome, about: frAbout, team: frTeam, weekpaper: frWeekpaper, research: frResearch },
      en: { common: enCommon, training: enTraining, home: enHome, about: enAbout, team: enTeam, weekpaper: enWeekpaper, research: enResearch },
    },
    // Always French here: pages are prerendered in French, and the first browser render
    // must match that HTML. The saved choice (localStorage 'gama-lang', written by the
    // header toggle) is applied right after hydration, in RootLayout (routes.tsx).
    lng: 'fr',
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'training', 'home', 'about', 'team', 'weekpaper', 'research'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18next
