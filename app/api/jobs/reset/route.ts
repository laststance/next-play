import { NextResponse } from 'next/server'

import { resetJobs } from '@/lib/jobs-store'
import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

/**
 * Wipes every in-memory job. Exposed to the playground UI so demos can be
 * re-run from a clean slate without restarting the dev server.
 *
 * @returns `{ ok: true }` after a 500ms delay so the UI can show feedback.
 * @example
 *   // POST /api/jobs/reset => { ok: true }
 */
export async function POST(): Promise<NextResponse<{ ok: true }>> {
  await sleep(API_DELAY_MS)
  resetJobs()
  return NextResponse.json({ ok: true })
}
