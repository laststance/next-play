import { Main } from '@/components/main'
import Link from 'next/link'

export default async function Home() {
  return (
    <Main>
      <Link href="/guestbook">guestbook</Link>
      <Link href="/tab">tab</Link>
    </Main>
  )
}
