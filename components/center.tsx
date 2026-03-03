import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'div'>>
export const Center = ({ children, ...rest }: Props) => (
  <div {...rest}>{children}</div>
)
