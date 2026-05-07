export type KanbanColumnId = 'backlog' | 'doing' | 'done'

export type KanbanCard = {
  id: string
  title: string
  description: string
}

export type KanbanColumn = {
  id: KanbanColumnId
  title: string
  description: string
}

export type KanbanColumns = Record<KanbanColumnId, KanbanCard[]>

export const KANBAN_CARD_TYPE = 'kanban-card' as const
export const KANBAN_INDEX_DISPLAY_OFFSET = 1
export const KANBAN_COLUMN_COLLISION_PRIORITY = -1

export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    description: 'Ideas that are ready to be picked up.',
  },
  {
    id: 'doing',
    title: 'Doing',
    description: 'Cards currently in progress.',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Finished cards. Starts empty for drop practice.',
  },
]

export const INITIAL_KANBAN_COLUMNS: KanbanColumns = {
  backlog: [
    {
      id: 'learn-groups',
      title: 'Learn sortable groups',
      description: '`group` tells dnd kit which column owns this card.',
    },
    {
      id: 'make-columns-droppable',
      title: 'Make columns droppable',
      description: 'Empty columns need their own drop target.',
    },
    {
      id: 'track-snapshot',
      title: 'Track a snapshot',
      description:
        'Save the board before drag so canceled moves can roll back.',
    },
  ],
  doing: [
    {
      id: 'move-between-columns',
      title: 'Move across columns',
      description: 'Use `initialGroup` and `group` to detect transfers.',
    },
    {
      id: 'reorder-column',
      title: 'Reorder inside one column',
      description:
        'Use `initialIndex` and `index` when the group is unchanged.',
    },
  ],
  done: [],
}
