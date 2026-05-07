import { useDroppable } from '@dnd-kit/react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type DroppablePanelProps = Omit<ComponentProps<'section'>, 'id'> & {
  accept?: string
  activeClassName?: string
  collisionPriority?: number
  droppableId: string
  type?: string
}

/**
 * Connects a section to dnd kit droppable behavior for reusable drop targets.
 * @param accept - The draggable type this panel accepts.
 * @param activeClassName - Classes applied while this panel is the active drop target.
 * @param children - The panel content.
 * @param className - Base section classes.
 * @param collisionPriority - Optional priority used when items and containers overlap.
 * @param droppableId - The unique dnd kit identifier for this drop target.
 * @param type - Optional droppable type.
 * @returns A droppable `<section>` that highlights when active.
 * @example
 * <DroppablePanel droppableId="done">Drop here</DroppablePanel>
 */
export function DroppablePanel({
  accept,
  activeClassName,
  children,
  className,
  collisionPriority,
  droppableId,
  type,
  ...rest
}: DroppablePanelProps) {
  const { isDropTarget, ref } = useDroppable({
    accept,
    collisionPriority,
    id: droppableId,
    type,
  })

  return (
    <section
      ref={ref}
      className={cn(className, isDropTarget && activeClassName)}
      {...rest}
    >
      {children}
    </section>
  )
}
