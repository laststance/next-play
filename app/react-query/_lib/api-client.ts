import type { RandomNumberResponse } from '@/app/api/random-number/route'
import type { StableValueResponse } from '@/app/api/stable-value/route'
import type { UserResponse } from '@/app/api/users/[id]/route'
import type { Job, JobStatus } from '@/lib/jobs-store'

const handleJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed (${response.status}): ${text}`)
  }
  return response.json() as Promise<T>
}

/**
 * Typed wrappers around the playground's REST endpoints.
 *
 * Centralising fetch calls keeps queryFns short and lets every demo share
 * the same error-handling surface.
 *
 * @example
 *   useQuery({ queryKey: ['n'], queryFn: fetchRandomNumber })
 */
export const fetchRandomNumber = async (): Promise<RandomNumberResponse> =>
  handleJson(await fetch('/api/random-number'))

export const fetchUser = async (id: number): Promise<UserResponse> =>
  handleJson(await fetch(`/api/users/${id}`))

export const fetchStableValue = async (): Promise<StableValueResponse> =>
  handleJson(await fetch('/api/stable-value'))

export type PreviewStatusEntry = { id: string; status: JobStatus }

export const fetchPreviewStatuses = async (): Promise<{
  jobs: PreviewStatusEntry[]
}> => handleJson(await fetch('/api/jobs/preview-statuses'))

export const fetchJob = async (id: string): Promise<Job> =>
  handleJson(await fetch(`/api/jobs/${id}`))

export const startJob = async (): Promise<Job> =>
  handleJson(await fetch('/api/jobs/start', { method: 'POST' }))

export const resetJobs = async (): Promise<{ ok: true }> =>
  handleJson(await fetch('/api/jobs/reset', { method: 'POST' }))
