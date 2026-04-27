import Link from 'next/link'

import { Grid } from '@/components/grid'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

export default async function Home() {
  return (
    <Main>
      <Grid className="flex-1 grid-cols-6 gap-2">
        <Button asChild variant="outline">
          <Link href="/guestbook">guestbook</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tab">tab</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/field-array">field-array</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/action-prop">action-prop</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/react-flow">react-flow</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/react-flow-2">react-flow-2</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/activity">activity</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dndkit/basic">DnDKit / Basic</Link>
        </Button>
      </Grid>
    </Main>
  )
}
