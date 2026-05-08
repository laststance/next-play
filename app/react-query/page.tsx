'use client'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

import { Main } from '@/components/main'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { InvalidateVsRemoveTab } from './_tabs/invalidate-vs-remove'
import { PollingIntervalTab } from './_tabs/polling-interval'
import { PredictableTab } from './_tabs/predictable'
import { QueryKeyChangesTab } from './_tabs/query-key-changes'
import { RefetchStaleTimeTab } from './_tabs/refetch-stale-time'
import { TriggersOverviewTab } from './_tabs/triggers-overview'
import { TwoStagePollingTab } from './_tabs/two-stage-polling'

const TABS = [
  {
    value: 'triggers',
    label: '1. Triggers',
    Component: TriggersOverviewTab,
  },
  {
    value: 'refetch',
    label: '2. Refetch & staleTime',
    Component: RefetchStaleTimeTab,
  },
  {
    value: 'polling',
    label: '3. Polling',
    Component: PollingIntervalTab,
  },
  {
    value: 'query-key',
    label: '4. queryKey',
    Component: QueryKeyChangesTab,
  },
  {
    value: 'invalidate',
    label: '5. invalidate / remove',
    Component: InvalidateVsRemoveTab,
  },
  {
    value: 'predictable',
    label: '6. Predictable',
    Component: PredictableTab,
  },
  {
    value: 'two-stage',
    label: '7. Two-stage polling',
    Component: TwoStagePollingTab,
  },
] as const

export default function ReactQueryPlaygroundPage() {
  return (
    <Main className="max-w-[1400px] px-4 py-6">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
            href="/"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <span className="text-muted-foreground text-xs">
            Open the React Query Devtools (bottom-left button) to inspect
            queries from another angle.
          </span>
        </div>

        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">React Query Playground</h1>
          <p className="text-muted-foreground text-sm">
            Interactive demos that answer{' '}
            <strong>&quot;what triggers a refetch?&quot;</strong> and{' '}
            <strong>&quot;why didn&apos;t my UI re-render?&quot;</strong>. Every
            endpoint sleeps 500 ms server-side so the loading states stay
            visible.
          </p>
        </header>

        <Tabs defaultValue="triggers" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {TABS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="flex-none">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value, Component }) => (
            <TabsContent key={value} value={value} className="mt-4">
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Main>
  )
}
