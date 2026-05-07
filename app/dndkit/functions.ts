import { DNDKIT_DRAG_CLEANUP_DELAY_MS } from './constants'

/**
 * Runs React state changes after dnd kit has finished its DOM cleanup.
 * @param updateState - The React state changes that should happen after the drag event unwinds.
 * @returns Nothing; the callback is queued for the next browser task.
 * @example
 * scheduleAfterDragCleanup(() => setLastMoveLabel('Dropped'))
 */
export function scheduleAfterDragCleanup(updateState: () => void) {
  window.setTimeout(updateState, DNDKIT_DRAG_CLEANUP_DELAY_MS)
}
