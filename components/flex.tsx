import { cn } from '@/lib/utils'
import { type ComponentProps, type PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'div'>>
export const Flex = ({ className, children, ...rest }: Props) => {
  ;<div className={cn('flex', className)} {...rest}>
    {children}
  </div>
}
