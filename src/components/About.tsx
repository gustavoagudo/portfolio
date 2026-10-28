import { useLayoutEffect, useRef } from 'react'
import { ABOUT } from '../data'
import { gsap, reduced } from '../lib'

export function About() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Words darken as the headline scrolls through the viewport.
      gsap.fromTo(
        '.about-title .scrub',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.about-title', start: 'top 82%', end: 'bottom 50%', scrub: true },
        },
      )
      // Portrait unmasks and drifts at a different speed than the page.
      gsap.fromTo(
        '.portrait',
        { clipPath: 'inset(22% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '.portrait-wrap', start: 'top 92%', end: 'top 35%', scrub: true },
        },
      )
      gsap.to('.portrait img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.portrait-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="sobre" ref={root} className="section about">
      <h2 className="label" data-reveal>
        Sobre
      </h2>
      <p className="about-title">
        {ABOUT.title.split(' ').map((w, i) => (
          <span className="scrub" key={i}>
            {w}{' '}
          </span>
        ))}
      </p>
      <div className="about-grid">
        <figure className="portrait-wrap">
          <div className="portrait">
            <img src="/gustavo.png" alt="Retrato de Gustavo Agudo" loading="lazy" />
          </div>
          <figcaption>Gustavo Agudo, Brasil</figcaption>
        </figure>
        <div className="about-text">
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
