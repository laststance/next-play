'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { PlusIcon, Trash2Icon } from 'lucide-react'

type Friend = {
  name: string
}

type FormValues = {
  friends: Friend[]
}

export const FieldArrayForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      friends: [{ name: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'friends',
  })

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center rounded-lg border">
      <div className="grid w-full place-content-center">
        <h2 className="p-8 text-2xl">useFieldArray Demo</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[80%] flex-col gap-4 px-8 pb-8"
      >
        <p className="text-muted-foreground text-sm">
          友達の名前を追加・削除できます。
        </p>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <input
                {...register(`friends.${index}.name`, {
                  required: '名前は必須です',
                })}
                placeholder={`友達 ${index + 1}`}
                className="w-full rounded-md border border-border px-3 py-2"
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

        <Button type="submit" className="w-full">
          送信
        </Button>
      </form>
    </section>
  )
}
