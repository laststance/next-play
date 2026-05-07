import type { KanbanColumnId, KanbanColumns } from './constants'

const KANBAN_COLUMN_IDS = ['backlog', 'doing', 'done']

/**
 * Checks whether a dnd kit group value belongs to this Kanban board.
 * @param value - The group value reported by dnd kit.
 * @returns `true` when the value is one of this board's column IDs.
 * @example
 * isKanbanColumnId('doing') // => true
 */
export function isKanbanColumnId(value: unknown): value is KanbanColumnId {
  return typeof value === 'string' && KANBAN_COLUMN_IDS.includes(value)
}

/**
 * Copies the board columns so reset and cancellation do not share mutable arrays.
 * @param columns - The current board grouped by column ID.
 * @returns A new board object with cloned card arrays.
 * @example
 * cloneKanbanColumns(INITIAL_KANBAN_COLUMNS)
 */
export function cloneKanbanColumns(columns: KanbanColumns): KanbanColumns {
  return {
    backlog: [...columns.backlog],
    doing: [...columns.doing],
    done: [...columns.done],
  }
}

/**
 * Moves a card either within one column or from one column to another.
 * @param columns - The current board grouped by column ID.
 * @param initialGroup - The column where the drag started.
 * @param targetGroup - The column where dnd kit says the card landed.
 * @param initialIndex - The card index when dragging started.
 * @param targetIndex - The card index when dragging ended.
 * @returns A new board with the card moved, or the original board when the source card is missing.
 * @example
 * moveKanbanCard(columns, 'backlog', 'doing', 0, 1)
 */
export function moveKanbanCard(
  columns: KanbanColumns,
  initialGroup: KanbanColumnId,
  targetGroup: KanbanColumnId,
  initialIndex: number,
  targetIndex: number,
): KanbanColumns {
  if (initialGroup === targetGroup) {
    const targetColumnCards = [...columns[targetGroup]]
    const [movedCard] = targetColumnCards.splice(initialIndex, 1)

    if (movedCard === undefined) {
      return columns
    }

    targetColumnCards.splice(targetIndex, 0, movedCard)

    return {
      ...columns,
      [targetGroup]: targetColumnCards,
    }
  }

  const sourceColumnCards = [...columns[initialGroup]]
  const targetColumnCards = [...columns[targetGroup]]
  const [movedCard] = sourceColumnCards.splice(initialIndex, 1)

  if (movedCard === undefined) {
    return columns
  }

  targetColumnCards.splice(targetIndex, 0, movedCard)

  return {
    ...columns,
    [initialGroup]: sourceColumnCards,
    [targetGroup]: targetColumnCards,
  }
}
