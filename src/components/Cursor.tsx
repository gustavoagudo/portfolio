import { useEffect, useRef } from 'react'
import { gsap, isTouch } from '../lib'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouch) return
    const d = dot.current!
    const r = ring.current!
    const dx = gsap.quickTo(d, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.1, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e: MouseEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      document.body.classList.add('cursor-on')
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      r.classList.toggle('is-link', !!t.closest('a, button, [data-cursor]'))
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
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
