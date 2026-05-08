/**
 * Server-side, in-memory job store backing the React Query learning playground.
 *
 * Background:
 *   The playground simulates "preview generation" jobs that progress through
 *   `queued -> processing -> finished` so the UI can demonstrate polling
 *   behaviour identical to the source project's `DocumentFilesWithUrlsProvider`.
 *
 * Lazy ticking:
 *   Instead of running a background timer that would not survive Next.js
 *   dev hot-reloads, the status is computed *on read* from the elapsed time
 *   since the job was created. That keeps the store stateless aside from the
 *   `created_at` timestamp and the optional manual override applied via
 *   `markFinished`. Whenever a Route Handler reads a job, it calls
 *   `tickJob(job)` first to ensure callers always see the latest status.
 *
 * Hot-reload survival:
 *   In Next.js dev, modules are re-evaluated on edit which would normally
 *   reset a module-scope `Map`. Stashing the store on `globalThis` keeps the
 *   data alive across reloads so the playground stays usable while iterating.
 */

const QUEUED_TO_PROCESSING_MS = 800
const PROCESSING_TO_FINISHED_MS = 5_000

export type JobStatus = 'queued' | 'processing' | 'finished'

export type Job = {
  id: string
  status: JobStatus
  created_at: number
  finished_at: number | null
  preview_url: string | null
  content: string | null
}

type GlobalWithStore = typeof globalThis & {
  __jobsStore?: Map<string, Job>
}

const globalRef = globalThis as GlobalWithStore
const store: Map<string, Job> = (globalRef.__jobsStore ??= new Map<
  string,
  Job
>())

let nextJobId = store.size + 1

const generateId = (): string => {
  const id = `job_${String(nextJobId).padStart(3, '0')}`
  nextJobId += 1
  return id
}

/**
 * Recomputes a job's status from elapsed time since creation.
 *
 * Called every time the store is read so the UI sees the latest transition
 * without needing a background scheduler.
 *
 * @param job - The persisted job record.
 * @returns A copy of the job with the up-to-date status applied.
 * @example
 *   tickJob({ ...createdJustNow }) // => { status: 'queued',     ... }
 *   tickJob({ ...createdOneSecAgo }) // => { status: 'processing', ... }
 *   tickJob({ ...createdSixSecAgo }) // => { status: 'finished',   ... }
 */
export const tickJob = (job: Job): Job => {
  if (job.status === 'finished') return job

  const elapsed = Date.now() - job.created_at

  if (elapsed >= PROCESSING_TO_FINISHED_MS) {
    return {
      ...job,
      status: 'finished',
      finished_at: job.created_at + PROCESSING_TO_FINISHED_MS,
      preview_url: `/api/jobs/${job.id}/preview.png`,
      content: `Job ${job.id} finished. Sample rendered content.`,
    }
  }

  if (elapsed >= QUEUED_TO_PROCESSING_MS) {
    return { ...job, status: 'processing' }
  }

  return { ...job, status: 'queued' }
}

/**
 * Inserts a new job in the `queued` state and returns the materialised record.
 *
 * @returns The freshly created `Job` snapshot.
 */
export const createJob = (): Job => {
  const job: Job = {
    id: generateId(),
    status: 'queued',
    created_at: Date.now(),
    finished_at: null,
    preview_url: null,
    content: null,
  }
  store.set(job.id, job)
  return tickJob(job)
}

export const getJob = (id: string): Job | undefined => {
  const raw = store.get(id)
  if (!raw) return undefined
  const ticked = tickJob(raw)
  store.set(id, ticked)
  return ticked
}

export const getAllJobs = (): Job[] => {
  const result: Job[] = []
  for (const [id, raw] of store.entries()) {
    const ticked = tickJob(raw)
    store.set(id, ticked)
    result.push(ticked)
  }
  return result.sort((a, b) => a.created_at - b.created_at)
}

export const resetJobs = (): void => {
  store.clear()
  nextJobId = 1
}
