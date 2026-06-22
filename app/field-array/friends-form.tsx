'use client'

import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { FieldArrayFormValues } from '@/app/field-array/schema'
import { Button } from '@/components/ui/button'

/** Friends field array — reads form state from the parent `FormProvider`. */
export const FriendsForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FieldArrayFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'friends',
  })

  return (
    <>
      <p className="text-muted-foreground text-sm">
        友達の名前を追加・削除できます。
      </p>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <input
              {...register(`friends.${index}.name`)}
              placeholder={`友達 ${index + 1}`}
              className="border-border w-full rounded-md border px-3 py-2"
            />
            {errors.friends?.[index]?.name && (
              <p className="text-destructive text-sm">
                {errors.friends[index]?.name?.message}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: '' })}
        className="w-full"
      >
        <PlusIcon />
        友達を追加
      </Button>
    </>
  )
}
