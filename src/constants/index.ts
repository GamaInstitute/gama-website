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

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/gamainstitute',
  facebook: 'https://www.facebook.com/profile.php?id=61592239571013',
  youtube:  'https://www.youtube.com/@gamainstitut',
  github:   'https://github.com/GamaInstitute',
} as const

export const CONTACT_EMAIL = {
  general: 'contact@gamainstitute.ca',
} as const

// Downloadable guides and templates. The Word files live in the team's shared
// Google Drive folder (drive.google.com/drive/folders/1P7LN8TkhQ9sLvT5FEvl4uaTEErToQiVj)
// and are linked as direct downloads, so replacing a file's content in Drive
// (same file, "Manage versions") updates the site with no deploy. The file must
// stay shared as "Anyone with the link". The slide template isn't in Drive yet.
const drive = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

export const DOWNLOADS = {
  summary_template_fr:   drive('1H_9NGI1ForaDCOndo78nDFlRF0TgO48p'),
  summary_template_en:   drive('1NZjSDPCf6n6d_bLDybDx_XWOMLJ3GROT'),
  paper_search_guide_fr: drive('1Jb096geGCfMKDB9ijrBhM4j6BXIT5kNe'),
  paper_search_guide_en: drive('15P6JwbQRiPl99FB7b2pflKJfjk8i1ZuM'),
  weekpaper_guide_fr:    drive('1lMu69TJwVbAjQAHpwQHAGZCmFRqSdiNR'),
  weekpaper_guide_en:    drive('13VSIFjTH_NwnFkyfNbFQc3-JTl9SLrAA'),
  slide_template:        '/downloads/GAMA_Institute_Slide_Template.pptx',
} as const

export type DownloadKey = keyof typeof DOWNLOADS

export const LS_KEYS = {
  theme: 'gama-theme',
  lang:  'gama-lang',
} as const
