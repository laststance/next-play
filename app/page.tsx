import { Main } from '@/components/main'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  return (
    <Main>
      <div className="flex-1 space-x-4">
        <Button asChild variant="outline">
          <Link href="/guestbook">guestbook</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tab">tab</Link>
        </Button>
      </div>
    </Main>
  )
}
