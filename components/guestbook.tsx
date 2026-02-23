'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createGuestNote, type GuestNoteActionState } from '@/actions/guestbook'

type GuestNote = {
  id: number
  guest: string
  message: string
  createdAt: Date
}
export const Guestbook = ({ initialNotes }: { initialNotes: GuestNote[] }) => {
  const router = useRouter()
  const initialState: GuestNoteActionState = { success: false, errors: null }
  const [state, formAction, isPending] = useActionState(
    createGuestNote,
    initialState,
  )

  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (state.success) {
      toast.success('投稿しました！')
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, router])

  return (
    <section className="border-boder flex w-full flex-1 flex-col items-center rounded-b-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">Guestbook</h2>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="grid w-[80%] grid-cols-[auto_1fr] items-center gap-4 px-8"
      >
        <label htmlFor="guest">guest</label>
        <input
          name="guest"
          type="text"
          className="border-border rounded-md border px-3 py-2"
        />
        {state.errors?.guest && (
          <>
            <div />
            <p className="text-destructive text-sm">{state.errors.guest[0]}</p>
          </>
        )}
        <label htmlFor="message">message</label>
        <textarea
          name="message"
          className="border-border rounded-md border px-3 py-2"
        ></textarea>
        {state.errors?.message && (
          <>
            <div />
            <p className="text-destructive text-sm">
              {state.errors.message[0]}
            </p>
          </>
        )}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground rounded-md px-4 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="mt-8 w-[80%] space-y-4 px-8 pb-8">
        {initialNotes.map((note) => (
          <div key={note.id} className="border-boder rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{note.guest}</span>
              <span className="text-muted-foreground text-sm">
                {note.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{note.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
