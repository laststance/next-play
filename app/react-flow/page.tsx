'use client'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

import { Main } from '@/components/main'

export default function Page() {
  return (
    <Main>
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>
      <div className="w-full flex-1">fjewoijoewi</div>
    </Main>
  )
}
