import { useState } from 'react'

interface VideoPlayerProps {
  label: string
  url?: string
  duration?: string
  placeholder?: string
  small?: boolean
  gradient?: boolean
  /** Plays muted, looped, and without the click-to-start thumbnail step. YouTube's native
   *  controls stay on so the viewer can still pause it (WCAG 2.2.2 — auto-playing content
   *  must remain stoppable). Intended for temporary "coming soon" placeholders, not real episodes. */
  autoplay?: boolean
}

const YOUTUBE_ID_RE = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/

export function VideoPlayer({ label, url, duration, placeholder = 'vidéo', small = false, gradient = false, autoplay = false }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoplay)
  const phClass = gradient ? 'ph ph--grad' : 'ph'
  const videoId = url?.match(YOUTUBE_ID_RE)?.[1]

  if (playing && videoId) {
    const params = autoplay
      ? `autoplay=1&mute=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`
      : 'autoplay=1&modestbranding=1&rel=0'
    return (
      <div className={`relative rounded-lg overflow-hidden ${small ? 'aspect-video' : 'aspect-[16/9]'}`}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${small ? 'aspect-video' : 'aspect-[16/9]'}`}>
      {videoId ? (
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          }}
        />
      ) : (
        <div className={phClass} style={{ position: 'absolute', inset: 0 }} />
      )}
      {/* Only shown over the gradient fallback, a real thumbnail already carries its own text */}
      {!videoId && (
        <span
          className={`absolute top-3 left-3 font-mono text-[0.72rem] tracking-[0.04em] px-[0.7em] py-[0.35em] rounded-sm border ${
            gradient ? 'bg-white/92 border-0 text-[#0E2230]' : 'bg-surface border-hairline text-ink-muted'
          }`}
        >
          {placeholder}
        </span>
      )}
      <button
        type="button"
        aria-label={label}
        onClick={() => setPlaying(true)}
        disabled={!videoId}
        className="absolute inset-0 flex items-center justify-center group"
      >
        <span className={`rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 ${small ? 'w-10 h-10' : 'w-14 h-14'}`}>
          <svg width={small ? 14 : 20} height={small ? 14 : 20} viewBox="0 0 24 24" fill="#0E2230">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      {duration && (
        <span className="absolute bottom-3 right-3 bg-[rgba(14,34,48,0.72)] text-white text-[0.72rem] font-mono px-2 py-0.5 rounded">
          {duration}
        </span>
      )}
    </div>
  )
}
