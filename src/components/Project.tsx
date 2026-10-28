import { useLayoutEffect, useRef } from 'react'
import { PROFILE, PROJECT } from '../data'
import { gsap, reduced } from '../lib'
import { Magnetic } from './Magnetic'

// Illustrative snippets, one per feature panel (not real scraped data).
const VISUALS = [
  <pre key="a" className="code">
    <span className="c-dim">$ collect --market all</span>
    {'\n'}
    <span className="c-ok">✓</span> render page <span className="c-dim">(playwright)</span>
    {'\n'}
    <span className="c-ok">✓</span> selector fallback <span className="c-dim">layout changed</span>
    {'\n'}
    <span className="c-ok">✓</span> prices extracted
  </pre>,
  <div key="b" className="match">
    <div className="m-row">Leite Integral 1L</div>
    <div className="m-link">
      <i />
      <b>mesmo produto</b>
      <i />
    </div>
    <div className="m-row">LEITE INT. 1000ML</div>
  </div>,
  <pre key="c" className="code">
    <span className="c-dim">GET /v1/comparison</span>
    {'\n'}
    {'{'}
    {'\n'}
    {'  '}
    <span className="c-key">"product"</span>: <span className="c-str">"…"</span>,{'\n'}
    {'  '}
    <span className="c-key">"offers"</span>: [ … ]{'\n'}
    {'}'}
  </pre>,
]

export function Project() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const track = root.current!.querySelector<HTMLElement>('.h-track')!
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.h-pin',
          pin: true,
          scrub: 0.7,
          start: 'top top',
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('.h-panel.feat').forEach((p) => {
        gsap.from(p.querySelectorAll('.feat-n, h3, p, .visual'), {
          y: 50,
          opacity: 0,
          stagger: 0.08,
          ease: 'expo.out',
          duration: 1,
          scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 80%', toggleActions: 'play none none reverse' },
        })
      })
      gsap.to('.h-progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.h-pin', start: 'top top', end: () => `+=${dist()}`, scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="projetos" ref={root} className="projects">
      <div className="h-pin">
        <div className="h-track">
          <div className="h-panel intro">
            <h2 className="label">Projeto em destaque</h2>
            <p className="giant">{PROJECT.title}</p>
            <p className="role">{PROJECT.tagline}</p>
            <p className="lead">{PROJECT.summary}</p>
            <Magnetic>
              <a className="btn" href={PROFILE.smartprice} target="_blank" rel="noreferrer">
                {PROJECT.host} <span aria-hidden="true">→</span>
              </a>
            </Magnetic>
          </div>
          {PROJECT.features.map((f, i) => (
            <div className="h-panel feat" key={f.title}>
              <span className="feat-n">
                {i + 1} de {PROJECT.features.length}
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <div className="visual">{VISUALS[i]}</div>
            </div>
          ))}
        </div>
        <div className="h-progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  )
}
