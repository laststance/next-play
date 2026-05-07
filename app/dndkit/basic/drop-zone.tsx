import { useDroppable } from '@dnd-kit/react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { DROP_ZONE_ID } from './constants'

type DropZoneProps = {
  children?: ReactNode
  isCardInside: boolean
}

/**
 * Renders the target area that can receive the draggable card.
 * @param children - Content shown inside the drop zone.
 * @param isCardInside - Whether the card currently lives in this zone.
 * @returns A droppable panel that reflects the settled card location.
 * @example
 * <DropZone isCardInside={false}>Drop here</DropZone>
 */
export function DropZone({ children, isCardInside }: DropZoneProps) {
  const { ref } = useDroppable({
    id: DROP_ZONE_ID,
  })

  return (
    <section
      ref={ref}
      className={cn(
        'border-muted-foreground/30 bg-muted/30 flex min-h-52 flex-col justify-center rounded-2xl border-2 border-dashed p-5 transition',
        isCardInside && 'border-primary/60 bg-primary/5',
      )}
    >
      <div className="mb-4">
        <h2 className="font-semibold">Droppable zone</h2>
        <p className="text-muted-foreground text-sm">
          `useDroppable` registers this panel as the drop target.
        </p>
      </div>
      {children ?? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-center text-sm">
          Drop the card here
        </div>
      )}
    </section>
  )
}
