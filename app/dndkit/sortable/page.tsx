'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useState } from 'react'

import { scheduleAfterDragCleanup } from '@/app/dndkit/functions'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

import { INITIAL_SORTABLE_ITEMS } from './constants'
import { reorderSortableItems } from './functions'
import { SortableListItem } from './sortable-item'

/**
 * Teaches the single-list sortable loop: drag an item, read sortable indexes, then reorder state.
 * @returns A one-page playground for learning dnd kit sortable list basics.
 * @example
 * <Page />
 */
export default function Page() {
  const [items, setItems] = useState(INITIAL_SORTABLE_ITEMS)
  const [lastMoveLabel, setLastMoveLabel] = useState('No move yet')

  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          dnd kit sortable
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Single Sortable List Playground
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Reorder the list by dragging a row. dnd kit reports the original
              and final indexes, then this page manually moves the item in React
              state.
            </p>
          </div>
          <Button
            onClick={() => {
              setItems(INITIAL_SORTABLE_ITEMS)
              setLastMoveLabel('Reset to the initial order')
            }}
            type="button"
            variant="outline"
          >
            Reset order
          </Button>
        </div>
      </header>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel('Drag canceled, order unchanged')
            })
            return
          }

          const { source, target } = event.operation

          if (!isSortable(source) || target === null || target === undefined) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel(
                'Missing sortable source or target, order unchanged',
              )
            })
            return
          }

          const { initialIndex } = source
          const targetIndex = isSortable(target) ? target.index : source.index

          if (initialIndex === targetIndex) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel('Dropped in the same position')
            })
            return
          }

          scheduleAfterDragCleanup(() => {
            setItems((currentItems) =>
              reorderSortableItems(currentItems, initialIndex, targetIndex),
            )
            setLastMoveLabel(
              `Moved item from ${initialIndex} to ${targetIndex}`,
            )
          })
        }}
      >
        <section className="bg-card rounded-2xl border p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-semibold">Sortable list</h2>
              <p className="text-muted-foreground text-sm">
                Each row calls `useSortable` with its `id` and current `index`.
              </p>
            </div>
            <p className="text-muted-foreground text-sm">{lastMoveLabel}</p>
          </div>

          <ul className="space-y-3">
            {items.map((item, index) => (
              <SortableListItem key={item.id} index={index} item={item} />
            ))}
          </ul>
        </section>
      </DragDropProvider>

      <section className="bg-muted/40 rounded-2xl border p-5">
        <h2 className="mb-3 font-semibold">What to watch</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
          <li>`useSortable` combines draggable behavior with sorting data.</li>
          <li>
            `isSortable(source)` narrows the drag source before reading indexes.
          </li>
          <li>`initialIndex` is where the item started.</li>
          <li>`index` is where dnd kit thinks the item should land.</li>
          <li>React state is still the source of truth for the final order.</li>
        </ol>
      </section>
    </Main>
  )
}
