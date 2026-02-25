import type { ComponentProps, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type Props = PropsWithChildren<ComponentProps<'main'>>
export const Main = ({ className, children, ...rest }: Props) => {
  return (
    <main
      className={cn(
        'flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8',
        className,
      )}
      {...rest}
    >
      {children}
    </main>
  )
}
