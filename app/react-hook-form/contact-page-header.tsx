import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

type ContactPageHeaderProps = Readonly<{
  companyName: string
}>

/** Page header for the contact form, showing the selected company name. */
export function ContactPageHeader({ companyName }: ContactPageHeaderProps) {
  return (
    <header className="w-full space-y-2">
      <div className="flex items-start justify-between gap-4">
        <p className="text-muted-foreground text-sm font-medium tracking-wide">
          {companyName}
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
        A typical webpage layout — page header, main form column, and sidebar —
        wired up with react-hook-form validation.
      </p>
    </header>
  )
}
