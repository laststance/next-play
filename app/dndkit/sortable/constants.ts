export type SortableItem = {
  id: string
  title: string
  description: string
}

export const SORTABLE_INDEX_DISPLAY_OFFSET = 1

export const INITIAL_SORTABLE_ITEMS: SortableItem[] = [
  {
    id: 'discover',
    title: 'Discover the API',
    description: 'Start with DragDropProvider, useSortable, and isSortable.',
  },
  {
    id: 'drag',
    title: 'Drag an item',
    description: 'Pick up one row and move it to a new position.',
  },
  {
    id: 'inspect',
    title: 'Inspect drag end',
    description: 'Read initialIndex and index from the sortable source.',
  },
  {
    id: 'reorder',
    title: 'Reorder React state',
    description: 'Move the item in the array so the UI keeps the new order.',
  },
  {
    id: 'reset',
    title: 'Reset and repeat',
    description: 'Return to the starting order and practice the loop again.',
  },
]
