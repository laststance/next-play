'use client'

import { useQuery } from '@tanstack/react-query'
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
import { Separator } from '@/components/ui/separator'

import { QueryDebugCard } from '../_components/query-debug-card'
import { fetchStableValue } from '../_lib/api-client'

const POLL_INTERVAL_MS = 1_000

export function PredictableTab() {
  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>What does &quot;predictable&quot; really mean?</AlertTitle>
        <AlertDescription>
          <p>
            All four cards poll{' '}
            <code className="font-mono text-xs">/api/stable-value</code> every
            second. The endpoint always returns the SAME <code>value: 42</code>{' '}
            and the SAME <code>items</code>; only <code>generated_at</code>{' '}
            changes. So <strong>fetch counts go up</strong> identically — but{' '}
            <strong>render counts diverge wildly</strong> depending on{' '}
            <code>structuralSharing</code> and <code>select</code>.
          </p>
          <p>
            That gap is the predictability TanStack Query gives you for free:
            with the defaults, polling does NOT cause a re-render storm because
            deeply-equal data keeps the previous reference.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StructuralSharingOnCard />
        <StructuralSharingOffCard />
        <SelectPrimitiveCard />
        <SelectNewObjectCard />
      </div>

      <ComparisonExplainer />
    </div>
  )
}

function StructuralSharingOnCard() {
  const query = useQuery({
    queryKey: ['stable', 'sharing-on'],
    queryFn: fetchStableValue,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    structuralSharing: true,
  })

  return (
    <QueryDebugCard
      title="A. structuralSharing: true (default)"
      description="Same content → same reference → NO extra renders, even while fetches keep climbing."
      query={query}
    >
      <DataPreview
        label="data.value"
        rawValue={query.data?.value}
        expectStable
      />
    </QueryDebugCard>
  )
}

function StructuralSharingOffCard() {
  const query = useQuery({
    queryKey: ['stable', 'sharing-off'],
    queryFn: fetchStableValue,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    structuralSharing: false,
  })

  return (
    <QueryDebugCard
      title="B. structuralSharing: false"
      description="Every fetch returns a brand-new reference → every observer re-renders."
      query={query}
    >
      <DataPreview
        label="data.value"
        rawValue={query.data?.value}
        expectStable={false}
      />
    </QueryDebugCard>
  )
}

function SelectPrimitiveCard() {
  const query = useQuery({
    queryKey: ['stable', 'select-primitive'],
    queryFn: fetchStableValue,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    select: (data) => data.value,
  })

  return (
    <QueryDebugCard
      title="C. select returns a primitive"
      description="select(data) → number. Same primitive every fetch ⇒ ZERO renders after the first paint, even with default sharing turned ON."
      query={query}
    >
      <DataPreview label="selected" rawValue={query.data} expectStable />
    </QueryDebugCard>
  )
}

function SelectNewObjectCard() {
  const query = useQuery({
    queryKey: ['stable', 'select-new-object'],
    queryFn: fetchStableValue,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    select: (data) => ({ value: data.value }),
  })

  return (
    <QueryDebugCard
      title="D. select returns a fresh object"
      description="Same payload → but select returns a NEW object literal each call. structuralSharing CAN'T deduplicate it ⇒ renders match fetches."
      query={query}
    >
      <DataPreview
        label="selected.value"
        rawValue={query.data?.value}
        expectStable={false}
      />
    </QueryDebugCard>
  )
}

function DataPreview({
  label,
  rawValue,
  expectStable,
}: {
  label: string
  rawValue: number | undefined
  expectStable: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="bg-muted/40 flex items-center justify-between rounded-md border px-2 py-1 font-mono text-xs">
        <span>{rawValue ?? '—'}</span>
        <Badge variant={expectStable ? 'outline' : 'destructive'}>
          {expectStable ? 'stable ref expected' : 'new ref every tick'}
        </Badge>
      </div>
    </div>
  )
}

function ComparisonExplainer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Why this matters for polling-heavy UIs
        </CardTitle>
        <CardDescription>
          The same insight powers the source project&apos;s separation of
          <code> documentFilesOnPollingData </code>and
          <code> folderFileIdSet</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <ul className="text-muted-foreground flex flex-col gap-1">
          <li>
            <strong>Card A</strong>: the canonical default. Polling without
            re-renders is exactly what kept that production component cheap.
          </li>
          <li>
            <strong>Card B</strong>: opting out. You almost never want this
            unless you are intentionally tracking <em>fetch identity</em>.
          </li>
          <li>
            <strong>Card C</strong>: the &quot;narrow your select&quot; pattern.
            Even if upstream data churns, derived primitives stay referentially
            equal.
          </li>
          <li>
            <strong>Card D</strong>: the trap. Returning a new object literal
            from <code>select</code> defeats structural sharing — keep your
            select returns referentially stable.
          </li>
        </ul>
        <Separator />
        <p className="text-muted-foreground text-xs">
          Tip: pair <code>select</code> with <code>useMemo</code> or top-level
          functions when the projection is non-trivial. Inline arrows that
          allocate fresh objects per call will look like card D.
        </p>
      </CardContent>
    </Card>
  )
}
