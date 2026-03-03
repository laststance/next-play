import { cn } from '@/lib/utils'
import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'div'>>
export const Grid = ({ children, className, ...rest }: Props) => {
  ;<div className={cn('grid', className)} {...rest}>
    {children}
  </div>
}
