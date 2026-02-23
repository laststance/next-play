'use client'
import { create } from 'node:domain'
import { useActionState } from 'react'
import { createGuestNote, type GuestNoteActionState } from '@/actions/guestbook'

export const Guestbook = () => {
  const initialState: GuestNoteActionState = { success: false, errors: null }
  const [state, formAction, isPending] = useActionState(
    createGuestNote,
    initialState,
  )

  return (
    <section className="border-boder flex w-full flex-1 flex-col items-center rounded-b-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">Guestbook</h2>
      </div>

      <form
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
        <div className="justfy-end col-span-2 flex">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground rounded-md px-2 px-4 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  )
}
