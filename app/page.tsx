import Link from 'next/link'

export default async function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32">
      <Link href="/guestbook">guestbook</Link>
    </main>
  )
}
