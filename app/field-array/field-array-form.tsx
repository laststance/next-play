'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { FriendsForm } from '@/app/field-array/friends-form'
import {
  FIELD_ARRAY_FORM_DEFAULT_VALUES,
  fieldArrayFormSchema,
  type FieldArrayFormValues,
} from '@/app/field-array/schema'
import { Button } from '@/components/ui/button'

export const FieldArrayForm = () => {
  const methods = useForm<FieldArrayFormValues>({
    resolver: zodResolver(fieldArrayFormSchema),
    defaultValues: FIELD_ARRAY_FORM_DEFAULT_VALUES,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const onSubmit = (data: FieldArrayFormValues) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center rounded-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">useFieldArray Demo</h2>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-[80%] flex-col gap-4 px-8 pb-8"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="food">食べ物</label>
            <input
              {...register('food')}
              placeholder="食べ物"
              className="border-border w-full rounded-md border px-3 py-2"
            />
            {errors.food && (
              <p className="text-destructive text-sm">{errors.food.message}</p>
            )}
          </div>

          <FriendsForm />

          <Button type="submit" className="w-full">
            送信
          </Button>
        </form>
      </FormProvider>
    </section>
  )
}
