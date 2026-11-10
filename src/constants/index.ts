import type { Topic } from '@/types/topic'

export const ANIM = {
  REVEAL_DURATION: 0.7,
  REVEAL_EASE: [0.22, 1, 0.36, 1] as const,
  STAGGER_CHILD: 0.08,
  CARD_HOVER_Y: -4,
  CARD_HOVER_DURATION: 0.25,
  MODAL_DURATION: 0.2,
} as const

export const BRAND_GRADIENT = 'linear-gradient(110deg, #B56418 0%, #D8942A 28%, #8EA57A 54%, #2A8C8A 76%, #165C71 100%)'

export const GRAD_STOPS = [
  { offset: 0,   hex: '#B56418' },
  { offset: 0.28, hex: '#D8942A' },
  { offset: 0.54, hex: '#8EA57A' },
  { offset: 0.76, hex: '#2A8C8A' },
  { offset: 1,   hex: '#165C71' },
] as const

// One colour per research topic, taken from the brand gradient, so a topic looks the same
// on every page (WeekPaper, Research Summaries, Training). TopicTag holds the text shades.
export type { Topic }
export const TOPIC_COLORS: Record<Topic, string> = {
  ai:    '#B56418',
  se:    '#D8942A',
  cloud: '#8EA57A',
  rai:   '#2A8C8A',
  sec:   '#165C71',
}

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/gamainstitute',
  facebook: 'https://www.facebook.com/profile.php?id=61592239571013',
  youtube:  'https://www.youtube.com/@gamainstitut',
  github:   'https://github.com/GamaInstitute',
} as const

export const CONTACT_EMAIL = {
  general: 'contact@gamainstitute.ca',
} as const

// Files offered for download. Only the PowerPoint slide template: the contributor
// guidelines are a web page (src/content/publication-guidelines/), not documents.
export const DOWNLOADS = {
  slide_template: `${import.meta.env.BASE_URL}downloads/GAMA_Institute_Slide_Template.pptx?v=2026-11-06b`,
} as const

export type DownloadKey = keyof typeof DOWNLOADS

export const LS_KEYS = {
  theme: 'gama-theme',
  lang:  'gama-lang',
} as const
