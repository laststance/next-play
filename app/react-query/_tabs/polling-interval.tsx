'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { InfoIcon, PlayIcon, RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { QueryDebugCard } from '../_components/query-debug-card'
import {
  fetchJob,
  fetchRandomNumber,
  resetJobs,
  startJob,
} from '../_lib/api-client'

const NUMBER_INTERVAL_OPTIONS = [
  { label: 'Off', valueMs: 0 },
  { label: '500 ms', valueMs: 500 },
  { label: '1 second', valueMs: 1_000 },
  { label: '2 seconds', valueMs: 2_000 },
  { label: '5 seconds', valueMs: 5_000 },
] as const

export function PollingIntervalTab() {
  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>
          Three flavours of <code>refetchInterval</code>
        </AlertTitle>
        <AlertDescription>
          <p>
            <strong>Boolean</strong> = the project pattern from{' '}
            <code>DocumentFilesWithUrlsProvider.tsx</code>:{' '}
            <code>refetchInterval: isPolling ? 1000 : false</code>.
          </p>
          <p>
            <strong>Number</strong> = a fixed period.
          </p>
          <p>
            <strong>Function</strong> = receives the latest <code>query</code>{' '}
            and returns either a delay or <code>false</code>; perfect for
            stopping polling once a job is done.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BooleanPollingCard />
        <NumberPollingCard />
        <FunctionPollingCard />
      </div>
    </div>
  )
}

function BooleanPollingCard() {
  const [isPolling, setIsPolling] = useState(false)

  const query = useQuery({
    queryKey: ['polling-boolean'],
    queryFn: fetchRandomNumber,
    refetchInterval: isPolling ? 1_000 : false,
    staleTime: 0,
  })

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-base">A. Boolean toggle (1s)</CardTitle>
        <CardDescription>
          <code className="text-xs">
            refetchInterval: isPolling ? 1000 : false
          </code>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <label className="bg-muted/30 flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
          <span className="flex flex-col">
            <span className="font-medium">isPolling</span>
            <span className="text-muted-foreground text-xs">
              Flip to drive the boolean.
            </span>
          </span>
          <Switch checked={isPolling} onCheckedChange={setIsPolling} />
        </label>

        <QueryDebugCard
          title="boolean-driven query"
          description="Polls only while isPolling = true."
          query={query}
        />
      </CardContent>
    </Card>
  )
}

function NumberPollingCard() {
  const [intervalMs, setIntervalMs] = useState<number>(1_000)

  const query = useQuery({
    queryKey: ['polling-number'],
    queryFn: fetchRandomNumber,
    refetchInterval: intervalMs === 0 ? false : intervalMs,
    staleTime: 0,
  })

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-base">B. Fixed number</CardTitle>
        <CardDescription>
          <code className="text-xs">
            refetchInterval: {intervalMs || 'false'}
          </code>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Select
          value={String(intervalMs)}
          onValueChange={(value) => setIntervalMs(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick an interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {NUMBER_INTERVAL_OPTIONS.map((option) => (
                <SelectItem key={option.valueMs} value={String(option.valueMs)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <QueryDebugCard
          title="interval-driven query"
          description="Number form just sets a constant timer."
          query={query}
        />
      </CardContent>
    </Card>
  )
}

function FunctionPollingCard() {
  const queryClient = useQueryClient()
  const [activeJobId, setActiveJobId] = useState<string | null>(null)

  const startJobMutation = useMutation({
    mutationFn: startJob,
    onSuccess: (job) => setActiveJobId(job.id),
  })

  const resetMutation = useMutation({
    mutationFn: resetJobs,
    onSuccess: () => {
      setActiveJobId(null)
      queryClient.removeQueries({ queryKey: ['polling-function'] })
    },
  })

  const jobQuery = useQuery({
    queryKey: ['polling-function', activeJobId],
    queryFn: async () => fetchJob(activeJobId as string),
    enabled: activeJobId !== null,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'finished') return false
      return 1_000
    },
  })

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-base">C. Function (auto-stop)</CardTitle>
        <CardDescription>
          <code className="text-xs">
            refetchInterval: (query) =&gt; query.state.data?.status ===
            &apos;finished&apos; ? false : 1000
          </code>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => startJobMutation.mutate()}
            disabled={startJobMutation.isPending}
          >
            <PlayIcon data-icon="inline-start" />
            Start job
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Reset
          </Button>
        </div>

        {activeJobId ? (
          <div className="bg-muted/30 flex items-center justify-between rounded-md border p-2 text-xs">
            <span>Active job</span>
            <Badge variant="secondary" className="font-mono">
              {activeJobId}
            </Badge>
          </div>
        ) : (
          <p className="bg-muted/30 text-muted-foreground rounded-md border p-2 text-xs">
            No job yet. Press <strong>Start job</strong>; polling stops on its
            own once the job reaches <code>finished</code>.
          </p>
        )}

        <Separator />

        <QueryDebugCard
          title="function-driven query"
          description={
            jobQuery.data
              ? `Job status: ${jobQuery.data.status}`
              : 'Waiting for a job...'
          }
          query={jobQuery}
        />
      </CardContent>
    </Card>
  )
}
