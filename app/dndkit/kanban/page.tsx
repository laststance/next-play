'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useRef, useState } from 'react'

import { scheduleAfterDragCleanup } from '@/app/dndkit/functions'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

import {
  INITIAL_KANBAN_COLUMNS,
  KANBAN_COLUMNS,
  type KanbanColumnId,
  type KanbanColumns,
} from './constants'
import {
  cloneKanbanColumns,
  isKanbanColumnId,
  moveKanbanCard,
} from './functions'
import { KanbanColumnPanel } from './kanban-column'

/**
 * Teaches multi-column dnd kit sorting with same-column reorder and cross-column transfer.
 * @returns A Kanban playground for learning `group`, `initialGroup`, and droppable columns.
 * @example
 * <Page />
 */
export default function Page() {
  const [columns, setColumns] = useState<KanbanColumns>(() =>
    cloneKanbanColumns(INITIAL_KANBAN_COLUMNS),
  )
  const [lastMoveLabel, setLastMoveLabel] = useState('No move yet')
  const boardSnapshot = useRef<KanbanColumns>(
    cloneKanbanColumns(INITIAL_KANBAN_COLUMNS),
  )

  return (
    <Main className="max-w-7xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          dnd kit kanban
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Multi-column Kanban Playground
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm">
              Move cards inside one column or across columns. The key lesson is
              that sortable cards report `initialGroup`, `group`,
              `initialIndex`, and `index`, while empty columns need their own
              droppable target.
            </p>
          </div>
          <Button
            onClick={() => {
              const initialColumns = cloneKanbanColumns(INITIAL_KANBAN_COLUMNS)
              boardSnapshot.current = initialColumns
              setColumns(initialColumns)
              setLastMoveLabel('Reset to the initial board')
            }}
            type="button"
            variant="outline"
          >
            Reset board
          </Button>
        </div>
      </header>

      <DragDropProvider
        onDragStart={() => {
          boardSnapshot.current = cloneKanbanColumns(columns)
        }}
        onDragEnd={(event) => {
          if (event.canceled) {
            scheduleAfterDragCleanup(() => {
              setColumns(boardSnapshot.current)
              setLastMoveLabel('Drag canceled, board restored from snapshot')
            })
            return
          }

          const { source, target } = event.operation

          if (!isSortable(source) || target === null || target === undefined) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel(
                'Missing sortable source or target, board unchanged',
              )
            })
            return
          }

          const { initialGroup, initialIndex } = source
          let targetGroup: KanbanColumnId | undefined
          let targetIndex: number | undefined

          if (isSortable(target) && isKanbanColumnId(target.group)) {
            targetGroup = target.group
            targetIndex = target.index
          } else if (isKanbanColumnId(target.id)) {
            targetGroup = target.id
            targetIndex = boardSnapshot.current[targetGroup].length
          }

          if (
            !isKanbanColumnId(initialGroup) ||
            targetGroup === undefined ||
            targetIndex === undefined
          ) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel('Missing column group, board unchanged')
            })
            return
          }

          if (initialGroup === targetGroup && initialIndex === targetIndex) {
            scheduleAfterDragCleanup(() => {
              setLastMoveLabel('Dropped in the same position')
            })
            return
          }

          scheduleAfterDragCleanup(() => {
            setColumns((currentColumns) =>
              moveKanbanCard(
                currentColumns,
                initialGroup,
                targetGroup,
                initialIndex,
                targetIndex,
              ),
            )
            setLastMoveLabel(
              `Moved from ${initialGroup}[${initialIndex}] to ${targetGroup}[${targetIndex}]`,
            )
          })
        }}
      >
        <section className="grid gap-4 lg:grid-cols-3">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumnPanel
              key={column.id}
              cards={columns[column.id]}
              column={column}
            />
          ))}
        </section>
      </DragDropProvider>

      <section className="bg-muted/40 rounded-2xl border p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-semibold">What to watch</h2>
          <p className="text-muted-foreground text-sm">{lastMoveLabel}</p>
        </div>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
          <li>`group` is the card's current column.</li>
          <li>`initialGroup` is the column where dragging started.</li>
          <li>Same-column moves reorder one array.</li>
          <li>
            Cross-column moves remove from one array and insert into another.
          </li>
          <li>Column-level `useDroppable` lets empty columns receive cards.</li>
        </ol>
      </section>
    </Main>
  )
}
