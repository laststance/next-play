import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'

export const Header = () => {
  return (
    <header className="bg-header m-4 flex min-h-10 w-full max-w-3xl items-center gap-6 rounded-2xl border p-4">
      <Link href="/">
        <h1 className="text-header-foreground text-3xl">Next Play</h1>
      </Link>
      <nav className="text-header-foreground/70 flex gap-4 text-sm">
        <Link href="/guestbook" className="hover:text-header-foreground">
          Guestbook
        </Link>
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
