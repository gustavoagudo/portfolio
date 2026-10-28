import { useLayoutEffect, useRef } from 'react'
import { STACKS } from '../data'
import { gsap, reduced, scrollVelocity } from '../lib'
import { StackIcon } from './StackIcon'

const rowA = STACKS.slice(0, 6)
const rowB = STACKS.slice(6)

function Row({ items }: { items: typeof STACKS }) {
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {loop.map((s, i) => (
          <StackIcon key={i} name={s.name} color={s.color} className="marquee-icon" />
        ))}
      </div>
    </div>
  )
}

export function Stack() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Rows drift continuously in opposite directions; scroll velocity pushes them harder.
      const state = gsap.utils.toArray<HTMLElement>('.marquee-track').map((el, i) => ({ el, x: 0, dir: i % 2 === 0 ? -1 : 1 }))
      const tick = () => {
        const boost = Math.min(Math.abs(scrollVelocity()) * 0.35, 14)
        state.forEach((s) => {
          const half = s.el.scrollWidth / 4
          s.x += s.dir * (0.6 + boost)
          if (s.x <= -half) s.x += half
          if (s.x >= 0) s.x -= half
          gsap.set(s.el, { x: s.x })
        })
      }
      gsap.ticker.add(tick)
      gsap.from('.spec li', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.spec', start: 'top 85%', once: true },
      })
      return () => gsap.ticker.remove(tick)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="stack" ref={root} className="section stack">
      <h2 className="label" data-reveal>
        Stack
      </h2>
      <p className="h2" data-reveal>
        Ferramentas que uso em produção.
      </p>
      <div className="marquees" aria-hidden="true">
        <Row items={rowA} />
        <Row items={rowB} />
      </div>
      <ul className="spec">
        {STACKS.map((s) => (
          <li key={s.name} style={{ ['--c' as string]: s.color }}>
            <StackIcon name={s.name} color={s.color} className="spec-icon" />
            <h3>{s.name}</h3>
            <p>{s.note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
