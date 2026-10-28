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
        const to = Number(el.dataset.to)
        const o = { v: 0 }
        gsap.to(o, {
          v: to,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      // Sticky cards stack on top of each other; the covered card recedes.
      const cards = gsap.utils.toArray<HTMLElement>('.xp-card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 15%', scrub: true },
        })
      })

      gsap.fromTo(
        '.xp-bar',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.xp-cards', start: 'top 70%', end: 'bottom 80%', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experiencia" ref={root} className="section xp">
      <div className="label" data-reveal>
        <span>03</span> Experiência
      </div>
      <div className="xp-head">
        <h2 className="h2" data-reveal>
          {EXPERIENCE.title}
        </h2>
        <p className="role" data-reveal>
          {EXPERIENCE.role}
        </p>
        <p className="lead" data-reveal>
          {EXPERIENCE.summary}
        </p>
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

      <div className="hub-stage">
        <p className="hub-label">
          <i className="dot" /> Cada banco, um contrato — uma única forma para o resto do sistema
        </p>
        <Hub />
        <p className="hub-caption" style={{ opacity: reduced ? 1 : 0, transform: reduced ? 'none' : 'translateY(12px)' }}>
          Autenticação, formato e vocabulário tratados na borda.
        </p>
      </div>

      <div className="xp-progress">
        <div className="xp-bar" />
      </div>
      <div className="xp-cards">
        {EXPERIENCE.items.map((it, i) => (
          <article className="xp-card" key={it.title} style={{ top: `calc(14vh + ${i * 18}px)` }}>
            <span className="xp-n">0{i + 1}</span>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
