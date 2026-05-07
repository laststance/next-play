import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type LessonPanelProps = ComponentProps<'section'> & {
  items: ReactNode[]
  title: string
  trailing?: ReactNode
}

/**
 * Renders a reusable learning note panel for dnd kit playground pages.
 * @param children - Optional supporting content before the ordered list.
 * @param className - Additional section classes.
 * @param items - Ordered lesson items to display.
 * @param title - The panel heading.
 * @param trailing - Optional status text or metadata aligned with the title.
 * @returns A themed section with a title and ordered learning checklist.
 * @example
 * <LessonPanel title="What to watch" items={['Drag', 'Drop']} />
 */
export function LessonPanel({
  children,
  className,
  items,
  title,
  trailing,
  ...rest
}: LessonPanelProps) {
  return (
    <section
      className={cn('bg-muted/40 rounded-2xl border p-5', className)}
      {...rest}
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-semibold">{title}</h2>
        {trailing ? (
          <div className="text-muted-foreground text-sm">{trailing}</div>
        ) : null}
      </div>
      {children}
      <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </section>
  )
}
