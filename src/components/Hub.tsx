import { useLayoutEffect, useRef } from 'react'
import { gsap, reduced } from '../lib'

const W = 900
const H = 520
const C = { x: 470, y: 260 }
// Eight banks stacked on the left, each converging on one integration layer.
const NODES = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, x: 90, y: 42 + i * 62 }))

export function Hub() {
  const root = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGLineElement>('.hub-in')
      lines.forEach((l) => {
        const len = Math.hypot(+l.getAttribute('x2')! - +l.getAttribute('x1')!, +l.getAttribute('y2')! - +l.getAttribute('y1')!)
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set('.hub-out', { strokeDasharray: 300, strokeDashoffset: 300 })
      gsap.set(['.hub-node', '.hub-core', '.hub-sink'], { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
      gsap.set('.hub-packet', { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.hub-stage', start: 'top top', end: '+=140%', pin: true, scrub: 0.8 },
        defaults: { ease: 'none' },
      })
      tl.to('.hub-node', { opacity: 1, scale: 1, stagger: 0.12, duration: 0.4, ease: 'back.out(2)' })
        .to('.hub-core', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '>-0.1')
        .to('.hub-in', { strokeDashoffset: 0, stagger: 0.1, duration: 0.6 }, '<')
        .to('.hub-out', { strokeDashoffset: 0, duration: 0.5 }, '>-0.1')
        .to('.hub-sink', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '>-0.1')
        .to('.hub-caption', { opacity: 1, y: 0, duration: 0.3 }, '<')

      // Packets flow through once everything is drawn (ambient, independent of scroll).
      const flow = gsap.timeline({ repeat: -1, paused: true })
      lines.forEach((l, i) => {
        const p = root.current!.querySelector<SVGCircleElement>(`.hub-packet[data-i="${i}"]`)!
        const x1 = +l.getAttribute('x1')!
        const y1 = +l.getAttribute('y1')!
        const x2 = +l.getAttribute('x2')!
        const y2 = +l.getAttribute('y2')!
        flow.fromTo(
          p,
          { attr: { cx: x1, cy: y1 }, opacity: 1 },
          { attr: { cx: x2, cy: y2 }, duration: 1.1, ease: 'power1.inOut' },
          i * 0.32,
        ).to(p, { opacity: 0, duration: 0.15 }, `>-0.15`)
      })
      flow.fromTo('.hub-packet-out', { attr: { cx: C.x + 40 }, opacity: 1 }, { attr: { cx: 760 }, duration: 0.9, repeat: 7, ease: 'power1.inOut', repeatDelay: 0.7 }, 0.9)
      bindFlow(tl, flow)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={root} className="hub" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Oito bancos, cada um com seu contrato, convergindo em uma camada de integração que devolve um formato único">
      <defs>
        <linearGradient id="hg" x1="0" x2="1">
          <stop offset="0" stopColor="#3dffa8" stopOpacity=".15" />
          <stop offset="1" stopColor="#3dffa8" stopOpacity=".9" />
        </linearGradient>
      </defs>
      {NODES.map((n, i) => (
        <line key={`l${i}`} className="hub-in" x1={n.x + 54} y1={n.y} x2={C.x - 50} y2={C.y} />
      ))}
      <line className="hub-out" x1={C.x + 50} y1={C.y} x2={760} y2={C.y} stroke="url(#hg)" />
      {NODES.map((n, i) => (
        <g key={`n${i}`} className="hub-node" transform={`translate(${n.x - 54} ${n.y - 22})`}>
          <rect width="108" height="44" rx="4" />
          <text x="14" y="19">BANCO</text>
          <text x="14" y="34" className="hub-num">{String(n.id).padStart(2, '0')}</text>
          <rect x="82" y="14" width="12" height="3" className="hub-tag a" />
          <rect x="76" y="22" width="18" height="3" className="hub-tag b" />
          <rect x="86" y="30" width="8" height="3" className="hub-tag c" />
        </g>
      ))}
      <g className="hub-core" transform={`translate(${C.x} ${C.y})`}>
        <rect x="-50" y="-50" width="100" height="100" rx="6" />
        <rect x="-38" y="-38" width="76" height="76" rx="3" className="inner" />
        <text y="-4" textAnchor="middle">CAMADA DE</text>
        <text y="12" textAnchor="middle">INTEGRAÇÃO</text>
      </g>
      <g className="hub-sink" transform={`translate(760 ${C.y})`}>
        <rect x="0" y="-26" width="118" height="52" rx="4" />
        <text x="14" y="-4">FORMATO</text>
        <text x="14" y="14">ÚNICO</text>
      </g>
      {NODES.map((_, i) => (
        <circle key={`p${i}`} className="hub-packet" data-i={i} r="4" cx="0" cy="0" />
      ))}
      <circle className="hub-packet hub-packet-out" r="4" cx={C.x + 40} cy={C.y} />
    </svg>
  )
}

/** Starts the ambient packet flow once the scrubbed build-up passes 90%, pauses it when scrolling back. */
function bindFlow(tl: gsap.core.Timeline, flow: gsap.core.Timeline) {
  tl.eventCallback('onUpdate', () => {
    if (tl.progress() > 0.9) flow.play()
    else flow.pause(0)
  })
}
