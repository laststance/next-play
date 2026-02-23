import prisma from '@/lib/prisma'
import { Guestbook } from '@/components/guestbook'

export default async function Home() {
  const notes = await prisma.guestNote.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32">
      <Guestbook initialNotes={notes} />
    </main>
  )
}
