import { useEffect, useRef } from 'react'
import { reduced } from '../lib'

type Node = { x: number; y: number; vx: number; vy: number }
type Packet = { a: number; b: number; t: number; speed: number }

/** Drifting graph of nodes with packets travelling along edges — "requests" flowing through a system. */
export function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999 }
    let nodes: Node[] = []
    const packets: Packet[] = []
    const LINK = 150

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 16000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    const spawnPacket = () => {
      const a = Math.floor(Math.random() * nodes.length)
      const near: number[] = []
      nodes.forEach((n, i) => {
        if (i !== a && Math.hypot(n.x - nodes[a].x, n.y - nodes[a].y) < LINK) near.push(i)
      })
      if (near.length) packets.push({ a, b: near[Math.floor(Math.random() * near.length)], t: 0, speed: 0.012 + Math.random() * 0.012 })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < 160 && d > 0) {
            n.x += (dx / d) * (160 - d) * 0.012
            n.y += (dy / d) * (160 - d) * 0.012
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(120,160,150,${(1 - d / LINK) * 0.22})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(190,210,205,.5)'
        ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3)
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.t += p.speed
        if (p.t >= 1) {
          packets.splice(i, 1)
          continue
        }
        const A = nodes[p.a]
        const B = nodes[p.b]
        const x = A.x + (B.x - A.x) * p.t
        const y = A.y + (B.y - A.y) * p.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12)
        g.addColorStop(0, 'rgba(61,255,168,.95)')
        g.addColorStop(1, 'rgba(61,255,168,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced && packets.length < 9 && Math.random() < 0.06) spawnPacket()
    }

    const loop = () => {
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    if (reduced) draw()
    else raf = requestAnimationFrame(loop)

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="net" aria-hidden="true" />
}
