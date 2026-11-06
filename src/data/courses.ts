import type { Course, Category } from '@/types/course'
import { TOPIC_COLORS } from '@/constants'

export const CATEGORIES: Category[] = [
  { key: 'ai',       color: TOPIC_COLORS.ai,    count: 9 },
  { key: 'software', color: TOPIC_COLORS.se,    count: 7 },
  { key: 'cloud',    color: TOPIC_COLORS.cloud, count: 5 },
  { key: 'devops',   color: TOPIC_COLORS.cloud, count: 4 },
  { key: 'security', color: TOPIC_COLORS.sec,   count: 6 },
]

export const FEATURED_COURSES: Course[] = [
  { id: 'applied-ai',         categoryKey: 'ai',             topic: 'ai',    durationWeeks: 8, levelKey: 'intermediate' },
  { id: 'cd-cloud',           categoryKey: 'devops',         topic: 'cloud', durationWeeks: 6, levelKey: 'advanced'     },
  { id: 'supply-chain-sec',   categoryKey: 'security',       topic: 'sec',   durationWeeks: 4, levelKey: 'all'          },
  { id: 'distributed-sys',    categoryKey: 'software',       topic: 'se',    durationWeeks: 7, levelKey: 'advanced'     },
  { id: 'ai-governance',      categoryKey: 'responsible-ai', topic: 'rai',   durationWeeks: 5, levelKey: 'intermediate' },
  { id: 'ai-compute-infra',   categoryKey: 'cloud',          topic: 'cloud', durationWeeks: 6, levelKey: 'intermediate' },
]
