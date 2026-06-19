/** Minimum characters required for the inquiry message field. */
export const MESSAGE_MIN_LENGTH = 10

type CompanyTab = Readonly<{
  id: string
  label: string
}>

/** Company tabs shown above the shared contact form. */
export const COMPANY_TABS: ReadonlyArray<CompanyTab> = [
  { id: 'acme', label: 'Acme Inc' },
  { id: 'globex', label: 'Globex Corp' },
  { id: 'initech', label: 'Initech' },
] as const

export const DEFAULT_COMPANY_TAB_ID = COMPANY_TABS[0].id

/** Returns the tab config for a company id, falling back to the first tab. */
export function getCompanyTabById(companyId: string): CompanyTab {
  return (
    COMPANY_TABS.find((company) => company.id === companyId) ?? COMPANY_TABS[0]
  )
}
