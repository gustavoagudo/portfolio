import { siDocker, siExpress, siMongodb, siNodedotjs, siPostgresql, siPrisma, siReact, siRedis, siTypescript } from 'simple-icons'

// Official marks come from simple-icons. AWS, Playwright and REST are not in that set, so they are drawn here.
const BRAND: Record<string, string> = {
  TypeScript: siTypescript.path,
  'Node.js': siNodedotjs.path,
  Express: siExpress.path,
  PostgreSQL: siPostgresql.path,
  Prisma: siPrisma.path,
  Redis: siRedis.path,
  MongoDB: siMongodb.path,
  Docker: siDocker.path,
  React: siReact.path,
}

const DRAWN: Record<string, JSX.Element> = {
  AWS: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 6.5h6M3 11h10M3 15.5h7" />
      <path d="M14 18.5c3 1.5 6.5 1.2 7-.4" />
      <path d="m19.5 16.5 1.8 1.6-2.2 1" />
    </g>
  ),
  Playwright: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M9.6 8.4 16 12l-6.4 3.6z" />
    </g>
  ),
  'APIs REST': (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="5" cy="6.5" r="2.4" />
      <circle cx="5" cy="17.5" r="2.4" />
      <circle cx="19" cy="12" r="2.4" />
      <path d="M7.2 7.6 16.8 11M7.2 16.4 16.8 13" />
    </g>
  ),
}

export function StackIcon({ name, color, className }: { name: string; color: string; className?: string }) {
  const path = BRAND[name]
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ color }} role="img" aria-label={name}>
      {path ? <path d={path} fill="currentColor" /> : DRAWN[name]}
    </svg>
  )
}
