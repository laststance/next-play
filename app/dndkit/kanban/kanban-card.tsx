import { OptimisticSortingPlugin } from '@dnd-kit/dom/sortable'
import { useSortable } from '@dnd-kit/react/sortable'

import type { KanbanCard, KanbanColumnId } from './constants'
import { KANBAN_CARD_TYPE, KANBAN_INDEX_DISPLAY_OFFSET } from './constants'

type KanbanCardItemProps = {
  card: KanbanCard
  columnId: KanbanColumnId
  index: number
}

/**
 * Renders one Kanban card that can move within and across sortable columns.
 * @param card - The visible card data.
 * @param columnId - The column group this card currently belongs to.
 * @param index - The card's current zero-based index inside its column.
 * @returns A sortable Kanban card connected to dnd kit.
 * @example
 * <KanbanCardItem card={card} columnId="backlog" index={0} />
 */
export function KanbanCardItem({ card, columnId, index }: KanbanCardItemProps) {
  const { ref } = useSortable({
    accept: KANBAN_CARD_TYPE,
    group: columnId,
    id: card.id,
    index,
    plugins: (sortablePlugins) =>
      sortablePlugins.filter(
        (sortablePlugin) => !Object.is(sortablePlugin, OptimisticSortingPlugin),
      ),
    transition: null,
    type: KANBAN_CARD_TYPE,
  })

  return (
    <li
      ref={ref}
      className="bg-background flex min-h-28 flex-col gap-3 rounded-xl border p-4 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{card.title}</h3>
          <p className="text-muted-foreground text-sm">{card.description}</p>
        </div>
        <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {index + KANBAN_INDEX_DISPLAY_OFFSET}
        </span>
      </div>
      <p className="text-muted-foreground text-xs">
        group: `{columnId}` / index: `{index}`
      </p>
    </li>
  )
}
