import { useLayoutEffect, useRef } from 'react'
import { EXPERIENCE } from '../data'
import { gsap, reduced } from '../lib'
import { Hub } from './Hub'

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const counters = gsap.utils.toArray<HTMLElement>('.count')
    if (reduced) {
      counters.forEach((el) => (el.textContent = el.dataset.to ?? ''))
      return
    }
    const ctx = gsap.context(() => {
      counters.forEach((el) => {
        const o = { v: 0 }
        gsap.to(o, {
          v: Number(el.dataset.to),
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      // Cards stack on top of each other; the covered card recedes.
      const cards = gsap.utils.toArray<HTMLElement>('.xp-card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card, {
          scale: 0.94,
          backgroundColor: '#0a0d10',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 15%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experiencia" ref={root} className="xp">
      <div className="section xp-top">
        <h2 className="label" data-reveal>
          Experiência
        </h2>
        <div className="xp-head">
          <p className="h2" data-reveal>
            {EXPERIENCE.title}
          </p>
          <div>
            <p className="role" data-reveal>
              {EXPERIENCE.role}
            </p>
            <p className="lead" data-reveal>
              {EXPERIENCE.summary}
            </p>
          </div>
        </div>

        <dl className="metrics">
          {EXPERIENCE.metrics.map((m) => (
            <div className="metric" key={m.label} data-reveal>
              <dt>
                <span className="count" data-to={m.value}>
                  0
                </span>
                <small>{m.suffix}</small>
              </dt>
              <dd>{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hub-stage">
        <p className="hub-label">Cada banco tem um contrato. O resto do sistema recebe uma forma só.</p>
        <Hub />
        <p className="hub-caption">Autenticação, formato e vocabulário tratados na borda.</p>
      </div>

      <div className="section xp-cards">
        {EXPERIENCE.items.map((it, i) => (
          <article className="xp-card" key={it.title} style={{ top: `calc(12vh + ${i * 14}px)` }}>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
