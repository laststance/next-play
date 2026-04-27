'use client'

import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DRAGGABLE_CARD_ID = 'draggable-card'
const DROP_ZONE_ID = 'drop-zone'
const START_AREA_ID = 'start-area'

type CardLocation = typeof START_AREA_ID | typeof DROP_ZONE_ID

/**
 * Renders the learning card that dnd kit can move between zones.
 * @returns A keyboard-focusable draggable card with live visual feedback.
 * @example
 * <DraggableCard />
 */
function DraggableCard() {
  const { handleRef, isDragging, ref } = useDraggable({
    id: DRAGGABLE_CARD_ID,
  })

  return (
    <article
      ref={ref}
      className={cn(
        'border-primary/30 bg-background flex min-h-28 flex-col gap-3 rounded-xl border p-4 shadow-sm transition',
        isDragging && 'scale-105 opacity-70 shadow-lg',
      )}
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

type DropZoneProps = {
  children?: ReactNode
  isCardInside: boolean
}

/**
 * Renders the target area that can receive the draggable card.
 * @param children - Content shown inside the drop zone.
 * @param isCardInside - Whether the card currently lives in this zone.
 * @returns A droppable panel that highlights while it is the active target.
 * @example
 * <DropZone isCardInside={false}>Drop here</DropZone>
 */
function DropZone({ children, isCardInside }: DropZoneProps) {
  const { isDropTarget, ref } = useDroppable({
    id: DROP_ZONE_ID,
  })

  return (
    <section
      ref={ref}
      className={cn(
        'border-muted-foreground/30 bg-muted/30 flex min-h-52 flex-col justify-center rounded-2xl border-2 border-dashed p-5 transition',
        isDropTarget && 'border-primary bg-primary/10',
        isCardInside && 'border-primary/60 bg-primary/5',
      )}
    >
      <div className="mb-4">
        <h2 className="font-semibold">Droppable zone</h2>
        <p className="text-muted-foreground text-sm">
          `useDroppable` exposes `isDropTarget` for hover feedback.
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

/**
 * Teaches the minimum dnd kit loop: attach refs, drag, drop, then update React state.
 * @returns A one-page playground for draggable and droppable basics.
 * @example
 * <Page />
 */
export default function Page() {
  const [cardLocation, setCardLocation] = useState<CardLocation>(START_AREA_ID)

  const isCardInDropZone = cardLocation === DROP_ZONE_ID

  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          dnd kit basics
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Draggable + Droppable Playground
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Drag the card into the drop zone. The important lesson is that dnd
              kit detects the gesture, then `onDragEnd` updates React state.
            </p>
          </div>
          <Button
            disabled={!isCardInDropZone}
            onClick={() => setCardLocation(START_AREA_ID)}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </header>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) {
            return
          }

          const didDropOnTarget = event.operation.target?.id === DROP_ZONE_ID
          setCardLocation(didDropOnTarget ? DROP_ZONE_ID : START_AREA_ID)
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <section className="bg-card flex min-h-52 flex-col justify-center rounded-2xl border p-5">
            <div className="mb-4">
              <h2 className="font-semibold">Start area</h2>
              <p className="text-muted-foreground text-sm">
                The card renders here until `onDragEnd` sees the drop zone.
              </p>
            </div>
            {!isCardInDropZone ? (
              <DraggableCard />
            ) : (
              <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-center text-sm">
                Card moved to the drop zone
              </div>
            )}
          </section>

          <DropZone isCardInside={isCardInDropZone}>
            {isCardInDropZone ? <DraggableCard /> : undefined}
          </DropZone>
        </div>
      </DragDropProvider>

      <section className="bg-muted/40 rounded-2xl border p-5">
        <h2 className="mb-3 font-semibold">What to watch</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
          <li>`useDraggable` attaches drag behavior to the card.</li>
          <li>`useDroppable` marks the target and exposes hover state.</li>
          <li>`DragDropProvider` receives the final drag operation.</li>
          <li>React state decides where the card renders after drop.</li>
        </ol>
      </section>
    </Main>
  )
}
