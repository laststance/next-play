'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  CONTACT_FORM_DEFAULT_VALUES,
  contactFormSchema,
  type ContactFormValues,
} from '@/app/react-hook-form/schema'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/**
 * Typical contact-page form powered by react-hook-form.
 * Used on `/react-hook-form` to demonstrate validation and layout patterns.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: CONTACT_FORM_DEFAULT_VALUES,
  })

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success('Message sent', {
      description: `${data.name} — check the console for the payload.`,
    })
    console.info('[react-hook-form]', data)
    reset(CONTACT_FORM_DEFAULT_VALUES)
  }

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Send a message</CardTitle>
          <CardDescription>
            Fill out the form below. Required fields are marked with an
            asterisk.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Your details</legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="name"
                  label="Name"
                  required
                  error={errors.name?.message}
                >
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    aria-invalid={Boolean(errors.name)}
                    {...register('name')}
                  />
                </FormField>

                <FormField
                  id="email"
                  label="Email"
                  required
                  error={errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </FormField>
              </div>
            </fieldset>

            <Separator />

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Inquiry</legend>

              <FormField
                id="subject"
                label="Subject"
                error={errors.subject?.message}
              >
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  aria-invalid={Boolean(errors.subject)}
                  {...register('subject')}
                />
              </FormField>

              <FormField
                id="message"
                label="Message"
                required
                error={errors.message?.message}
              >
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us more about your request..."
                  aria-invalid={Boolean(errors.message)}
                  className={cn(
                    'border-input placeholder:text-muted-foreground dark:bg-input/30 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                  )}
                  {...register('message')}
                />
              </FormField>
            </fieldset>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="border-input mt-1 size-4 rounded border"
                {...register('subscribe')}
              />
              <span className="text-muted-foreground">
                Send me product updates and newsletter emails.
              </span>
            </label>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset(CONTACT_FORM_DEFAULT_VALUES)}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Office</CardTitle>
            <CardDescription>
              We usually reply within one business day.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>123 Market Street</p>
            <p>San Francisco, CA 94103</p>
            <p>hello@example.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>Include your account ID if you already use our product.</p>
            <p>Attach screenshots in a follow-up email after submitting.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

/** Label + control + inline validation message for a single form field. */
function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive ml-1">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}
