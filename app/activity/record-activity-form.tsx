'use client'

import { useActionState } from 'react'

import { recordActivity } from '@/actions/activity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function RecordActivityForm() {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const note = (formData.get('note') as string) || ''
      await recordActivity(note)
    },
    null,
  )

  return (
    <form action={formAction} className="flex gap-2">
      <Input
        name="note"
        placeholder="What did you work on?"
        className="max-w-sm"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Recording...' : 'Record Activity'}
      </Button>
    </form>
  )
}
