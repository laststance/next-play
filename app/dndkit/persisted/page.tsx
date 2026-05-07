'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useState, useSyncExternalStore } from 'react'

import { scheduleAfterDragCleanup } from '@/app/dndkit/functions'
import { LessonPanel } from '@/components/dnd-kit'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

import {
  getPersistedSortableItemsServerSnapshot,
  getPersistedSortableItemsSnapshot,
  reorderPersistedSortableItems,
  resetPersistedSortableItems,
  savePersistedSortableItems,
  subscribePersistedSortableItems,
} from './functions'
import { PersistedSortableListItem } from './persisted-sortable-item'

/**
 * Teaches persistence by saving a sortable list order to localStorage.
 * @returns A persisted sortable playground whose order survives browser refreshes.
 * @example
 * <Page />
 */
export default function Page() {
  const items = useSyncExternalStore(
    subscribePersistedSortableItems,
    getPersistedSortableItemsSnapshot,
    getPersistedSortableItemsServerSnapshot,
  )
  const [lastMoveLabel, setLastMoveLabel] = useState(
    'Order is read from localStorage',
  )

  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          dnd kit persisted
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Persisted Sortable List Playground
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm">
              Reorder the list, refresh the page, and confirm the order stays.
              This page uses `useSyncExternalStore` to read a
              localStorage-backed snapshot without a separate hydration effect.
            </p>
          </div>
          <Button
            onClick={() => {
              resetPersistedSortableItems()
              setLastMoveLabel('Saved order cleared from localStorage')
            }}
            type="button"
            variant="outline"
          >
            Reset saved order
          </Button>
        </div>
      </header>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel('Drag canceled, saved order unchanged')
            })
            return
          }

          const { source, target } = event.operation

          if (!isSortable(source) || target === null || target === undefined) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel(
                'Missing sortable source or target, saved order unchanged',
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
            const nextItems = reorderPersistedSortableItems(
              items,
              initialIndex,
              targetIndex,
            )

            savePersistedSortableItems(nextItems)
            setLastMoveLabel(
              `Saved move from ${initialIndex} to ${targetIndex}`,
            )
          })
        }}
      >
        <section className="bg-card rounded-2xl border p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-semibold">Persisted sortable list</h2>
              <p className="text-muted-foreground text-sm">
                Each drop writes the reordered array to localStorage.
              </p>
            </div>
            <p className="text-muted-foreground text-sm">{lastMoveLabel}</p>
          </div>

          <ul className="space-y-3">
            {items.map((item, index) => (
              <PersistedSortableListItem
                key={item.id}
                index={index}
                item={item}
              />
            ))}
          </ul>
        </section>
      </DragDropProvider>

      <LessonPanel
        items={[
          '`useSyncExternalStore` reads the current localStorage snapshot.',
          '`savePersistedSortableItems` writes the new order after drop.',
          'A custom browser event updates this same tab immediately.',
          'The `storage` event keeps other tabs in sync.',
          'Reset removes the key and returns to the initial order.',
        ]}
        title="What to watch"
      />
    </Main>
  )
}
