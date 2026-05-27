'use client'

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

/**
 * App-level wrapper that exposes a single TanStack Query client to all
 * descendants and mounts the React Query Devtools panel.
 *
 * Why a `useState` factory? In the App Router each render of a Server
 * Component sub-tree may re-evaluate Client Component bodies on the client.
 * Re-instantiating `QueryClient` per render would wipe the cache, defeat
 * dedup, and (in SSR-streaming scenarios) leak state across requests. The
 * stable lazy initializer guarantees exactly one client per browser session.
 *
 * @example
 *   <QueryProvider>
 *     <App />
 *   </QueryProvider>
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 5 * 60 * 1000,
          },
        },
      }),
  )

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
    </TanstackQueryClientProvider>
  )
}
