import type { Topic } from '@/constants'

type TagVariant = 'default' | 'copper' | 'teal'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const BASE_CLS = 'inline-flex items-center gap-[0.4em] text-[0.72rem] font-semibold tracking-[0.08em] uppercase py-[0.42em] px-[0.7em] rounded-pill border'

const variantCls: Record<TagVariant, string> = {
  default: 'bg-bg-alt text-ink-soft border-hairline',
  copper:  'text-[var(--accent-ink)] bg-[rgba(181,100,24,.08)] border-[rgba(181,100,24,.2)]',
  teal:    'text-[var(--teal)] bg-[rgba(22,92,113,.08)] border-[rgba(22,92,113,.2)] dark:text-[var(--link)] dark:bg-[rgba(89,184,201,.08)] dark:border-[rgba(89,184,201,.28)]',
}

// Tinted with TOPIC_COLORS; the text shades are darker (light theme) or lighter (dark theme)
// versions of the same colour, chosen for at least 4.5:1 contrast on the tag background.
const topicCls: Record<Topic, string> = {
  ai:    'text-[#8E4D11] bg-[rgba(181,100,24,.10)] border-[rgba(181,100,24,.28)] dark:text-[#F2995A] dark:bg-[rgba(181,100,24,.14)] dark:border-[rgba(242,153,90,.35)]',
  se:    'text-[#6B5A0A] bg-[rgba(216,148,42,.12)] border-[rgba(216,148,42,.38)] dark:text-[#E9C46A] dark:bg-[rgba(216,148,42,.12)] dark:border-[rgba(233,196,106,.35)]',
  cloud: 'text-[#4A6537] bg-[rgba(142,165,122,.14)] border-[rgba(142,165,122,.42)] dark:text-[#A9C394] dark:bg-[rgba(142,165,122,.12)] dark:border-[rgba(169,195,148,.35)]',
  rai:   'text-[#1B6B69] bg-[rgba(42,140,138,.10)] border-[rgba(42,140,138,.30)] dark:text-[#4FCFB0] dark:bg-[rgba(42,140,138,.14)] dark:border-[rgba(79,207,176,.35)]',
  sec:   'text-[#165C71] bg-[rgba(22,92,113,.08)] border-[rgba(22,92,113,.25)] dark:text-[#6FB7E0] dark:bg-[rgba(111,183,224,.10)] dark:border-[rgba(111,183,224,.35)]',
}

/** Classes of a topic tag, for elements that aren't a plain <span> (e.g. a filter button). */
export function topicTagCls(topic: Topic) {
  return `${BASE_CLS} ${topicCls[topic]}`
}

export function Tag({ variant = 'default', children, className = '' }: TagProps) {
  return <span className={`${BASE_CLS} ${variantCls[variant]} ${className}`}>{children}</span>
}

/** A research topic (ai, se, cloud, rai, sec), always in that topic's colour. */
export function TopicTag({ topic, children, className = '' }: { topic: Topic; children: React.ReactNode; className?: string }) {
  return <span className={`${topicTagCls(topic)} ${className}`}>{children}</span>
}
