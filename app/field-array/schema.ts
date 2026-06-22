import { z } from 'zod'

/** Zod schema for the field-array demo on `/field-array`. */
export const fieldArrayFormSchema = z.object({
  food: z.string().trim().min(1, '食べ物は必須です'),
  friends: z
    .array(
      z.object({
        name: z.string().trim().min(1, '名前は必須です'),
      }),
    )
    .min(1, '友達を1人以上追加してください'),
})

export type FieldArrayFormValues = z.infer<typeof fieldArrayFormSchema>

export const FIELD_ARRAY_FORM_DEFAULT_VALUES: FieldArrayFormValues = {
  food: 'ピザ',
  friends: [{ name: '' }],
}
