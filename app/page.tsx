import { Main } from '@/components/main'
import Link from 'next/link'

export default async function Home() {
  return (
    <Main>
      <div className="flex-1">
        <Link href="/guestbook">guestbook</Link>
        <Link href="/tab">tab</Link>
      </div>
    </Main>
  )
}
