import type { SortableItem } from './constants'

/**
 * Moves one sortable item from its original position to its drop position.
 * @param items - The current ordered list.
 * @param initialIndex - The item's position when dragging started.
 * @param targetIndex - The item's position when dragging ended.
 * @returns A new array with the moved item, or the original order when indexes are invalid.
 * @example
 * reorderSortableItems([{ id: 'a', title: 'A', description: 'A' }, { id: 'b', title: 'B', description: 'B' }], 0, 1)
 */
export function reorderSortableItems(
  items: SortableItem[],
  initialIndex: number,
  targetIndex: number,
): SortableItem[] {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(initialIndex, 1)

  if (movedItem === undefined) {
    return items
  }

  nextItems.splice(targetIndex, 0, movedItem)
  return nextItems
}
