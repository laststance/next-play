import { Main } from '@/components/main'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Grid } from '@/components/grid'

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
      </Grid>
    </Main>
  )
}
