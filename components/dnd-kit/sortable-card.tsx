import { useSortable } from '@dnd-kit/react/sortable'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type UseSortableOptions = Parameters<typeof useSortable>[0]

type SortableCardRenderState = {
  isDragging: boolean
}

type SortableCardChildren =
  | ReactNode
  | ((state: SortableCardRenderState) => ReactNode)

type SortableCardProps = Omit<ComponentProps<'li'>, 'children' | 'id'> & {
  accept?: string
  children?: SortableCardChildren
  draggingClassName?: string
  group?: string
  index: number
  itemId: string
  plugins?: UseSortableOptions['plugins']
  transition?: UseSortableOptions['transition']
  type?: string
}

/**
 * Connects a list item to dnd kit sortable behavior while leaving its content reusable.
 * @param accept - The sortable type this item accepts when moving across groups.
 * @param children - Static content or a render function that receives drag state.
 * @param className - Base list item classes.
 * @param draggingClassName - Extra classes while this item is being dragged.
 * @param group - Optional group/column identifier for multi-list sorting.
 * @param index - The current zero-based position inside the list or group.
 * @param itemId - The unique dnd kit identifier for this sortable item.
 * @param plugins - Optional sortable plugin override.
 * @param transition - Optional sortable transition override.
 * @param type - Optional sortable type used with `accept`.
 * @returns A sortable `<li>` that renders the provided content.
 * @example
 * <SortableCard itemId="task-1" index={0}>Task</SortableCard>
 */
export function SortableCard({
  accept,
  children,
  className,
  draggingClassName,
  group,
  index,
  itemId,
  plugins,
  transition,
  type,
  ...rest
}: SortableCardProps) {
  const { isDragging, ref } = useSortable({
    accept,
    group,
    id: itemId,
    index,
    plugins,
    transition,
    type,
  })

  return (
    <li
      ref={ref}
      className={cn(className, isDragging && draggingClassName)}
      {...rest}
    >
      {typeof children === 'function' ? children({ isDragging }) : children}
    </li>
  )
}
