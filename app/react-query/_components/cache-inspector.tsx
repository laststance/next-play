'use client'

import { useQueryClient, type Query } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type CacheInspectorProps = {
  /**
   * Optional predicate narrowing the inspector to a subset of queries — for
   * example only `['user']` keys when a tab focuses on a single resource.
   *
   * Named with the `Action` suffix so Next.js's "use client" prop
   * serialization rule is satisfied: the convention treats `*Action` props
   * as Server-Action-shaped callbacks instead of plain serializable data.
   */
  filterAction?: (query: Query) => boolean
  title?: string
  description?: string
}

const subscribeToCacheFactory =
  (cache: ReturnType<ReturnType<typeof useQueryClient>['getQueryCache']>) =>
  (onStoreChange: () => void) =>
    cache.subscribe(onStoreChange)

/**
 * Live read-out of every entry in the `QueryCache`, intended as a teaching
 * aid that lets learners watch invalidation, removal, and refetching mutate
 * the cache in real time.
 *
 * Implementation notes:
 *   - `useSyncExternalStore` is the safe way to subscribe to an external
 *     store from React 18+ without tearing in concurrent renders.
 *   - The snapshot is the literal `QueryCache.getAll()` array. Returning
 *     fresh arrays on every notification is fine here because the inspector
 *     does not memoize subscribers and we *want* a render on every change.
 *
 * @example
 *   <CacheInspector filter={(q) => q.queryKey[0] === 'user'} />
 */
export function CacheInspector({
  filterAction,
  title = 'Query Cache',
  description = 'Live snapshot of the QueryClient cache',
}: CacheInspectorProps) {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()

  const queries = useSyncExternalStore(
    subscribeToCacheFactory(cache),
    () => cache.getAll(),
    () => cache.getAll(),
  )

  const visibleQueries = filterAction ? queries.filter(filterAction) : queries

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-xs">
        {visibleQueries.length === 0 ? (
          <p className="text-muted-foreground">No queries in cache.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleQueries.map((query) => (
              <li
                key={query.queryHash}
                className="bg-muted/30 flex flex-col gap-1 rounded-md border p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-[11px] break-all">
                    {JSON.stringify(query.queryKey)}
                  </code>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge
                      variant={
                        query.state.status === 'success'
                          ? 'default'
                          : query.state.status === 'error'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="font-mono"
                    >
                      {query.state.status}
                    </Badge>
                    <Badge
                      variant={
                        query.state.fetchStatus === 'fetching'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-mono"
                    >
                      {query.state.fetchStatus}
                    </Badge>
                    <Badge
                      variant={query.isStale() ? 'destructive' : 'outline'}
                      className="font-mono"
                    >
                      {query.isStale() ? 'stale' : 'fresh'}
                    </Badge>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center justify-between">
                  <span>observers: {query.getObserversCount()}</span>
                  <span>updates: {query.state.dataUpdateCount}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
