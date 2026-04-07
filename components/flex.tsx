import { type ComponentProps, type PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

type Props = PropsWithChildren<ComponentProps<'div'>>
export const Flex = ({ className, children, ...rest }: Props) => {
  ;<div className={cn('flex', className)} {...rest}>
    {children}
  </div>
}
