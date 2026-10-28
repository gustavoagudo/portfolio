import { useLayoutEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Project } from './components/Project'
import { Stack } from './components/Stack'
import { gsap, reduced, ScrollTrigger, startSmoothScroll } from './lib'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useLayoutEffect(() => {
    const stop = startSmoothScroll()

    // Generic fade-up for anything marked data-reveal. Hidden state is set here (not in CSS)
    // so the page stays fully visible when JS animation is off or reduced-motion is on.
    let batch: ScrollTrigger[] = []
    if (!reduced) {
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      gsap.set(els, { opacity: 0, y: 36 })
      batch = ScrollTrigger.batch(els, {
        start: 'top 90%',
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out' }),
      })
      gsap.to('.progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      })
    }

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      batch.forEach((t) => t.kill())
      stop()
    }
  }, [])

  return (
    <>
      {!loaded && <Preloader onReveal={() => setReady(true)} onDone={() => setLoaded(true)} />}
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Stack />
        <Experience />
        <Project />
        <Contact />
      </main>
    </>
  )
}
