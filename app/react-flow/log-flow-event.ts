import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from '@xyflow/react'

type NodeSummary = Readonly<{
  id: string
  position: Readonly<{ x: number; y: number }>
  label: unknown
  selected: boolean
}>

type EdgeSummary = Readonly<{
  id: string
  source: string
  target: string
  sourceHandle: string | null | undefined
  targetHandle: string | null | undefined
}>

/**
 * Shrink node arrays so console output stays readable while learning.
 * @param nodes - Full React Flow node state.
 * @returns A compact snapshot for logging.
 */
export function summarizeNodes(nodes: Node[]): NodeSummary[] {
  return nodes.map((node) => ({
    id: node.id,
    position: node.position,
    label: node.data.label,
    selected: Boolean(node.selected),
  }))
}

/**
 * Shrink edge arrays so console output stays readable while learning.
 * @param edges - Full React Flow edge state.
 * @returns A compact snapshot for logging.
 */
export function summarizeEdges(edges: Edge[]): EdgeSummary[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  }))
}

/**
 * Position updates fire many times while dragging, so collapse those groups by default.
 * @param changes - Incoming node change events from React Flow.
 * @returns True when every change is an in-progress drag tick.
 */
function isNodeDragTick(changes: NodeChange[]): boolean {
  return (
    changes.length > 0 &&
    changes.every(
      (change) =>
        change.type === 'position' &&
        'dragging' in change &&
        change.dragging === true,
    )
  )
}

/**
 * Log node state transitions triggered by `onNodesChange`.
 * @param lesson - Lesson label shown in the console prefix.
 * @param changes - Raw change objects from React Flow.
 * @param before - Node state before `applyNodeChanges`.
 * @param after - Node state after `applyNodeChanges`.
 */
export function logNodesChange(
  lesson: string,
  changes: NodeChange[],
  before: Node[],
  after: Node[],
): void {
  const group = isNodeDragTick(changes) ? console.groupCollapsed : console.group

  group(`[React Flow / ${lesson}] onNodesChange`)
  console.log('runs: applyNodeChanges(changes, nodes)')
  console.log('changes:', changes)
  console.log('nodes before:', summarizeNodes(before))
  console.log('nodes after:', summarizeNodes(after))
  console.groupEnd()
}

/**
 * Log edge state transitions triggered by `onEdgesChange`.
 * @param lesson - Lesson label shown in the console prefix.
 * @param changes - Raw change objects from React Flow.
 * @param before - Edge state before `applyEdgeChanges`.
 * @param after - Edge state after `applyEdgeChanges`.
 */
export function logEdgesChange(
  lesson: string,
  changes: EdgeChange[],
  before: Edge[],
  after: Edge[],
): void {
  console.group(`[React Flow / ${lesson}] onEdgesChange`)
  console.log('runs: applyEdgeChanges(changes, edges)')
  console.log('changes:', changes)
  console.log('edges before:', summarizeEdges(before))
  console.log('edges after:', summarizeEdges(after))
  console.groupEnd()
}

/**
 * Log a newly created connection before `addEdge` merges it into state.
 * @param lesson - Lesson label shown in the console prefix.
 * @param connection - Connection payload from React Flow.
 * @param before - Edge state before the new edge is appended.
 * @param after - Edge state after `addEdge`.
 */
export function logConnect(
  lesson: string,
  connection: Connection,
  before: Edge[],
  after: Edge[],
): void {
  console.group(`[React Flow / ${lesson}] onConnect`)
  console.log('runs: addEdge(connection, edges)')
  console.log('connection:', connection)
  console.log('edges before:', summarizeEdges(before))
  console.log('edges after:', summarizeEdges(after))
  console.groupEnd()
}

/**
 * Log imperative React Flow actions from buttons or helpers.
 * @param lesson - Lesson label shown in the console prefix.
 * @param action - Short action name such as `resetGraph` or `zoomIn`.
 * @param details - Extra values to inspect in DevTools.
 */
export function logFlowAction(
  lesson: string,
  action: string,
  details: Record<string, unknown>,
): void {
  console.group(`[React Flow / ${lesson}] ${action}`)
  Object.entries(details).forEach(([key, value]) => {
    console.log(`${key}:`, value)
  })
  console.groupEnd()
}

/**
 * Log connection validation decisions from `isValidConnection`.
 * @param lesson - Lesson label shown in the console prefix.
 * @param connection - Candidate connection being validated.
 * @param allowed - Whether React Flow should accept the connection.
 * @param reason - Human-readable explanation for learning.
 */
export function logValidConnection(
  lesson: string,
  connection: Connection | Edge,
  allowed: boolean,
  reason: string,
): void {
  console.group(
    `[React Flow / ${lesson}] isValidConnection → ${allowed ? 'allow' : 'block'}`,
  )
  console.log('connection:', connection)
  console.log('reason:', reason)
  console.groupEnd()
}
