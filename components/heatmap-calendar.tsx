'use client'

import { useEffect, useMemo, useRef } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type ActivityDay = {
  date: string
  count: number
  note: string
}

type Props = {
  data: ActivityDay[]
}

const CELL_SIZE = 13
const CELL_GAP = 2
const CELL_STEP = CELL_SIZE + CELL_GAP
const WEEKS = 53
const DAYS_IN_WEEK = 7
const MONTH_LABEL_HEIGHT = 20
const DAY_LABEL_WIDTH = 32

const COLOR_FILLS = [
  '#ebedf0',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
] as const

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function getFillColor(count: number): string {
  if (count === 0) return COLOR_FILLS[0]
  if (count === 1) return COLOR_FILLS[1]
  if (count <= 3) return COLOR_FILLS[2]
  if (count <= 6) return COLOR_FILLS[3]
  return COLOR_FILLS[4]
}

function buildCalendarGrid(data: ActivityDay[]) {
  const dataMap = new Map(data.map((d) => [d.date, d]))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDay = new Date(today)
  startDay.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7)

  const cells: {
    date: Date
    dateStr: string
    count: number
    note: string
    week: number
    day: number
  }[] = []

  const current = new Date(startDay)
  let week = 0

  while (current <= today) {
    const day = current.getDay()
    const dateStr = current.toISOString().split('T')[0]
    const entry = dataMap.get(dateStr)

    cells.push({
      date: new Date(current),
      dateStr,
      count: entry?.count ?? 0,
      note: entry?.note ?? '',
      week,
      day,
    })

    current.setDate(current.getDate() + 1)
    if (current.getDay() === 0) week++
  }

  const totalWeeks = week + 1

  const monthLabels: { label: string; week: number }[] = []
  let lastMonth = -1
  for (const cell of cells) {
    const month = cell.date.getMonth()
    if (month !== lastMonth && cell.day === 0) {
      monthLabels.push({ label: MONTH_NAMES[month], week: cell.week })
      lastMonth = month
    }
  }

  return { cells, monthLabels, totalWeeks }
}

function computeStreaks(data: ActivityDay[]) {
  const activeDates = new Set(
    data.filter((d) => d.count > 0).map((d) => d.date),
  )
  const totalDays = activeDates.size

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentStreak = 0
  const cursor = new Date(today)
  while (activeDates.has(cursor.toISOString().split('T')[0])) {
    currentStreak++
    cursor.setDate(cursor.getDate() - 1)
  }

  let longestStreak = 0
  let streak = 0
  const sorted = [...activeDates].sort()
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      streak = 1
    } else {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diffMs = curr.getTime() - prev.getTime()
      const ONE_DAY_MS = 86_400_000
      streak = diffMs === ONE_DAY_MS ? streak + 1 : 1
    }
    longestStreak = Math.max(longestStreak, streak)
  }

  return { totalDays, currentStreak, longestStreak }
}

export function HeatmapCalendar({ data }: Props) {
  const { cells, monthLabels, totalWeeks } = useMemo(
    () => buildCalendarGrid(data),
    [data],
  )
  const stats = useMemo(() => computeStreaks(data), [data])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [])

  const svgWidth = DAY_LABEL_WIDTH + totalWeeks * CELL_STEP
  const svgHeight = MONTH_LABEL_HEIGHT + DAYS_IN_WEEK * CELL_STEP

  return (
    <div className="w-full space-y-4">
      <div ref={scrollRef} className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="font-sans"
          role="img"
          aria-label="Activity heatmap calendar"
        >
          {monthLabels.map((m) => (
            <text
              key={`${m.label}-${m.week}`}
              x={DAY_LABEL_WIDTH + m.week * CELL_STEP}
              y={14}
              className="fill-muted-foreground text-[10px]"
            >
              {m.label}
            </text>
          ))}

          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={0}
                y={MONTH_LABEL_HEIGHT + i * CELL_STEP + CELL_SIZE - 2}
                className="fill-muted-foreground text-[10px]"
              >
                {label}
              </text>
            ) : null,
          )}

          {cells.map((cell) => {
            const x = DAY_LABEL_WIDTH + cell.week * CELL_STEP
            const y = MONTH_LABEL_HEIGHT + cell.day * CELL_STEP
            const fillColor = getFillColor(cell.count)
            const tooltipText =
              cell.count > 0
                ? `${cell.dateStr}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}${cell.note ? ` — ${cell.note}` : ''}`
                : `${cell.dateStr}: No activity`

            return (
              <Tooltip key={cell.dateStr}>
                <TooltipTrigger asChild>
                  <rect
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    fill={fillColor}
                    stroke="rgba(27,31,35,0.06)"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </svg>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span>Less</span>
        {COLOR_FILLS.map((color, i) => (
          <svg key={i} width={CELL_SIZE} height={CELL_SIZE}>
            <rect
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              fill={color}
              stroke="rgba(27,31,35,0.06)"
              strokeWidth={1}
            />
          </svg>
        ))}
        <span>More</span>
      </div>

      <div className="text-muted-foreground flex gap-6 text-sm">
        <div>
          Total:{' '}
          <span className="text-foreground font-semibold">
            {stats.totalDays} days
          </span>
        </div>
        <div>
          Longest Streak:{' '}
          <span className="text-foreground font-semibold">
            {stats.longestStreak}d
          </span>
        </div>
        <div>
          Current Streak:{' '}
          <span className="text-foreground font-semibold">
            {stats.currentStreak}d
          </span>
        </div>
      </div>
    </div>
  )
}
