'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { InfoIcon } from 'lucide-react'
import { useState } from 'react'

import type { UserResponse } from '@/app/api/users/[id]/route'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { CacheInspector } from '../_components/cache-inspector'
import { QueryDebugCard } from '../_components/query-debug-card'
import { fetchUser } from '../_lib/api-client'

const SHARED_QUERY_KEY = ['user-cache-demo', 1] as const
const LOG_LIMIT = 12

type LogEntry = { id: number; at: string; text: string }

export function InvalidateVsRemoveTab() {
  const queryClient = useQueryClient()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [logCounter, setLogCounter] = useState(0)

  const log = (text: string) => {
    setLogCounter((prev) => prev + 1)
    setLogs((prev) => {
      const next: LogEntry[] = [
        {
          id: logCounter + 1,
          at: new Date().toLocaleTimeString('en-US', { hour12: false }),
          text,
        },
        ...prev,
      ]
      return next.slice(0, LOG_LIMIT)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>Cache mutation toolkit</AlertTitle>
        <AlertDescription>
          <p>
            Two siblings observe the SAME queryKey{' '}
            <code className="font-mono text-xs">
              {JSON.stringify(SHARED_QUERY_KEY)}
            </code>
            . Click each button and watch the cache inspector + render counters
            react. The buttons are ordered by intensity:{' '}
            <code>setQueryData</code> &lt; <code>invalidate (no refetch)</code>{' '}
            &lt; <code>invalidate</code> &lt; <code>resetQueries</code> &lt;{' '}
            <code>removeQueries</code>.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Action buttons</CardTitle>
          <CardDescription>
            Each call targets <code>{JSON.stringify(SHARED_QUERY_KEY)}</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                queryClient.setQueryData<UserResponse>(
                  SHARED_QUERY_KEY,
                  (current) =>
                    current
                      ? {
                          ...current,
                          name: `${current.name} (edited locally)`,
                        }
                      : current,
                )
                log('setQueryData → mutated cache value, no fetch')
              }}
            >
              setQueryData
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                await queryClient.invalidateQueries({
                  queryKey: SHARED_QUERY_KEY,
                  refetchType: 'none',
                })
                log("invalidate ({ refetchType: 'none' }) → marked stale only")
              }}
            >
              invalidate (refetchType: &apos;none&apos;)
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                await queryClient.invalidateQueries({
                  queryKey: SHARED_QUERY_KEY,
                })
                log('invalidate → stale + active observers refetch')
              }}
            >
              invalidate (default)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={async () => {
                await queryClient.resetQueries({
                  queryKey: SHARED_QUERY_KEY,
                })
                log('resetQueries → back to initial state, then refetch')
              }}
            >
              resetQueries
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                queryClient.removeQueries({
                  queryKey: SHARED_QUERY_KEY,
                })
                log('removeQueries → cache entry deleted')
              }}
            >
              removeQueries
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">
              Action log (newest first)
            </span>
            <ul className="flex flex-col gap-1 text-xs">
              {logs.length === 0 ? (
                <li className="bg-muted/30 text-muted-foreground rounded border p-2">
                  Press a button to start the log.
                </li>
              ) : (
                logs.map((entry) => (
                  <li
                    key={entry.id}
                    className="bg-muted/30 flex items-center gap-2 rounded border p-2 font-mono"
                  >
                    <Badge variant="outline" className="font-mono">
                      {entry.at}
                    </Badge>
                    <span>{entry.text}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ObserverCard label="Observer A" />
        <ObserverCard label="Observer B (same key)" />
        <CacheInspector
          title="user-cache-demo entry"
          description="Watch this single key flip status, observers, and updates."
          filterAction={(query) => query.queryKey[0] === SHARED_QUERY_KEY[0]}
        />
      </div>
    </div>
  )
}

function ObserverCard({ label }: { label: string }) {
  const query = useQuery({
    queryKey: SHARED_QUERY_KEY,
    queryFn: async () => fetchUser(SHARED_QUERY_KEY[1]),
  })

  return (
    <QueryDebugCard
      title={label}
      description={
        <>
          observing{' '}
          <code className="font-mono text-xs">
            {JSON.stringify(SHARED_QUERY_KEY)}
          </code>
        </>
      }
      query={query}
    >
      <pre className="bg-muted/40 overflow-x-auto rounded-md border p-2 text-xs">
        {JSON.stringify(query.data, null, 2)}
      </pre>
    </QueryDebugCard>
  )
}
