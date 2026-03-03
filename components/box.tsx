import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'div'>>
export const Box = ({ children, ...rest }: Props) => (
  <div {...rest}>{children}</div>
)
