'use client'

import { InfoIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Trigger = {
  name: string
  whenItFires: string
  configToToggle: string
  defaultEnabled: boolean
  category: 'time-based' | 'lifecycle' | 'manual' | 'cache'
}

const TRIGGERS: ReadonlyArray<Trigger> = [
  {
    name: 'Mount',
    whenItFires:
      'A component subscribes to a queryKey via useQuery for the first time, OR a queryKey already in the cache becomes stale and a new component subscribes.',
    configToToggle: 'refetchOnMount: true | false | "always"',
    defaultEnabled: true,
    category: 'lifecycle',
  },
  {
    name: 'Window focus',
    whenItFires:
      'The browser tab regains focus and the data is stale (or `"always"`). Implemented via the focusManager.',
    configToToggle: 'refetchOnWindowFocus: true | false | "always"',
    defaultEnabled: true,
    category: 'lifecycle',
  },
  {
    name: 'Network reconnect',
    whenItFires:
      'The browser fires the `online` event and the data is stale. Useful for resuming work after offline gaps.',
    configToToggle: 'refetchOnReconnect: true | false | "always"',
    defaultEnabled: true,
    category: 'lifecycle',
  },
  {
    name: 'staleTime expiry',
    whenItFires:
      'Once `staleTime` ms have elapsed since the last `dataUpdatedAt`, the next eligible trigger (mount/focus/reconnect) will refetch. staleTime ALONE never triggers — it only opens the gate.',
    configToToggle: 'staleTime: number | Infinity | "static"',
    defaultEnabled: true,
    category: 'time-based',
  },
  {
    name: 'refetchInterval (polling)',
    whenItFires:
      'A timer fires every N ms regardless of staleness. Independent of staleTime. Returns false from the function form to stop.',
    configToToggle: 'refetchInterval: number | false | (query) => ...',
    defaultEnabled: false,
    category: 'time-based',
  },
  {
    name: 'queryKey change',
    whenItFires:
      'When the queryKey changes (deep equal compare), TanStack Query treats it as a new query, kicking off a fresh fetch and leaving the old key cached.',
    configToToggle: 'queryKey: [...]',
    defaultEnabled: true,
    category: 'cache',
  },
  {
    name: 'Manual refetch()',
    whenItFires:
      'You call `query.refetch()` directly. Bypasses staleTime/enabled checks unless `cancelRefetch: false` is passed.',
    configToToggle: 'refetch({ throwOnError, cancelRefetch })',
    defaultEnabled: true,
    category: 'manual',
  },
  {
    name: 'invalidateQueries',
    whenItFires:
      'Marks matching queries stale; ACTIVE observers refetch immediately by default. Pass `refetchType: "none"` to mark only.',
    configToToggle:
      "invalidateQueries({ queryKey, refetchType: 'active' | 'inactive' | 'all' | 'none' })",
    defaultEnabled: true,
    category: 'cache',
  },
  {
    name: 'enabled flips false → true',
    whenItFires:
      'A previously-disabled query becomes enabled. Acts like a virtual mount.',
    configToToggle: 'enabled: boolean',
    defaultEnabled: true,
    category: 'lifecycle',
  },
] as const

const categoryVariant: Record<
  Trigger['category'],
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  'time-based': 'default',
  lifecycle: 'secondary',
  manual: 'outline',
  cache: 'destructive',
}

export function TriggersOverviewTab() {
  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>What triggers a refetch?</AlertTitle>
        <AlertDescription>
          <p>
            TanStack Query refetches when <strong>any</strong> of the following
            happens. The other tabs let you flip these on and off so you can{' '}
            <em>see</em> the difference live.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TRIGGERS.map((trigger) => (
          <Card key={trigger.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{trigger.name}</CardTitle>
                <Badge variant={categoryVariant[trigger.category]}>
                  {trigger.category}
                </Badge>
              </div>
              <CardDescription>{trigger.whenItFires}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="bg-muted/40 rounded-md border p-2 font-mono text-xs">
                {trigger.configToToggle}
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Default</span>
                <Badge
                  variant={trigger.defaultEnabled ? 'default' : 'outline'}
                  className="font-mono"
                >
                  {trigger.defaultEnabled ? 'enabled' : 'disabled'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <InfoIcon />
        <AlertTitle>Mental model</AlertTitle>
        <AlertDescription>
          <p>
            <strong>Polling = time axis.</strong> <code>refetchInterval</code>{' '}
            fires on a timer regardless of cache freshness.
          </p>
          <p>
            <strong>Invalidation = state-change axis.</strong>{' '}
            <code>invalidateQueries</code> marks data stale because{' '}
            <em>something happened</em> (a mutation, a user action, a
            navigation).
          </p>
          <p>
            <strong>staleTime alone never refetches.</strong> It only decides
            whether the <em>next</em> mount/focus/reconnect is eligible.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
