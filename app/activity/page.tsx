import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

import { HeatmapCalendar } from '@/components/heatmap-calendar'
import { toLocalDateString } from '@/lib/date'
import { Main } from '@/components/main'
import prisma from '@/lib/prisma'

import { RecordActivityForm } from './record-activity-form'

export default async function Page() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  oneYearAgo.setHours(0, 0, 0, 0)

  const logs = await prisma.activityLog.findMany({
    where: { date: { gte: oneYearAgo } },
    orderBy: { date: 'asc' },
  })

  const data = logs.map((log) => ({
    date: toLocalDateString(log.date),
    count: log.count,
    note: log.note,
  }))

  return (
    <Main className="max-w-4xl px-4">
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>

      <div className="w-full space-y-8">
        <h2 className="text-2xl font-bold">Activity</h2>
        <RecordActivityForm />
        <HeatmapCalendar data={data} />
      </div>
    </Main>
  )
}
