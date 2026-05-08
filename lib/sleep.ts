/**
 * Resolves after the given number of milliseconds.
 *
 * Used by the `/app/api/**` Route Handlers in the React Query playground to
 * inject an artificial 500ms latency. Slowing the backend on purpose makes
 * loading/fetching states (`fetchStatus === 'fetching'`, Skeletons, etc.)
 * easy to observe in the UI.
 *
 * @param ms - Delay duration in milliseconds.
 * @returns A Promise that resolves to `void` once the timer fires.
 * @example
 *   await sleep(500) // pause for 500ms inside a Route Handler
 */
export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const API_DELAY_MS = 500
