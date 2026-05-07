export type PersistedSortableItem = {
  id: string
  title: string
  description: string
}

export const PERSISTED_SORTABLE_INDEX_DISPLAY_OFFSET = 1
export const PERSISTED_SORTABLE_STORAGE_KEY =
  'next-play:dndkit:persisted-sortable-items'
export const PERSISTED_SORTABLE_STORAGE_EVENT =
  'next-play:dndkit:persisted-sortable-items-change'

export const INITIAL_PERSISTED_SORTABLE_ITEMS: PersistedSortableItem[] = [
  {
    id: 'read-from-storage',
    title: 'Read from storage',
    description: 'The page subscribes to a localStorage-backed snapshot.',
  },
  {
    id: 'drag-to-reorder',
    title: 'Drag to reorder',
    description: 'dnd kit reports the sortable source and target indexes.',
  },
  {
    id: 'save-after-drop',
    title: 'Save after drop',
    description: 'The reordered array is written back to localStorage.',
  },
  {
    id: 'refresh-to-check',
    title: 'Refresh to check',
    description: 'Reload the page and confirm the order is still there.',
  },
  {
    id: 'reset-storage',
    title: 'Reset storage',
    description: 'Clear the saved order and return to the initial list.',
  },
]
