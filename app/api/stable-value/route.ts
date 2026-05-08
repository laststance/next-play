import { NextResponse } from 'next/server'

import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

export type StableValueResponse = {
  value: number
  items: ReadonlyArray<{ id: number; label: string }>
  generated_at: string
}

const STABLE_VALUE = 42
const STABLE_ITEMS: ReadonlyArray<{ id: number; label: string }> = [
  { id: 1, label: 'A' },
  { id: 2, label: 'B' },
  { id: 3, label: 'C' },
] as const

/**
 * Returns a payload whose `value` and `items` are *intentionally constant*
 * across every call; only `generated_at` changes.
 *
 * Powers the "Predictable" tab. With `structuralSharing: true` (the default)
 * TanStack Query detects that the new payload deeply equals the previous one
 * and reuses the prior reference, so subscribed components do NOT re-render
 * even though a network request just completed. Flipping `structuralSharing`
 * off makes the contrast obvious.
 *
 * @returns 200 with `StableValueResponse` after a 500ms delay.
 * @example
 *   // GET /api/stable-value
 *   // => { "value": 42, "items": [...], "generated_at": "..." }
 */
export async function GET(): Promise<NextResponse<StableValueResponse>> {
  await sleep(API_DELAY_MS)
  return NextResponse.json({
    value: STABLE_VALUE,
    items: STABLE_ITEMS,
    generated_at: new Date().toISOString(),
  })
}
