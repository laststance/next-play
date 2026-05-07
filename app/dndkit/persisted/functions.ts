import {
  INITIAL_PERSISTED_SORTABLE_ITEMS,
  PERSISTED_SORTABLE_STORAGE_EVENT,
  PERSISTED_SORTABLE_STORAGE_KEY,
  type PersistedSortableItem,
} from './constants'

let cachedStoredValue: string | null | undefined
let cachedSnapshot = getInitialPersistedSortableItems()

/**
 * Checks whether a value is a plain object that can be inspected safely.
 * @param value - The unknown value to inspect.
 * @returns `true` when the value is a non-array object.
 * @example
 * isRecord({ id: 'a' }) // => true
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Checks whether a parsed value matches the persisted sortable item shape.
 * @param value - The parsed value to validate.
 * @returns `true` when the value has string id, title, and description fields.
 * @example
 * isPersistedSortableItem({ id: 'a', title: 'A', description: 'Learn' }) // => true
 */
function isPersistedSortableItem(
  value: unknown,
): value is PersistedSortableItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  )
}

/**
 * Clones the initial item list so callers never mutate the exported constant.
 * @returns A fresh array with the default persisted playground items.
 * @example
 * getInitialPersistedSortableItems()
 */
export function getInitialPersistedSortableItems(): PersistedSortableItem[] {
  return INITIAL_PERSISTED_SORTABLE_ITEMS.map((item) => ({ ...item }))
}

/**
 * Parses localStorage text into a validated item list.
 * @param storedValue - Raw JSON read from localStorage.
 * @returns A valid item list, or the initial list when stored data is missing or invalid.
 * @example
 * parsePersistedSortableItems('[{"id":"a","title":"A","description":"Learn"}]')
 */
export function parsePersistedSortableItems(
  storedValue: string | null,
): PersistedSortableItem[] {
  if (storedValue === null) {
    return getInitialPersistedSortableItems()
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    if (
      Array.isArray(parsedValue) &&
      parsedValue.every(isPersistedSortableItem)
    ) {
      return parsedValue
    }
  } catch {
    return getInitialPersistedSortableItems()
  }

  return getInitialPersistedSortableItems()
}

/**
 * Reads the current persisted list snapshot for `useSyncExternalStore`.
 * @returns The stored item order in the browser, or the initial order on the server.
 * @example
 * getPersistedSortableItemsSnapshot()
 */
export function getPersistedSortableItemsSnapshot(): PersistedSortableItem[] {
  if (typeof window === 'undefined') {
    return getPersistedSortableItemsServerSnapshot()
  }

  const storedValue = window.localStorage.getItem(
    PERSISTED_SORTABLE_STORAGE_KEY,
  )

  if (storedValue === cachedStoredValue) {
    return cachedSnapshot
  }

  cachedStoredValue = storedValue
  cachedSnapshot = parsePersistedSortableItems(storedValue)
  return cachedSnapshot
}

/**
 * Returns a stable fallback snapshot for server rendering.
 * @returns The initial item order without reading browser-only APIs.
 * @example
 * getPersistedSortableItemsServerSnapshot()
 */
export function getPersistedSortableItemsServerSnapshot(): PersistedSortableItem[] {
  return INITIAL_PERSISTED_SORTABLE_ITEMS
}

/**
 * Subscribes to same-tab and cross-tab storage updates for the persisted list.
 * @param onStoreChange - The callback React uses to re-read the snapshot.
 * @returns A cleanup function that removes the storage listeners.
 * @example
 * subscribePersistedSortableItems(() => console.log('changed'))
 */
export function subscribePersistedSortableItems(
  onStoreChange: () => void,
): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === PERSISTED_SORTABLE_STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener(PERSISTED_SORTABLE_STORAGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener(PERSISTED_SORTABLE_STORAGE_EVENT, onStoreChange)
  }
}

/**
 * Saves the list order and notifies the current browser tab.
 * @param items - The item order to persist.
 * @returns Nothing; the browser store is updated when available.
 * @example
 * savePersistedSortableItems(items)
 */
export function savePersistedSortableItems(items: PersistedSortableItem[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    PERSISTED_SORTABLE_STORAGE_KEY,
    JSON.stringify(items),
  )
  window.dispatchEvent(new Event(PERSISTED_SORTABLE_STORAGE_EVENT))
}

/**
 * Clears the saved order and notifies subscribers.
 * @returns Nothing; localStorage is cleared when available.
 * @example
 * resetPersistedSortableItems()
 */
export function resetPersistedSortableItems() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(PERSISTED_SORTABLE_STORAGE_KEY)
  window.dispatchEvent(new Event(PERSISTED_SORTABLE_STORAGE_EVENT))
}

/**
 * Moves one persisted item from its starting index to its dropped index.
 * @param items - The current ordered list.
 * @param initialIndex - The position where dragging started.
 * @param targetIndex - The position where the item should land.
 * @returns A new list with the moved item, or the original list when the item is missing.
 * @example
 * reorderPersistedSortableItems(items, 0, 2)
 */
export function reorderPersistedSortableItems(
  items: PersistedSortableItem[],
  initialIndex: number,
  targetIndex: number,
): PersistedSortableItem[] {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(initialIndex, 1)

  if (movedItem === undefined) {
    return items
  }

  nextItems.splice(targetIndex, 0, movedItem)
  return nextItems
}
