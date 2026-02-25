import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { Guestbook } from '@/components/guestbook'
import { Main } from '@/components/main'

export default async function Page() {
  const notes = await prisma.guestNote.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Main>
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>
      <Guestbook initialNotes={notes} />
    </Main>
  )
}
