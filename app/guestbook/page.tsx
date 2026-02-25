import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { Guestbook } from '@/components/guestbook'

export default async function Page() {
  const notes = await prisma.guestNote.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8">
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>
      <Guestbook initialNotes={notes} />
    </main>
  )
}
