import { useEffect, useRef, useState } from 'react'
import { NAV } from '../data'
import { gsap, scrollToId, ScrollTrigger } from '../lib'

export function Nav({ ready }: { ready: boolean }) {
  const bar = useRef<HTMLElement>(null)
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!ready) return
    gsap.fromTo(bar.current, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out' })

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const hide = y > last && y > 240
      gsap.to(bar.current, { yPercent: hide ? -120 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const triggers = NAV.map((n) =>
      ScrollTrigger.create({
        trigger: `#${n.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (s) => s.isActive && setActive(n.id),
      }),
    )
    return () => {
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((t) => t.kill())
    }
  }, [ready])

  return (
    <header ref={bar} className="nav" style={{ opacity: 0 }}>
      <a className="nav-logo" href="#top" onClick={(e) => (e.preventDefault(), scrollToId('top'))}>
        GA<span>.</span>
      </a>
      <nav className="nav-links">
        {NAV.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={active === n.id ? 'on' : ''}
            onClick={(e) => (e.preventDefault(), scrollToId(n.id))}
          >
            <em>0{i + 1}</em> {n.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
