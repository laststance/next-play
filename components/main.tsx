import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'main'>>
export const Main = ({ children }: Props) => {
  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-8">
      {children}
    </main>
  )
}
