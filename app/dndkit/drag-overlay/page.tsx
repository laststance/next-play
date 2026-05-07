'use client'

import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { scheduleAfterDragCleanup } from '@/app/dndkit/functions'
import { LessonPanel } from '@/components/dnd-kit'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const START_ZONE_ID = 'start'
const DROPPED_ZONE_ID = 'dropped'
const NO_OVERLAY_DRAGGABLE_ID = 'no-overlay-card'
const WITH_OVERLAY_DRAGGABLE_ID = 'with-overlay-card'
const NO_OVERLAY_DROP_ZONE_ID = 'no-overlay-drop-zone'
const WITH_OVERLAY_DROP_ZONE_ID = 'with-overlay-drop-zone'
const DRAG_OVERLAY_CARD_TYPE = 'drag-overlay-card'

type CardLocation = typeof START_ZONE_ID | typeof DROPPED_ZONE_ID

type OverlayComparisonPanelProps = {
  draggableId: string
  dropZoneId: string
  hasOverlay: boolean
  title: string
}

type ComparisonCardProps = {
  draggableId: string
  hasOverlay: boolean
}

type ComparisonDropZoneProps = {
  children?: ReactNode
  dropZoneId: string
  isCardInside: boolean
}

/**
 * Renders a draggable card used by both overlay comparison examples.
 * @param draggableId - The unique dnd kit ID for this comparison card.
 * @param hasOverlay - Whether this example also renders a DragOverlay preview.
 * @returns A draggable card whose original element stays visible for comparison.
 * @example
 * <ComparisonCard draggableId="with-overlay-card" hasOverlay />
 */
function ComparisonCard({ draggableId, hasOverlay }: ComparisonCardProps) {
  const { handleRef, isDragging, ref } = useDraggable({
    id: draggableId,
    type: DRAG_OVERLAY_CARD_TYPE,
  })

  return (
    <article
      ref={ref}
      className={cn(
        'bg-background border-primary/30 flex min-h-28 cursor-grab flex-col gap-3 rounded-xl border p-4 shadow-sm transition active:cursor-grabbing',
        isDragging && 'scale-[0.98] opacity-60',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            {hasOverlay ? 'Card with overlay' : 'Card without overlay'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {hasOverlay
              ? 'The preview can look different from this original element.'
              : 'Only the original draggable element provides visual feedback.'}
          </p>
        </div>
        <Button ref={handleRef} size="sm" type="button" variant="secondary">
          Drag
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        draggable id: `{draggableId}`
      </p>
    </article>
  )
}

/**
 * Renders the target area shared by both comparison examples.
 * @param children - The card content when it has been dropped.
 * @param dropZoneId - The unique target ID for this comparison panel.
 * @param isCardInside - Whether the draggable card currently lives in the drop zone.
 * @returns A droppable area that highlights while the card is above it.
 * @example
 * <ComparisonDropZone isCardInside={false}>Drop here</ComparisonDropZone>
 */
function ComparisonDropZone({
  children,
  dropZoneId,
  isCardInside,
}: ComparisonDropZoneProps) {
  const { isDropTarget, ref } = useDroppable({
    accept: DRAG_OVERLAY_CARD_TYPE,
    id: dropZoneId,
  })

  return (
    <section
      ref={ref}
      className={cn(
        'border-muted-foreground/30 bg-muted/30 flex min-h-48 flex-col justify-center rounded-2xl border-2 border-dashed p-4 transition',
        isDropTarget && 'border-primary bg-primary/10',
        isCardInside && 'border-primary/60 bg-primary/5',
      )}
    >
      {children ?? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-center text-sm">
          Drop here
        </div>
      )}
    </section>
  )
}

/**
 * Renders the custom preview shown by DragOverlay while dragging.
 * @param sourceId - The active draggable source ID reported by dnd kit.
 * @returns A preview card that is visually different from the original element.
 * @example
 * <OverlayPreview sourceId="with-overlay-card" />
 */
function OverlayPreview({ sourceId }: { sourceId: string }) {
  return (
    <div className="bg-primary text-primary-foreground max-w-80 rounded-2xl border p-4">
      <p className="text-sm font-semibold">DragOverlay preview</p>
      <p className="mt-2 text-sm opacity-90">
        This floating preview follows the pointer. Source: `{sourceId}`
      </p>
    </div>
  )
}

/**
 * Renders one isolated drag/drop example so overlay and non-overlay behavior can be compared.
 * @param draggableId - The draggable ID used in this example.
 * @param dropZoneId - The unique droppable ID used in this provider.
 * @param hasOverlay - Whether to render DragOverlay inside this provider.
 * @param title - The panel heading.
 * @returns A complete DragDropProvider example.
 * @example
 * <OverlayComparisonPanel draggableId="with-overlay-card" hasOverlay title="With DragOverlay" />
 */
function OverlayComparisonPanel({
  draggableId,
  dropZoneId,
  hasOverlay,
  title,
}: OverlayComparisonPanelProps) {
  const [cardLocation, setCardLocation] = useState<CardLocation>(START_ZONE_ID)
  const isCardInDropZone = cardLocation === DROPPED_ZONE_ID

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) {
          return
        }

        const didDropOnTarget = event.operation.target?.id === dropZoneId

        scheduleAfterDragCleanup(() => {
          setCardLocation(didDropOnTarget ? DROPPED_ZONE_ID : START_ZONE_ID)
        })
      }}
    >
      <section className="bg-card flex flex-col gap-4 rounded-2xl border p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-muted-foreground text-sm">
              {hasOverlay
                ? 'A separate floating preview is rendered during drag.'
                : 'No separate preview is rendered during drag.'}
            </p>
          </div>
          <Button
            disabled={!isCardInDropZone}
            onClick={() => setCardLocation(START_ZONE_ID)}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="bg-background flex min-h-48 flex-col justify-center rounded-2xl border p-4">
            {!isCardInDropZone ? (
              <ComparisonCard
                draggableId={draggableId}
                hasOverlay={hasOverlay}
              />
            ) : (
              <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-center text-sm">
                Card moved to the drop zone
              </div>
            )}
          </section>

          <ComparisonDropZone
            dropZoneId={dropZoneId}
            isCardInside={isCardInDropZone}
          >
            {isCardInDropZone ? (
              <ComparisonCard
                draggableId={draggableId}
                hasOverlay={hasOverlay}
              />
            ) : undefined}
          </ComparisonDropZone>
        </div>
      </section>

      {hasOverlay ? (
        <DragOverlay dropAnimation={null}>
          {(source) => <OverlayPreview sourceId={String(source.id)} />}
        </DragOverlay>
      ) : null}
    </DragDropProvider>
  )
}

/**
 * Teaches what DragOverlay changes by showing the same interaction with and without it.
 * @returns A side-by-side DragOverlay comparison playground.
 * @example
 * <Page />
 */
export default function Page() {
  return (
    <Main className="max-w-7xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          dnd kit DragOverlay
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            DragOverlay Comparison Playground
          </h1>
          <p className="text-muted-foreground max-w-3xl text-sm">
            Drag the cards in both panels. Without `DragOverlay`, the original
            draggable element is the main visual feedback. With `DragOverlay`,
            dnd kit renders a separate floating preview while the original
            element can keep its own in-place style.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <OverlayComparisonPanel
          draggableId={NO_OVERLAY_DRAGGABLE_ID}
          dropZoneId={NO_OVERLAY_DROP_ZONE_ID}
          hasOverlay={false}
          title="Without DragOverlay"
        />
        <OverlayComparisonPanel
          draggableId={WITH_OVERLAY_DRAGGABLE_ID}
          dropZoneId={WITH_OVERLAY_DROP_ZONE_ID}
          hasOverlay
          title="With DragOverlay"
        />
      </div>

      <LessonPanel
        items={[
          '`DragOverlay` should be rendered once inside a `DragDropProvider`.',
          'The overlay is a separate preview, so it can look different from the source element.',
          'The original draggable can stay dimmed or fixed in the layout while the overlay follows the pointer.',
          '`dropAnimation={null}` disables the drop animation so this playground is easier to compare.',
          'Use overlays for rich previews, drag clones, or cases where the original element should not visually stretch.',
        ]}
        title="What to watch"
      />
    </Main>
  )
}
