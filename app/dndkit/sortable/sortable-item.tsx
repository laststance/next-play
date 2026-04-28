import { useSortable } from '@dnd-kit/react/sortable'

import { cn } from '@/lib/utils'

import type { SortableItem } from './constants'
import { SORTABLE_INDEX_DISPLAY_OFFSET } from './constants'

type SortableListItemProps = {
  index: number
  item: SortableItem
}

/**
 * Renders one row that can be reordered inside the sortable list.
 * @param index - The current zero-based index that dnd kit uses for sorting.
 * @param item - The visible learning step represented by this row.
 * @returns A sortable list item connected to dnd kit through its ref.
 * @example
 * <SortableListItem index={0} item={item} />
 */
export function SortableListItem({ index, item }: SortableListItemProps) {
  const { isDragging, ref } = useSortable({
    id: item.id,
    index,
  })

  return (
    <li
      ref={ref}
      className={cn(
        'bg-background flex min-h-24 items-center gap-4 rounded-xl border p-4 transition',
        isDragging && 'border-primary bg-primary/5 scale-[1.02] opacity-80',
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
        {index + SORTABLE_INDEX_DISPLAY_OFFSET}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{item.title}</h2>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>
      <span className="bg-secondary text-secondary-foreground rounded-md px-3 py-2 text-sm font-medium">
        Drag row
      </span>
    </li>
  )
}
