import { useLayoutEffect, useRef } from 'react'
import { ABOUT } from '../data'
import { gsap, reduced } from '../lib'

export function About() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Apple-style: words light up as the headline scrolls through the viewport.
      gsap.fromTo(
        '.about-title .scrub',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.about-title', start: 'top 82%', end: 'bottom 45%', scrub: true },
        },
      )
      // Portrait unmasks and drifts at a different speed than the page.
      gsap.fromTo(
        '.portrait',
        { clipPath: 'inset(18% 18% 18% 18%)', scale: 1.15 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.portrait-wrap', start: 'top 90%', end: 'top 30%', scrub: true },
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
      <div className="label" data-reveal>
        <span>01</span> Sobre
      </div>
      <h2 className="about-title">
        {ABOUT.title.split(' ').map((w, i) => (
          <span className="scrub" key={i}>
            {w}{' '}
          </span>
        ))}
      </h2>
      <div className="about-grid">
        <div className="portrait-wrap" data-cursor>
          <div className="portrait">
            <img src="/gustavo.png" alt="Retrato de Gustavo Agudo" loading="lazy" />
          </div>
          <span className="corner tl" />
          <span className="corner br" />
        </div>
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
