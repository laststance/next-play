import { z } from 'zod'

import { MESSAGE_MIN_LENGTH } from '@/app/react-hook-form/constants'

/** Zod schema for the contact form on `/react-hook-form`. */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  subject: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .min(
      MESSAGE_MIN_LENGTH,
      `Message must be at least ${MESSAGE_MIN_LENGTH} characters`,
    ),
  subscribe: z.boolean(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const CONTACT_FORM_DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  subscribe: false,
}
