import Link from 'next/link'

import { Grid } from '@/components/grid'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

/**
 * Navigation entries displayed as a responsive button grid on the home page.
 *
 * The grid uses `repeat(auto-fit, minmax(140px, 1fr))`, which lets the column
 * count adapt to the available width: cells stay at least 140px wide so that
 * long labels like "dndkit DragOverlay" fit comfortably, and they expand to
 * share remaining space evenly when there is room. As a result the layout
 * gracefully reflows on narrow viewports without truncation tricks.
 *
 * @example
 *   { href: '/dndkit/drag-overlay', label: 'dndkit DragOverlay' }
 *   // → renders as a single full-width button label inside its grid cell.
 */
type NavLink = Readonly<{ href: string; label: string }>

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { href: '/guestbook', label: 'guestbook' },
  { href: '/tab', label: 'tab' },
  { href: '/field-array', label: 'field-array' },
  { href: '/action-prop', label: 'action-prop' },
  { href: '/react-flow', label: 'React Flow' },
  { href: '/react-flow/basics', label: 'React Flow Basics' },
  { href: '/react-flow-2', label: 'React Flow getOutgoers' },
  { href: '/activity', label: 'activity' },
  { href: '/react-query', label: 'react-query' },
  { href: '/dndkit/basic', label: 'dndkit Basic' },
  { href: '/dndkit/sortable', label: 'dndkit Sortable' },
  { href: '/dndkit/kanban', label: 'dndkit Kanban' },
  { href: '/dndkit/persisted', label: 'dndkit Persisted' },
  { href: '/dndkit/drag-overlay', label: 'dndkit DragOverlay' },
  { href: '/react-hook-form', label: 'react-hook-form' },
]

export default async function Home() {
  return (
    <Main>
      <Grid className="w-full flex-1 grid-cols-[repeat(auto-fit,minmax(140px,1fr))] content-start gap-2">
        {NAV_LINKS.map(({ href, label }) => (
          <Button key={href} asChild variant="outline" className="w-full">
            <Link href={href}>{label}</Link>
          </Button>
        ))}
      </Grid>
    </Main>
  )
}
