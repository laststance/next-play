import { NextResponse } from 'next/server'

import { getJob, type Job } from '@/lib/jobs-store'
import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

/**
 * Heavy job-detail endpoint mirroring the source project's
 * `/document_files/[id]` resource.
 *
 * Returns the full job record with `preview_url` and `content`, which is the
 * payload the React Query client invalidates only after the lightweight
 * status feed signals that the job has finished.
 *
 * @param request - Unused; required by the Route Handler signature.
 * @param ctx - Dynamic segment carrying the job `id`.
 * @returns 200 with the `Job`, or 404 if no such job exists.
 * @example
 *   // GET /api/jobs/job_001
 *   // => { id:"job_001", status:"finished", preview_url:"...", content:"..." }
 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse<Job | { error: string }>> {
  await sleep(API_DELAY_MS)
  const { id } = await ctx.params
  const job = getJob(id)
  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(job)
}
