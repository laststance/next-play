import { NextResponse } from 'next/server'

import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

export type RandomNumberResponse = {
  value: number
  generated_at: string
}

/**
 * Returns a fresh random number with the current timestamp.
 *
 * The intentional 500ms delay makes loading states visible, and because the
 * payload changes on every call this endpoint is the perfect target for
 * `staleTime`, `refetchInterval`, manual `refetch()`, and "fetch happened
 * but did the UI re-render?" demos.
 *
 * @returns JSON `{ value, generated_at }` after a 500ms delay.
 * @example
 *   // GET /api/random-number
 *   // => { "value": 0.4231, "generated_at": "2026-05-08T11:00:00.000Z" }
 */
export async function GET(): Promise<NextResponse<RandomNumberResponse>> {
  await sleep(API_DELAY_MS)
  return NextResponse.json({
    value: Math.random(),
    generated_at: new Date().toISOString(),
  })
}
