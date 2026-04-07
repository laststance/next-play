'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

/**
 * Record today's activity. If an entry already exists for today, increment count.
 * @param note - Optional memo describing what was done.
 */
export async function recordActivity(note: string = '') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.activityLog.upsert({
    where: { date: today },
    update: {
      count: { increment: 1 },
      note,
    },
    create: {
      date: today,
      count: 1,
      note,
    },
  })

  revalidatePath('/activity')
}
