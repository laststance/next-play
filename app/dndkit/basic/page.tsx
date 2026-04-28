'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { useState } from 'react'

import { DraggableCard } from '@/app/dndkit/basic/draggable-card'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

import { START_AREA_ID, DROP_ZONE_ID } from './constants'
import { DropZone } from './drop-zone'

type CardLocation = typeof START_AREA_ID | typeof DROP_ZONE_ID

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
          console.log('onDragEnd')
          if (event.canceled) {
            return
          }
          console.log(event)
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
