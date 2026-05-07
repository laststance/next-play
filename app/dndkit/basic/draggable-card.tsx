import { useDraggable } from '@dnd-kit/react'

import { DRAGGABLE_CARD_ID } from '@/app/dndkit/basic/constants'
import { Button } from '@/components/ui/button'

/**
 * Renders the learning card that dnd kit can move between zones.
 * @returns A keyboard-focusable draggable card.
 * @example
 * <DraggableCard />
 */
export function DraggableCard() {
  const { handleRef, ref } = useDraggable({
    id: DRAGGABLE_CARD_ID,
  })

  return (
    <article
      ref={ref}
      className="border-primary/30 bg-background flex min-h-28 flex-col gap-3 rounded-xl border p-4 shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Draggable card</h2>
          <p className="text-muted-foreground text-sm">
            `useDraggable` gives this card its drag behavior.
          </p>
        </div>
        <Button ref={handleRef} size="sm" type="button" variant="secondary">
          Drag
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Drag handle: `handleRef` / Card body: `ref`
      </p>
    </article>
  )
}
