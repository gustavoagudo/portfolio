import type { ElementType } from 'react'

type Props = {
  text: string
  as?: ElementType
  chars?: boolean
  className?: string
}

/** Splits text into masked words (and optionally chars) so GSAP can animate `.sc` spans. */
export function Split({ text, as: Tag = 'span', chars = false, className }: Props) {
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="sw" aria-hidden="true" key={i}>
          {chars ? (
            Array.from(w).map((c, j) => (
              <span className="sc" key={j}>
                {c}
              </span>
            ))
          ) : (
            <span className="sc">{w}</span>
          )}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
