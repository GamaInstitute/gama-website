import type { Topic } from './topic'

export type TagVariant = 'copper' | 'teal' | 'default'

export interface Course {
  id:           string
  categoryKey:  string
  // Research topic the course belongs to; sets its tag colour (TOPIC_COLORS)
  topic:        Topic
  durationWeeks: number
  levelKey:     string
  imageSrc?:    string
}

export interface Category {
  key:    string
  color:  string
  count:  number
}
