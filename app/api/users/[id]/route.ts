import { NextResponse } from 'next/server'

import { API_DELAY_MS, sleep } from '@/lib/sleep'

export const dynamic = 'force-dynamic'

export type UserResponse = {
  id: number
  name: string
  email: string
  fetched_at: string
}

const FAKE_USERS: ReadonlyArray<{ name: string; email: string }> = [
  { name: 'Aria Tanaka', email: 'aria@example.com' },
  { name: 'Ben Clark', email: 'ben@example.com' },
  { name: 'Cara Diaz', email: 'cara@example.com' },
  { name: 'Daichi Sato', email: 'daichi@example.com' },
  { name: 'Eve Walker', email: 'eve@example.com' },
] as const

/**
 * Returns a deterministic user record for `[id]`.
 *
 * Used by the `queryKey` and `invalidate vs remove` tabs: the same id always
 * returns the same name/email so we can demonstrate cache reuse and
 * structural-sharing behaviour without false-positive diffs.
 *
 * @param request - Unused; signature required by Next.js Route Handlers.
 * @param ctx - Dynamic route segment carrying `id`.
 * @returns 200 with `UserResponse`, 404 when the id is out of range.
 * @example
 *   // GET /api/users/1 => { id:1, name:"Aria Tanaka", email:"aria@example.com", fetched_at:"..." }
 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse<UserResponse | { error: string }>> {
  await sleep(API_DELAY_MS)
  const { id } = await ctx.params
  const numericId = Number(id)
  const record = FAKE_USERS[numericId - 1]
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({
    id: numericId,
    name: record.name,
    email: record.email,
    fetched_at: new Date().toISOString(),
  })
}
