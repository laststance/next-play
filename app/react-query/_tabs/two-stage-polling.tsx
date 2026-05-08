'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { InfoIcon, PlayIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
import {
  fetchJob,
  fetchPreviewStatuses,
  resetJobs,
  startJob,
  type PreviewStatusEntry,
} from '../_lib/api-client'

const POLL_INTERVAL_MS = 1_000
const isProcessing = (entry: PreviewStatusEntry) =>
  entry.status === 'queued' || entry.status === 'processing'

export function TwoStagePollingTab() {
  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>
          Two-stage polling — DocumentFilesWithUrlsProvider in miniature
        </AlertTitle>
        <AlertDescription>
          <p>
            <strong>Light query</strong>: a tiny <code>/preview-statuses</code>{' '}
            endpoint returning only <code>{`{ id, status }`}</code> for every
            job, polled every second when there is something processing.
          </p>
          <p>
            <strong>Heavy query</strong>: the full job payload at{' '}
            <code>/jobs/[id]</code>. It is NOT polled — instead the light query
            invalidates it the moment a job flips to <code>finished</code>.
          </p>
        </AlertDescription>
      </Alert>

      <TwoStagePollingDemo />
    </div>
  )
}

function TwoStagePollingDemo() {
  const queryClient = useQueryClient()
  const [isPolling, setIsPolling] = useState(false)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const previousStatusesRef = useRef<PreviewStatusEntry[]>([])

  const startJobMutation = useMutation({
    mutationFn: startJob,
    onSuccess: (job) => {
      setActiveJobId(job.id)
      // 元プロジェクトでいう「アップロード後に setIsPollingDocumentFile(true)」
      setIsPolling(true)
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetJobs,
    onSuccess: () => {
      setActiveJobId(null)
      setIsPolling(false)
      previousStatusesRef.current = []
      queryClient.removeQueries({ queryKey: ['two-stage'] })
    },
  })

  // 元プロジェクトでいう DocumentFilesWithUrlsProvider.tsx:143-154
  // 「軽量 status query」をボタン押下後だけ 1 秒ごとに叩く。
  // refetchInterval の boolean 切替こそが polling の on/off スイッチ。
  const statusesQuery = useQuery({
    queryKey: ['two-stage', 'preview-statuses'],
    queryFn: fetchPreviewStatuses,
    refetchInterval: isPolling ? POLL_INTERVAL_MS : false,
    enabled: true,
    staleTime: 0,
  })

  // 元プロジェクトでいう「重量本体 useDocumentFilesQuery」と同じ立ち位置。
  // ここを polling せず、status の変化を検知したときだけ invalidate する。
  const jobBodyQuery = useQuery({
    queryKey: ['two-stage', 'job', activeJobId],
    queryFn: async () => fetchJob(activeJobId as string),
    enabled: activeJobId !== null,
    staleTime: 0,
  })

  // 元プロジェクトでいう DocumentFilesWithUrlsProvider.tsx:329-392
  // useEffectOnAny([documentFilesOnPolling, ...]) と同じ役割で、
  // status feed の更新ごとに「変化があるか」を判定して polling を切る。
  useEffect(() => {
    const statuses = statusesQuery.data?.jobs ?? []

    if (statuses.length === 0) {
      if (isPolling) setIsPolling(false)
      return
    }

    const stillProcessing = statuses.some(isProcessing)

    if (stillProcessing) {
      if (!isPolling) setIsPolling(true)
      previousStatusesRef.current = statuses
      return
    }

    const previousStatuses = previousStatusesRef.current
    const finishedNow = statuses.filter(
      (current) =>
        current.status === 'finished' &&
        previousStatuses.find(
          (prev) => prev.id === current.id && prev.status !== 'finished',
        ),
    )

    if (finishedNow.length > 0) {
      // 元プロジェクトでいう invalidateChangedFileUrls + refetchDocumentFiles。
      // 完了した job の重量本体だけ invalidate して、最新内容を取り直す。
      finishedNow.forEach((entry) => {
        queryClient.invalidateQueries({
          queryKey: ['two-stage', 'job', entry.id],
        })
      })
    }

    previousStatusesRef.current = statuses
    if (isPolling) setIsPolling(false)
  }, [isPolling, queryClient, statusesQuery.data])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
          <CardDescription>
            Start a job; it transitions queued → processing → finished over ~5
            seconds. The polling self-stops once everything is finished.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => startJobMutation.mutate()}
            disabled={startJobMutation.isPending}
          >
            <PlayIcon data-icon="inline-start" />
            Start job
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Reset jobs
          </Button>

          <Separator orientation="vertical" className="hidden h-8 lg:block" />

          <span className="text-muted-foreground text-xs">isPolling</span>
          <Badge
            variant={isPolling ? 'default' : 'outline'}
            className="font-mono"
          >
            {String(isPolling)}
          </Badge>
          <span className="text-muted-foreground text-xs">activeJobId</span>
          <Badge variant="secondary" className="font-mono">
            {activeJobId ?? '—'}
          </Badge>
        </CardContent>
      </Card>

      <QueryDebugCard
        title="Light query — preview statuses"
        description={`Polled every ${POLL_INTERVAL_MS} ms only while isPolling = true. Returns only id + status.`}
        query={statusesQuery}
      >
        <pre className="bg-muted/40 overflow-x-auto rounded-md border p-2 text-xs">
          {JSON.stringify(statusesQuery.data, null, 2)}
        </pre>
      </QueryDebugCard>

      <QueryDebugCard
        title="Heavy query — job body"
        description="Never polled. Refetches because the light query invalidated it."
        query={jobBodyQuery}
      >
        <pre className="bg-muted/40 overflow-x-auto rounded-md border p-2 text-xs">
          {JSON.stringify(jobBodyQuery.data, null, 2)}
        </pre>
      </QueryDebugCard>

      <CacheInspector
        title="two-stage cache"
        description="Watch how only the light query refetches frequently while the heavy one updates discretely on completion."
        filterAction={(query) => query.queryKey[0] === 'two-stage'}
      />
    </div>
  )
}
