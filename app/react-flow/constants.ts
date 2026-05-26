/** Minimum height for React Flow canvases inside lesson pages. */
export const REACT_FLOW_CANVAS_MIN_HEIGHT_PX = 640

/** Tailwind class for a responsive React Flow viewport height. */
export const REACT_FLOW_CANVAS_HEIGHT_CLASS = 'h-[min(70vh,640px)]'

export type ReactFlowLesson = Readonly<{
  href: string
  label: string
  description: string
  topics: ReadonlyArray<string>
}>

/** Ordered lessons for the React Flow learning path. */
export const REACT_FLOW_LESSONS: ReadonlyArray<ReactFlowLesson> = [
  {
    href: '/react-flow/basics',
    label: 'Basics',
    description:
      'Nodes, edges, and the three handlers that keep React state in sync with the canvas.',
    topics: ['ReactFlow', 'applyNodeChanges', 'onConnect'],
  },
  {
    href: '/react-flow/custom-nodes',
    label: 'Custom Nodes',
    description:
      'Build a condition node with multiple Handles so each branch can be wired independently.',
    topics: ['nodeTypes', 'Handle', 'sourceHandle'],
  },
  {
    href: '/react-flow/interactive',
    label: 'Interactive Controls',
    description:
      'Use ReactFlowProvider and useReactFlow to zoom, fit the view, and add nodes from a Panel.',
    topics: ['ReactFlowProvider', 'useReactFlow', 'Panel'],
  },
]
