'use client'

import { useQuery } from '@tanstack/react-query'
import { InfoIcon, RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

import { QueryDebugCard } from '../_components/query-debug-card'
import { fetchRandomNumber } from '../_lib/api-client'

const STALE_TIME_OPTIONS = [
  { label: '0 (always stale)', valueMs: 0 },
  { label: '1 second', valueMs: 1_000 },
  { label: '5 seconds', valueMs: 5_000 },
  { label: 'Infinity', valueMs: Number.POSITIVE_INFINITY },
] as const

const formatStaleTime = (ms: number): string =>
  ms === Number.POSITIVE_INFINITY ? 'Infinity' : `${ms} ms`

export function RefetchStaleTimeTab() {
  const [staleTimeIndex, setStaleTimeIndex] = useState(0)
  const [refetchOnWindowFocus, setRefetchOnWindowFocus] = useState(true)
  const [refetchOnMount, setRefetchOnMount] = useState(true)
  const [refetchOnReconnect, setRefetchOnReconnect] = useState(true)
  const [enabled, setEnabled] = useState(true)

  const staleTimeMs = STALE_TIME_OPTIONS[staleTimeIndex]?.valueMs ?? 0

  const query = useQuery({
    queryKey: ['random-number', { staleTimeMs }],
    queryFn: fetchRandomNumber,
    staleTime: staleTimeMs,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    enabled,
  })

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>Refetch &amp; staleTime</AlertTitle>
        <AlertDescription>
          <p>
            Toggle the trigger switches and watch <strong>Render count</strong>{' '}
            vs <strong>Completed fetches</strong>. Try blurring the window and
            coming back, or change the queryKey via the slider — both should
            cause a refetch <em>only</em> when the data is stale.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Controls</CardTitle>
            <CardDescription>
              Currently calling{' '}
              <code className="text-xs">GET /api/random-number</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">staleTime</span>
                <code className="text-xs">{formatStaleTime(staleTimeMs)}</code>
              </div>
              <Slider
                min={0}
                max={STALE_TIME_OPTIONS.length - 1}
                step={1}
                value={[staleTimeIndex]}
                onValueChange={(value) => setStaleTimeIndex(value[0] ?? 0)}
              />
              <p className="text-muted-foreground text-xs">
                Note: changing staleTime updates the queryKey too, so it creates
                a new cache entry. That makes the &quot;is stale?&quot; pill
                flip live without refresh.
              </p>
            </div>

            <Separator />

            <ToggleRow
              label="enabled"
              description="When false, the queryFn is never called."
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <ToggleRow
              label="refetchOnMount"
              description="Refetch when a new component subscribes if data is stale."
              checked={refetchOnMount}
              onCheckedChange={setRefetchOnMount}
            />
            <ToggleRow
              label="refetchOnWindowFocus"
              description="Refetch when the tab regains focus and data is stale."
              checked={refetchOnWindowFocus}
              onCheckedChange={setRefetchOnWindowFocus}
            />
            <ToggleRow
              label="refetchOnReconnect"
              description="Refetch when the browser fires the `online` event."
              checked={refetchOnReconnect}
              onCheckedChange={setRefetchOnReconnect}
            />

            <Separator />

            <Button
              type="button"
              onClick={async () => query.refetch()}
              disabled={query.isFetching}
              className="w-fit"
            >
              <RefreshCwIcon data-icon="inline-start" />
              Manual refetch()
            </Button>
            <p className="text-muted-foreground text-xs">
              Manual refetch ignores staleTime. It always hits the network.
            </p>
          </CardContent>
        </Card>

        <QueryDebugCard
          title="random-number query"
          description="Counts re-renders of THIS card vs completed network fetches."
          query={query}
        >
          <pre className="bg-muted/40 overflow-x-auto rounded-md border p-2 text-xs">
            {JSON.stringify(query.data, null, 2)}
          </pre>
        </QueryDebugCard>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (next: boolean) => void
}) {
  return (
    <label className="bg-muted/30 flex items-start justify-between gap-3 rounded-md border p-3 text-sm">
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  )
}
