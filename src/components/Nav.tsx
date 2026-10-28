import { useEffect, useRef, useState } from 'react'
import { NAV } from '../data'
import { gsap, lockScroll, reduced, scrollToId, ScrollTrigger, unlockScroll } from '../lib'

export function Nav({ ready }: { ready: boolean }) {
  const bar = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!ready) return
    gsap.fromTo(bar.current, { yPercent: -110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out' })

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const hide = y > last && y > 240
      gsap.to(bar.current, { yPercent: hide ? -110 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
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

  // Mobile menu: full-screen sheet that wipes down from the top.
  useEffect(() => {
    const el = menu.current!
    if (reduced) {
      el.style.clipPath = open ? 'none' : 'inset(0 0 100% 0)'
      return
    }
    gsap.to(el, { clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' })
    if (open) {
      gsap.fromTo('.menu a', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, delay: 0.25, duration: 0.8, ease: 'expo.out' })
      lockScroll()
    } else unlockScroll()
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 450 : 0)
  }

  return (
    <>
      <header ref={bar} className="nav" style={{ opacity: 0 }}>
        <a className="nav-logo" href="#top" onClick={(e) => (e.preventDefault(), go('top'))}>
          Gustavo Agudo
        </a>
        <nav className="nav-links" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'on' : ''} onClick={(e) => (e.preventDefault(), go(n.id))}>
              {n.label}
            </a>
          ))}
        </nav>
        <button className="nav-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Fechar' : 'Menu'}
        </button>
      </header>
      <div id="menu" ref={menu} className="menu" style={{ clipPath: 'inset(0 0 100% 0)' }} aria-hidden={!open}>
        <nav aria-label="Menu">
          {NAV.map((n) => (
            <span className="menu-row" key={n.id}>
              <a href={`#${n.id}`} tabIndex={open ? 0 : -1} onClick={(e) => (e.preventDefault(), go(n.id))}>
                {n.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </>
  )
}
