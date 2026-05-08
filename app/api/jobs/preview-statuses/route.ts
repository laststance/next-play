import { NextResponse } from 'next/server'

import { getAllJobs, type JobStatus } from '@/lib/jobs-store'
import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

export type PreviewStatusEntry = { id: string; status: JobStatus }
export type PreviewStatusesResponse = { jobs: PreviewStatusEntry[] }

/**
 * Lightweight status feed mirroring the source project's
 * `/document_files/preview_statuses` endpoint.
 *
 * Returns ONLY `{ id, status }` for every job so the polling client can
 * compare statuses cheaply before deciding whether to refetch the heavier
 * `/api/jobs/[id]` body. This split is the heart of the "two-stage polling"
 * pattern showcased in Tab 7.
 *
 * @returns A flat list of `{ id, status }` entries after a 500ms delay.
 * @example
 *   // GET /api/jobs/preview-statuses
 *   // => { "jobs": [{ "id": "job_001", "status": "processing" }] }
 */
export async function GET(): Promise<NextResponse<PreviewStatusesResponse>> {
  await sleep(API_DELAY_MS)
  const jobs = getAllJobs().map(({ id, status }) => ({ id, status }))
  return NextResponse.json({ jobs })
}
