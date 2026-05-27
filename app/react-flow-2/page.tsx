'use client'

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import '@xyflow/react/dist/style.css'

import { REACT_FLOW_CANVAS_HEIGHT_CLASS } from '@/app/react-flow/constants'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

const LESSON_LABEL = 'getOutgoers'

const INITIAL_NODES: Node[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: 'b', position: { x: 220, y: -80 }, data: { label: 'B' } },
  { id: 'c', position: { x: 220, y: 80 }, data: { label: 'C' } },
  { id: 'd', position: { x: 440, y: 0 }, data: { label: 'D' } },
  { id: 'e', position: { x: 660, y: 0 }, data: { label: 'E' } },
]

const INITIAL_EDGES: Edge[] = [
  { id: 'a-b', source: 'a', target: 'b' },
  { id: 'a-c', source: 'a', target: 'c' },
  { id: 'b-d', source: 'b', target: 'd' },
  { id: 'c-d', source: 'c', target: 'd' },
  { id: 'd-e', source: 'd', target: 'e' },
]

const HIGHLIGHT_BG = '#bfdbfe'
const SELECTED_BG = '#fde68a'

/**
 * Inner canvas: renders nodes/edges and lets the user inspect outgoers.
 * `getOutgoers(node, nodes, edges)` returns the array of nodes that are
 * directly reachable from `node` along an edge where `node` is the source.
 */
function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { getNodes, getEdges } = useReactFlow()

  // Compute outgoers (1-hop downstream) for the currently selected node.
  const outgoerIds = useMemo(() => {
    if (!selectedId) return new Set<string>()
    const source = nodes.find((node) => node.id === selectedId)
    if (!source) return new Set<string>()
    const outgoers = getOutgoers(source, nodes, edges)
    console.log(`[${LESSON_LABEL}] getOutgoers`, {
      from: source.id,
      outgoers: outgoers.map((n) => n.id),
    })
    return new Set(outgoers.map((node) => node.id))
  }, [selectedId, nodes, edges])

  // Apply highlight styles by deriving display nodes from state.
  const displayNodes = useMemo(
    () =>
      nodes.map((node) => {
        const isSelected = node.id === selectedId
        const isOutgoer = outgoerIds.has(node.id)
        if (!isSelected && !isOutgoer) return node
        return {
          ...node,
          style: {
            ...node.style,
            background: isSelected ? SELECTED_BG : HIGHLIGHT_BG,
            border: isSelected ? '2px solid #f59e0b' : '2px solid #3b82f6',
          },
        }
      }),
    [nodes, selectedId, outgoerIds],
  )

  // Cycle prevention via recursive getOutgoers traversal.
  const isValidConnection = useCallback(
    (edgeOrConnection: Edge | Connection) => {
      const allNodes = getNodes()
      const allEdges = getEdges()
      const target = allNodes.find(
        (node) => node.id === edgeOrConnection.target,
      )
      if (!target) return false
      if (target.id === edgeOrConnection.source) {
        console.log(`[${LESSON_LABEL}] isValidConnection → false (self-loop)`)
        return false
      }

      const hasCycle = (node: Node, visited = new Set<string>()): boolean => {
        if (visited.has(node.id)) return false
        visited.add(node.id)
        for (const outgoer of getOutgoers(node, allNodes, allEdges)) {
          if (outgoer.id === edgeOrConnection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
        return false
      }

      const cycle = hasCycle(target)
      console.log(`[${LESSON_LABEL}] isValidConnection`, {
        source: edgeOrConnection.source,
        target: edgeOrConnection.target,
        wouldCycle: cycle,
      })
      return !cycle
    },
    [getNodes, getEdges],
  )

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((current) => addEdge(connection, current)),
    [setEdges],
  )

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id))
  }, [])

  const resetGraph = useCallback(() => {
    setSelectedId(null)
    setNodes(INITIAL_NODES)
    setEdges(INITIAL_EDGES)
  }, [setNodes, setEdges])

  return (
    <ReactFlow
      nodes={displayNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={() => setSelectedId(null)}
      isValidConnection={isValidConnection}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      <Controls />
      <MiniMap />
      <div className="absolute top-2 left-2 z-10 rounded bg-white/90 px-3 py-2 text-xs shadow dark:bg-zinc-900/90">
        <div className="font-medium">
          Selected: <code>{selectedId ?? '—'}</code>
        </div>
        <div className="text-muted-foreground">
          Outgoers:{' '}
          <code>
            {outgoerIds.size > 0 ? Array.from(outgoerIds).join(', ') : '(none)'}
          </code>
        </div>
        <button
          className="mt-2 rounded border px-2 py-0.5 text-xs hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={resetGraph}
          type="button"
        >
          Reset
        </button>
      </div>
    </ReactFlow>
  )
}

/**
 * Lesson page focused on the `getOutgoers` utility from @xyflow/react.
 */
export default function Page() {
  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          React Flow / Extra Lesson
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Learning <code>getOutgoers</code>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              <code>getOutgoers(node, nodes, edges)</code> returns every node
              that is one hop downstream of <code>node</code> — i.e. the targets
              of edges where <code>node</code> is the source. Click a node to
              highlight its outgoers, and try connecting nodes to see cycle
              prevention powered by recursive <code>getOutgoers</code>{' '}
              traversal.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/react-flow">All lessons</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section
          className={`bg-card relative overflow-hidden rounded-2xl border ${REACT_FLOW_CANVAS_HEIGHT_CLASS}`}
        >
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </section>

        <aside className="bg-card space-y-4 rounded-2xl border p-5 text-sm">
          <div>
            <h2 className="font-semibold">Signature</h2>
            <pre className="bg-muted mt-2 overflow-x-auto rounded p-2 text-xs">
              <code>{`getOutgoers(
  node,   // Node | { id: string }
  nodes,  // Node[]
  edges,  // Edge[]
): Node[]`}</code>
            </pre>
            <p className="text-muted-foreground mt-2">
              Returns nodes connected via edges whose <code>source</code> is{' '}
              <code>node.id</code>. Only goes 1 hop — recurse for deeper
              traversal.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Try this</h2>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4">
              <li>
                Click <code>A</code> → <code>B</code> and <code>C</code>{' '}
                highlight (direct outgoers).
              </li>
              <li>
                Click <code>D</code> → only <code>E</code> highlights.
              </li>
              <li>
                Try connecting <code>E → A</code>: blocked, would create a
                cycle.
              </li>
              <li>Open DevTools console to see each call logged.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Counterpart</h2>
            <p className="text-muted-foreground mt-2">
              <code>getIncomers(node, nodes, edges)</code> does the opposite —
              it returns nodes where <code>node</code> is the <em>target</em>.
            </p>
          </div>
        </aside>
      </div>
    </Main>
  )
}
