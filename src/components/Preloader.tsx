import { useLayoutEffect, useRef } from 'react'
import { gsap, lockScroll, unlockScroll, reduced } from '../lib'

export function Preloader({ onDone, onReveal }: { onDone: () => void; onReveal: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (reduced) {
      onReveal()
      onDone()
      return
    }
    lockScroll()
    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.pre-name .sc', { yPercent: 110, duration: 0.9, stagger: 0.03, ease: 'expo.out' })
        .to(
          counter,
          {
            v: 100,
            duration: 1.7,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0.1,
        )
        .to('.pre-bar', { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.1)
        .to('.pre-inner', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=0.15')
        .add(onReveal, '>-0.05')
        .to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<')
        .add(() => {
          unlockScroll()
          onDone()
        })
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="pre-inner">
        <div className="pre-name">
          {['GUSTAVO', 'AGUDO'].map((w, i) => (
            <span className="sw" key={i}>
              {Array.from(w).map((c, j) => (
                <span className="sc" key={j}>
                  {c}
                </span>
              ))}
              {i === 0 ? ' ' : ''}
            </span>
          ))}
        </div>
        <div className="pre-meta">
          <span>Backend · APIs · Integrações</span>
          <span ref={num}>000</span>
        </div>
        <div className="pre-track">
          <div className="pre-bar" />
        </div>
      </div>
    </div>
  )
}
