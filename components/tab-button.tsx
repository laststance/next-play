import type { ComponentProps, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
type Props = { isActive: boolean } & PropsWithChildren<ComponentProps<'button'>>

export const TabButtonUnderline = ({
  isActive = false,
  children,
  ...rest
}: Props) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
        isActive
          ? 'border-primary text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:border-boder border-transparent',
        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
