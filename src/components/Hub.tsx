import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, reduced } from '../lib'

type Geo = {
  W: number
  H: number
  nw: number
  nh: number
  nodes: { id: number; x: number; y: number }[]
  core: { x: number; y: number; s: number }
  sink: { x: number; y: number; w: number; h: number }
  out: { x1: number; y1: number; x2: number; y2: number }
}

const ids = Array.from({ length: 8 }, (_, i) => i + 1)

// Eight banks on one side converge on the integration layer, which hands one shape to the system.
const WIDE: Geo = {
  W: 900,
  H: 520,
  nw: 112,
  nh: 44,
  nodes: ids.map((id, i) => ({ id, x: 90, y: 42 + i * 62 })),
  core: { x: 470, y: 260, s: 100 },
  sink: { x: 760, y: 234, w: 118, h: 52 },
  out: { x1: 520, y1: 260, x2: 760, y2: 260 },
}

const NARROW: Geo = {
  W: 360,
  H: 380,
  nw: 110,
  nh: 36,
  nodes: ids.map((id, i) => ({ id, x: 64, y: 26 + i * 46 })),
  core: { x: 262, y: 180, s: 92 },
  sink: { x: 206, y: 300, w: 112, h: 52 },
  out: { x1: 262, y1: 226, x2: 262, y2: 300 },
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

export function Hub() {
  const root = useRef<SVGSVGElement>(null)
  const narrow = useNarrow()
  const g = narrow ? NARROW : WIDE

  useLayoutEffect(() => {
    if (reduced) return
    const stage = root.current!.closest<HTMLElement>('.hub-stage')!
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGLineElement>('.hub-in')
      const len = (l: SVGLineElement) =>
        Math.hypot(+l.getAttribute('x2')! - +l.getAttribute('x1')!, +l.getAttribute('y2')! - +l.getAttribute('y1')!)
      lines.forEach((l) => gsap.set(l, { strokeDasharray: len(l), strokeDashoffset: len(l) }))
      const out = root.current!.querySelector<SVGLineElement>('.hub-out')!
      gsap.set(out, { strokeDasharray: len(out), strokeDashoffset: len(out) })
      gsap.set(['.hub-node', '.hub-core', '.hub-sink'], { opacity: 0 })
      gsap.set('.hub-packet', { opacity: 0 })
      gsap.set('.hub-caption', { opacity: 0, y: 12 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: stage, start: 'top top', end: '+=140%', pin: true, scrub: 0.8 },
        defaults: { ease: 'none' },
      })
      tl.to('.hub-node', { opacity: 1, stagger: 0.12, duration: 0.4 })
        .to('.hub-in', { strokeDashoffset: 0, stagger: 0.1, duration: 0.6 }, '<0.2')
        .to('.hub-core', { opacity: 1, duration: 0.4 }, '>-0.1')
        .to('.hub-out', { strokeDashoffset: 0, duration: 0.5 }, '>-0.1')
        .to('.hub-sink', { opacity: 1, duration: 0.4 }, '>-0.1')
        .to('.hub-caption', { opacity: 1, y: 0, duration: 0.3 }, '<')

      // Once built, small packets run bank → layer → system on a loop, independent of scroll.
      const flow = gsap.timeline({ repeat: -1, paused: true })
      lines.forEach((l, i) => {
        const p = root.current!.querySelector<SVGRectElement>(`.hub-packet[data-i="${i}"]`)!
        flow
          .fromTo(
            p,
            { attr: { x: +l.getAttribute('x1')! - 3.5, y: +l.getAttribute('y1')! - 3.5 }, opacity: 1 },
            { attr: { x: +l.getAttribute('x2')! - 3.5, y: +l.getAttribute('y2')! - 3.5 }, duration: 1.1, ease: 'power1.inOut' },
            i * 0.32,
          )
          .to(p, { opacity: 0, duration: 0.15 }, '>-0.15')
      })
      const o = g.out
      flow.fromTo(
        '.hub-packet-out',
        { attr: { x: o.x1 - 3.5, y: o.y1 - 3.5 }, opacity: 1 },
        { attr: { x: o.x2 - 3.5, y: o.y2 - 3.5 }, duration: 0.9, repeat: 6, ease: 'power1.inOut', repeatDelay: 0.7 },
        1.1,
      )
      tl.eventCallback('onUpdate', () => {
        if (tl.progress() > 0.9) flow.play()
        else flow.pause(0)
      })
    }, stage)
    return () => ctx.revert()
  }, [g])

  const { core, sink, out, nw, nh } = g
  return (
    <svg
      ref={root}
      className="hub"
      viewBox={`0 0 ${g.W} ${g.H}`}
      role="img"
      aria-label="Oito bancos, cada um com seu contrato, convergindo em uma camada de integração que devolve um formato único"
    >
      {g.nodes.map((n) => (
        <line key={`l${n.id}`} className="hub-in" x1={n.x + nw / 2} y1={n.y} x2={core.x - core.s / 2} y2={core.y} />
      ))}
      <line className="hub-out" x1={out.x1} y1={out.y1} x2={out.x2} y2={out.y2} />
      {g.nodes.map((n) => (
        <g key={`n${n.id}`} className="hub-node" transform={`translate(${n.x - nw / 2} ${n.y - nh / 2})`}>
          <rect width={nw} height={nh} />
          <text x="12" y={nh / 2 + 4}>
            BANCO {String(n.id).padStart(2, '0')}
          </text>
          <rect x={nw - 24} y={nh / 2 - 8} width="12" height="2" className="hub-tag" />
          <rect x={nw - 30} y={nh / 2 - 1} width="18" height="2" className="hub-tag" />
          <rect x={nw - 20} y={nh / 2 + 6} width="8" height="2" className="hub-tag" />
        </g>
      ))}
      <g className="hub-core" transform={`translate(${core.x} ${core.y})`}>
        <rect x={-core.s / 2} y={-core.s / 2} width={core.s} height={core.s} />
        <rect x={-core.s / 2 + 10} y={-core.s / 2 + 10} width={core.s - 20} height={core.s - 20} className="inner" />
        <text y="-3" textAnchor="middle">CAMADA DE</text>
        <text y="12" textAnchor="middle">INTEGRAÇÃO</text>
      </g>
      <g className="hub-sink" transform={`translate(${sink.x} ${sink.y})`}>
        <rect width={sink.w} height={sink.h} />
        <text x="14" y={sink.h / 2 - 3}>FORMATO</text>
        <text x="14" y={sink.h / 2 + 13}>ÚNICO</text>
      </g>
      {g.nodes.map((n, i) => (
        <rect key={`p${n.id}`} className="hub-packet" data-i={i} width="7" height="7" x="0" y="0" />
      ))}
      <rect className="hub-packet hub-packet-out" width="7" height="7" x={out.x1 - 3.5} y={out.y1 - 3.5} />
    </svg>
  )
}
