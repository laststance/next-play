'use client'

import { Activity, useState } from 'react'

import {
  COMPANY_TABS,
  DEFAULT_COMPANY_TAB_ID,
  getCompanyTabById,
} from '@/app/react-hook-form/constants'
import { ContactForm } from '@/app/react-hook-form/contact-form'
import { ContactPageHeader } from '@/app/react-hook-form/contact-page-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Company tab shell for `/react-hook-form`.
 * Each tab renders the same `ContactForm` while preserving its own draft state.
 */
export function CompanyContactPage() {
  const [activeCompanyId, setActiveCompanyId] = useState(DEFAULT_COMPANY_TAB_ID)
  const activeCompany = getCompanyTabById(activeCompanyId)

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

      <ContactPageHeader companyName={activeCompany.label} />

      {COMPANY_TABS.map(({ id }) => (
        <Activity key={id} mode={activeCompanyId === id ? 'visible' : 'hidden'}>
          <ContactForm />
        </Activity>
      ))}
    </>
  )
}
