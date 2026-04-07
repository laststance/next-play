'use client'

import { useTransition } from 'react'

import { Button, type ButtonVarient } from '@/components/ui/button'

type Props = {
  /** Async function to execute — Server Action or client async function */
  action: () => Promise<void>
  children: React.ReactNode
  variant?: ButtonVarient
  disabled?: boolean
  className?: string
}

/**
 * A design component that encapsulates async action handling using
 * React 19's useTransition + Action Prop pattern.
 *
 * The consumer simply passes an async function as `action` prop.
 * All pending state, disabled behavior, and loading UI are managed internally.
 *
 * @example
 * // With Server Action
 * <ActionButton action={() => deleteItem(id)} variant="destructive">
 *   Delete
 * </ActionButton>
 *
 * // With client async function
 * <ActionButton action={async () => { await fetch('/api/like') }}>
 *   Like
 * </ActionButton>
 */
export function ActionButton({
  action,
  children,
  variant = 'default',
  disabled = false,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          await action()
        })
      }}
      disabled={isPending || disabled}
      variant={variant}
      className={className}
      {...props}
    >
      {isPending ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
