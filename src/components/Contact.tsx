import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CONTACT_TITLE, PROFILE } from '../data'
import { gsap, reduced } from '../lib'
import { Magnetic } from './Magnetic'
import { Split } from './Split'

const LINKS = [
  { label: 'LinkedIn', href: PROFILE.linkedin },
  { label: 'GitHub', href: PROFILE.github },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const time = useClock()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.contact-title .sc', {
        yPercent: 115,
        duration: 1.4,
        stagger: 0.03,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.contact-title', start: 'top 85%', once: true },
      })
      gsap.from('.big-link', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.big-links', start: 'top 88%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contato" ref={root} className="section contact">
      <h2 className="label" data-reveal>
        Contato
      </h2>
      <Split as="p" chars className="contact-title" text={CONTACT_TITLE} />
      <div className="big-links">
        {LINKS.map((l) => (
          <Magnetic key={l.label} strength={0.2}>
            <a className="big-link" href={l.href} target="_blank" rel="noreferrer">
              <span>{l.label}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </Magnetic>
        ))}
      </div>
      <footer className="foot">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <span>
          {PROFILE.location} · {time}
        </span>
        <span>Feito com React + TypeScript</span>
      </footer>
    </section>
  )
}
