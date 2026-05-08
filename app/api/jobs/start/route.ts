import { NextResponse } from 'next/server'

import { createJob, type Job } from '@/lib/jobs-store'
import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

/**
 * Creates a new in-memory job in the `queued` state.
 *
 * Triggered by the "Start Job" buttons in the polling and two-stage tabs.
 * The job will lazily transition to `processing` then `finished` over the
 * next ~5 seconds, which is what gives the polling demos something to
 * observe.
 *
 * @returns 201 with the newly created `Job`.
 * @example
 *   // POST /api/jobs/start
 *   // => { id:"job_001", status:"queued", created_at:..., ... }
 */
export async function POST(): Promise<NextResponse<Job>> {
  await sleep(API_DELAY_MS)
  const job = createJob()
  return NextResponse.json(job, { status: 201 })
}
