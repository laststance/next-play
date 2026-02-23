'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const guestNoteSchema = z.object({
  guest: z.string().trim().min(1, 'Name is required'),
  message: z.string().trim().min(1, 'Message is required'),
})

export type GuestNoteActionState = {
  success: boolean
  errors: {
    guest?: string[]
    message?: string[]
  } | null
}

export async function createGuestNote(
  _prevState: GuestNoteActionState,
  formData: FormData,
): Promise<GuestNoteActionState> {
  // 1. Get field from FormData
  const guest = formData.get('guest') as string
  const message = formData.get('message') as string

  // 2. Zod validation
  const result = guestNoteSchema.safeParse({ guest, message })

  // 3. Invalidate -> return error messages
  if (result.success === false) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  } else {
    // 4. Insert form data to DB
    await prisma.guestNote.create({
      data: { guest: result.data.guest, message: result.data.message },
    })

    // 5. Success response
    return { success: true, errors: null }
  }
}
