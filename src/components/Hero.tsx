import { useLayoutEffect, useRef } from 'react'
import { FACTS } from '../data'
import { gsap, reduced } from '../lib'
import { NetworkCanvas } from './NetworkCanvas'
import { Split } from './Split'

// Decorative request log; the shapes are typical of the work, the numbers are not real measurements.
const LOG = [
  'POST /propostas → 201 Created · 42ms',
  'GET /bancos/03/status → 200 OK · 38ms',
  'PATCH /propostas/{id} → 200 OK · 51ms',
  'POST /bancos/07/contratar → 202 Accepted · 97ms',
  'GET /comparacao → 200 OK · 64ms',
]

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.set('.hero .sc', { yPercent: 115 })
      gsap.set('.hero-fade', { opacity: 0, y: 24 })
      gsap.set('.hero-line', { scaleX: 0 })
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .to('.hero-title .sc', { yPercent: 0, duration: 1.5, stagger: 0.045 })
        .to('.hero-line', { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.2)
        .to('.hero-lead .sc', { yPercent: 0, duration: 1.1, stagger: 0.012 }, 0.55)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0.8)

      gsap.to('.hero-content', {
        yPercent: -10,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.net', {
        scale: 1.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  return (
    <section id="top" ref={root} className="hero">
      <NetworkCanvas />
      <div className="hero-content">
        <p className="eyebrow hero-fade">Full stack developer · Brasil</p>
        <h1 className="hero-title" aria-label="Gustavo Agudo">
          <Split text="Gustavo" chars as="span" className="block" />
          <Split text="Agudo" chars as="span" className="block indent" />
        </h1>
        <div className="hero-line" />
        <div className="hero-bottom">
          <Split
            as="p"
            className="hero-lead"
            text="Construo a camada que conversa com bancos, dados e fluxos — e faz tudo avançar sozinho."
          />
          <dl className="facts">
            {FACTS.map(([k, v]) => (
              <div className="hero-fade" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="ticker hero-fade" aria-hidden="true">
        <div className="ticker-track">
          {[...LOG, ...LOG, ...LOG, ...LOG].map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
