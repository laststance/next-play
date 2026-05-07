import { useDroppable } from '@dnd-kit/react'

import type { KanbanCard, KanbanColumn } from './constants'
import { KANBAN_CARD_TYPE, KANBAN_COLUMN_COLLISION_PRIORITY } from './constants'
import { KanbanCardItem } from './kanban-card'

type KanbanColumnPanelProps = {
  cards: KanbanCard[]
  column: KanbanColumn
}

/**
 * Renders a Kanban column that accepts sortable cards, including when it is empty.
 * @param cards - The cards currently assigned to this column.
 * @param column - The visible column metadata and droppable ID.
 * @returns A droppable column containing sortable card rows.
 * @example
 * <KanbanColumnPanel column={column} cards={cards} />
 */
export function KanbanColumnPanel({ cards, column }: KanbanColumnPanelProps) {
  const { ref } = useDroppable({
    accept: KANBAN_CARD_TYPE,
    collisionPriority: KANBAN_COLUMN_COLLISION_PRIORITY,
    id: column.id,
    type: 'column',
  })

  return (
    <section
      ref={ref}
      className="bg-card flex min-h-96 flex-col rounded-2xl border p-4 transition"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{column.title}</h2>
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
            {cards.length}
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {column.description}
        </p>
      </div>

      {cards.length > 0 ? (
        <ul className="space-y-3">
          {cards.map((card, index) => (
            <KanbanCardItem
              key={card.id}
              card={card}
              columnId={column.id}
              index={index}
            />
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground flex min-h-40 flex-1 items-center justify-center rounded-xl border border-dashed p-4 text-center text-sm">
          Empty column. Drop a card here to practice column-level droppable
          targets.
        </div>
      )}
    </section>
  )
}
