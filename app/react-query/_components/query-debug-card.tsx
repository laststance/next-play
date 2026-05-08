'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const ABSOLUTE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})

const formatTimestamp = (epochMs: number): string =>
  epochMs === 0 ? '—' : ABSOLUTE_TIME_FORMATTER.format(new Date(epochMs))

type StatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const statusVariant: Record<string, StatusBadgeVariant> = {
  pending: 'secondary',
  success: 'default',
  error: 'destructive',
}

const fetchStatusVariant: Record<string, StatusBadgeVariant> = {
  fetching: 'default',
  paused: 'secondary',
  idle: 'outline',
}

type QueryDebugCardProps = {
  title: string
  description?: ReactNode
  query: Pick<
    UseQueryResult<unknown, unknown>,
    | 'status'
    | 'fetchStatus'
    | 'isStale'
    | 'isFetching'
    | 'isPlaceholderData'
    | 'dataUpdatedAt'
    | 'errorUpdatedAt'
    | 'failureCount'
  >
  /**
   * Optional extra content to render below the metric grid (controls,
   * raw data preview, etc.).
   */
  children?: ReactNode
}

/**
 * Visual surface that exposes a `useQuery` result's internal state alongside
 * **separately tracked render and fetch counters**.
 *
 * Why both counters?
 *   The single most common confusion when adopting TanStack Query is "did
 *   that polling tick re-render my UI?". Render count comes from a `useRef`
 *   bumped on every render of THIS card. Fetch count tracks transitions of
 *   `fetchStatus` from `'fetching'` to anything else, which mirrors the
 *   number of completed network round-trips.
 *
 * @example
 *   const query = useQuery({ queryKey: ['n'], queryFn: ... })
 *   <QueryDebugCard title="Random Number" query={query}>
 *     <pre>{JSON.stringify(query.data, null, 2)}</pre>
 *   </QueryDebugCard>
 */
export function QueryDebugCard({
  title,
  description,
  query,
  children,
}: QueryDebugCardProps) {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  const previousFetchingRef = useRef(false)
  const [completedFetchCount, setCompletedFetchCount] = useState(0)

  useEffect(() => {
    const wasFetching = previousFetchingRef.current
    const isFetching = query.fetchStatus === 'fetching'
    if (wasFetching && !isFetching) {
      setCompletedFetchCount((prev) => prev + 1)
    }
    previousFetchingRef.current = isFetching
  }, [query.fetchStatus])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Metric label="status">
            <Badge
              variant={statusVariant[query.status] ?? 'outline'}
              className="font-mono"
            >
              {query.status}
            </Badge>
          </Metric>
          <Metric label="fetchStatus">
            <Badge
              variant={fetchStatusVariant[query.fetchStatus] ?? 'outline'}
              className="font-mono"
            >
              {query.fetchStatus}
            </Badge>
          </Metric>
          <Metric label="isStale">
            <Badge
              variant={query.isStale ? 'destructive' : 'outline'}
              className="font-mono"
            >
              {String(query.isStale)}
            </Badge>
          </Metric>
          <Metric label="isFetching">
            <Badge
              variant={query.isFetching ? 'default' : 'outline'}
              className="font-mono"
            >
              {String(query.isFetching)}
            </Badge>
          </Metric>
          <Metric label="dataUpdatedAt">
            <span className="text-muted-foreground font-mono">
              {formatTimestamp(query.dataUpdatedAt)}
            </span>
          </Metric>
          <Metric label="errorUpdatedAt">
            <span className="text-muted-foreground font-mono">
              {formatTimestamp(query.errorUpdatedAt)}
            </span>
          </Metric>
          <Metric label="failureCount">
            <span className="font-mono">{query.failureCount}</span>
          </Metric>
          <Metric label="isPlaceholderData">
            <span className="font-mono">{String(query.isPlaceholderData)}</span>
          </Metric>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Metric label="Render count (this card)">
            <Badge variant="secondary" className="font-mono">
              {renderCountRef.current}
            </Badge>
          </Metric>
          <Metric label="Completed fetches">
            <Badge variant="secondary" className="font-mono">
              {completedFetchCount}
            </Badge>
          </Metric>
        </div>

        {children}
      </CardContent>
    </Card>
  )
}

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-muted/30 flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
