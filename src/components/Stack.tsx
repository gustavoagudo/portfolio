import { useLayoutEffect, useRef } from 'react'
import { STACKS } from '../data'
import { gsap, isTouch, reduced, scrollVelocity } from '../lib'

const rowA = STACKS.slice(0, 6)
const rowB = STACKS.slice(6)

function Row({ items, dir }: { items: typeof STACKS; dir: 1 | -1 }) {
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="marquee" data-dir={dir}>
      <div className="marquee-track">
        {loop.map((s, i) => (
          <span className="chip" key={i} aria-hidden={i >= items.length}>
            <i style={{ background: s.color }} />
            {s.name}
          </span>
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
      // Marquee rows drift continuously; scroll velocity pushes them harder and can flip direction feel.
      const rows = gsap.utils.toArray<HTMLElement>('.marquee-track')
      const state = rows.map((el, i) => ({ el, x: 0, dir: i % 2 === 0 ? -1 : 1 }))
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
      gsap.from('.tile', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: { each: 0.06, from: 'start' },
        ease: 'expo.out',
        scrollTrigger: { trigger: '.tiles', start: 'top 85%', once: true },
      })
      return () => gsap.ticker.remove(tick)
    }, root)
    return () => ctx.revert()
  }, [])

  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (isTouch) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    gsap.to(el, { rotateX: -(py - 0.5) * 8, rotateY: (px - 0.5) * 10, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }
  const onLeave = (e: React.PointerEvent<HTMLLIElement>) =>
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })

  return (
    <section id="stack" ref={root} className="section stack">
      <div className="label" data-reveal>
        <span>02</span> Stack
      </div>
      <h2 className="h2" data-reveal>
        Ferramentas que uso <em className="serif">em produção.</em>
      </h2>
      <div className="marquees" aria-hidden="true">
        <Row items={rowA} dir={-1} />
        <Row items={rowB} dir={1} />
      </div>
      <ul className="tiles">
        {STACKS.map((s) => (
          <li className="tile" key={s.name} style={{ ['--c' as string]: s.color }} onPointerMove={onMove} onPointerLeave={onLeave}>
            <i className="tile-dot" />
            <h3>{s.name}</h3>
            <p>{s.note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
