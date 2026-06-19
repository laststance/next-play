'use client'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { Activity, useState } from 'react'

import {
  COMPANY_TABS,
  DEFAULT_COMPANY_TAB_ID,
} from '@/app/react-hook-form/constants'
import { ContactForm } from '@/app/react-hook-form/contact-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Company tab shell for `/react-hook-form`.
 * Each tab renders the same `ContactForm` while preserving its own draft state.
 */
export function CompanyContactPage() {
  const [activeCompanyId, setActiveCompanyId] = useState(DEFAULT_COMPANY_TAB_ID)

  return (
    <>
      <div className="w-full">
        <Tabs value={activeCompanyId} onValueChange={setActiveCompanyId}>
          <TabsList className="grid w-full grid-cols-3">
            {COMPANY_TABS.map(({ id, label }) => (
              <TabsTrigger key={id} value={id}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <header className="w-full space-y-2">
        <div className="flex items-start justify-between gap-4">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            react-hook-form
          </p>
          <Link
            className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1 text-xs transition-colors"
            href="/"
          >
            <ArrowLeftIcon className="h-3 w-3" />
            Home
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          A typical webpage layout — page header, main form column, and sidebar
          — wired up with react-hook-form validation.
        </p>
      </header>

      {COMPANY_TABS.map(({ id }) => (
        <Activity key={id} mode={activeCompanyId === id ? 'visible' : 'hidden'}>
          <ContactForm />
        </Activity>
      ))}
    </>
  )
}
