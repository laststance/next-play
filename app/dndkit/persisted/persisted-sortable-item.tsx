import { OptimisticSortingPlugin } from '@dnd-kit/dom/sortable'

import { SortableCard } from '@/components/dnd-kit'

import type { PersistedSortableItem } from './constants'
import { PERSISTED_SORTABLE_INDEX_DISPLAY_OFFSET } from './constants'

type PersistedSortableListItemProps = {
  index: number
  item: PersistedSortableItem
}

/**
 * Renders one persisted sortable row that shares the reusable dnd kit card primitive.
 * @param index - The current zero-based index that dnd kit uses for sorting.
 * @param item - The visible item data stored in localStorage.
 * @returns A sortable row for the persisted playground.
 * @example
 * <PersistedSortableListItem index={0} item={item} />
 */
export function PersistedSortableListItem({
  index,
  item,
}: PersistedSortableListItemProps) {
  return (
    <SortableCard
      className="bg-background flex min-h-24 items-center gap-4 rounded-xl border p-4 transition"
      index={index}
      itemId={item.id}
      plugins={(sortablePlugins) =>
        sortablePlugins.filter(
          (sortablePlugin) =>
            !Object.is(sortablePlugin, OptimisticSortingPlugin),
        )
      }
      transition={null}
    >
      <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
        {index + PERSISTED_SORTABLE_INDEX_DISPLAY_OFFSET}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{item.title}</h2>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>
      <span className="bg-secondary text-secondary-foreground rounded-md px-3 py-2 text-sm font-medium">
        Persisted
      </span>
    </SortableCard>
  )
}
