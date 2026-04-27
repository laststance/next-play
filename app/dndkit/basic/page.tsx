'use client'
import { useDraggable } from '@dnd-kit/react'

import { Main } from '@/components/main'

function Draggable() {
  const { ref } = useDraggable({
    id: 'draggable',
  })

  return <button ref={ref}>Draggable</button>
}
export default function Page() {
  return (
    <Main>
      <Draggable />
    </Main>
  )
}
