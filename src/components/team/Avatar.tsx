import { publicUrl } from '@/constants'

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map(p => p.replace(/\.$/, ''))
    .filter(p => p && !/^(Dr|Pr)$/i.test(p))

  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

interface AvatarProps {
  name: string
  photo?: string
  photoPosition?: string
  shape: 'rounded' | 'circle'
  className?: string
}

export function Avatar({ name, photo, photoPosition, shape, className = '' }: AvatarProps) {
  const shapeCls = shape === 'circle' ? 'rounded-full' : 'rounded-md'

  if (photo) {
    return (
      <img
        src={publicUrl(photo)}
        alt={name}
        loading="lazy"
        style={photoPosition ? { objectPosition: photoPosition } : undefined}
        className={`w-full h-full object-cover ${shapeCls} ${className}`}
      />
    )
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center font-display font-semibold text-white ${shapeCls} ${className}`}
      style={{ background: 'var(--accent)' }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}
