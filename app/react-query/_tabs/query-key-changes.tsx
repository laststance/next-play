'use client'

import { useQuery } from '@tanstack/react-query'
import { InfoIcon } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Switch } from '@/components/ui/switch'

import { CacheInspector } from '../_components/cache-inspector'
import { QueryDebugCard } from '../_components/query-debug-card'
import { fetchUser } from '../_lib/api-client'

const USER_IDS = [1, 2, 3, 4, 5] as const
const PAGE_OPTIONS = [1, 2, 3] as const

export function QueryKeyChangesTab() {
  const [userId, setUserId] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [showSibling, setShowSibling] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <InfoIcon />
        <AlertTitle>queryKey controls everything</AlertTitle>
        <AlertDescription>
          <p>
            The queryKey is the cache key. Change it and TanStack Query
            considers it a brand-new query: it kicks off a fresh fetch and keeps
            the old key around in cache (until <code>gcTime</code>). Mount two
            components with the <em>same</em> key and they share one HTTP
            request.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Switch the queryKey</CardTitle>
            <CardDescription>
              <code className="text-xs">
                queryKey: [&apos;user&apos;, &#123; id, page &#125;]
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">user id</span>
              <Select
                value={String(userId)}
                onValueChange={(value) => setUserId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {USER_IDS.map((id) => (
                      <SelectItem key={id} value={String(id)}>
                        user {id}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">
                page (object key part:{' '}
                <code>{`{ id, page: ${pageNumber} }`}</code>)
              </span>
              <Select
                value={String(pageNumber)}
                onValueChange={(value) => setPageNumber(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PAGE_OPTIONS.map((page) => (
                      <SelectItem key={page} value={String(page)}>
                        page {page}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <label className="bg-muted/30 mt-2 flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
              <span className="flex flex-col">
                <span className="font-medium">Render sibling</span>
                <span className="text-muted-foreground text-xs">
                  Mounts a second component using the SAME queryKey to show
                  request dedup.
                </span>
              </span>
              <Switch checked={showSibling} onCheckedChange={setShowSibling} />
            </label>
          </CardContent>
        </Card>

        <CacheInspector
          title="user-* cache entries"
          description="Each unique queryKey gets its own row. Old keys linger until gcTime."
          filterAction={(query) => query.queryKey[0] === 'user'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UserCard userId={userId} pageNumber={pageNumber} label="Primary" />
        {showSibling ? (
          <UserCard
            userId={userId}
            pageNumber={pageNumber}
            label="Sibling (same key — dedup)"
          />
        ) : (
          <Card className="text-muted-foreground flex items-center justify-center text-sm">
            Sibling unmounted
          </Card>
        )}
        <UserCard
          userId={userId}
          pageNumber={pageNumber === 1 ? 2 : 1}
          label={`Different page (page ${pageNumber === 1 ? 2 : 1})`}
        />
      </div>
    </div>
  )
}

function UserCard({
  userId,
  pageNumber,
  label,
}: {
  userId: number
  pageNumber: number
  label: string
}) {
  const query = useQuery({
    queryKey: ['user', { id: userId, page: pageNumber }],
    queryFn: async () => fetchUser(userId),
  })

  return (
    <QueryDebugCard
      title={label}
      description={
        <>
          key:{' '}
          <code className="font-mono text-xs">
            {JSON.stringify(['user', { id: userId, page: pageNumber }])}
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
