import { useEffect, useRef } from 'react'
import { gsap, isTouch } from '../lib'

/** A single inverted dot that follows the pointer and swells over links. */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouch) return
    const d = el.current!
    const x = gsap.quickTo(d, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(d, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e: MouseEvent) => {
      x(e.clientX)
      y(e.clientY)
      document.body.classList.add('cursor-on')
    }
    const over = (e: MouseEvent) => {
      d.classList.toggle('is-link', !!(e.target as HTMLElement).closest('a, button, [data-cursor]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  if (isTouch) return null
  return (
    <div ref={el} className="cursor" aria-hidden="true">
      <i />
    </div>
  )
}
