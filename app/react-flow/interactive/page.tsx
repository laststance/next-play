'use client'

import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import '@xyflow/react/dist/style.css'

import { REACT_FLOW_CANVAS_HEIGHT_CLASS } from '@/app/react-flow/constants'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

const INITIAL_NODES: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3' } },
]

const INITIAL_EDGES: Edge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2' },
  { id: 'e2-3', source: 'n2', target: 'n3' },
]

/** Zoom and fit animations use a short duration for smoother feedback. */
const REACT_FLOW_ANIMATION_DURATION_MS = 300

/** Padding around the graph when fitting the viewport. */
const REACT_FLOW_FIT_VIEW_PADDING = 0.2

/** Upper bound for randomly placed nodes in the demo add-node action. */
const REACT_FLOW_RANDOM_POSITION_MAX_PX = 400

let nodeIdCounter = 4

/**
 * Lesson 3 canvas: must live inside ReactFlowProvider to use useReactFlow().
 * @returns The interactive React Flow canvas with toolbar controls.
 */
function FlowCanvas() {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)
  const reactFlow = useReactFlow()

  const isValidConnection = useCallback(
    (edgeOrConnection: Connection | Edge) => {
      const { source, target } = edgeOrConnection
      if (!source || !target || source === target) return false

      const isDuplicate = edges.some(
        (edge) =>
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source),
      )
      return !isDuplicate
    },
    [edges],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges)),
    [],
  )

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((currentEdges) => addEdge(params, currentEdges)),
    [],
  )

  const addNewNode = useCallback(() => {
    const id = `node-${nodeIdCounter++}`
    reactFlow.addNodes({
      id,
      position: {
        x: Math.random() * REACT_FLOW_RANDOM_POSITION_MAX_PX,
        y: Math.random() * REACT_FLOW_RANDOM_POSITION_MAX_PX,
      },
      data: { label: id },
    })
  }, [reactFlow])

  return (
    <ReactFlow
      isValidConnection={isValidConnection}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Panel position="top-right">
        <div className="flex flex-wrap gap-1">
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            onClick={async () =>
              reactFlow.zoomIn({ duration: REACT_FLOW_ANIMATION_DURATION_MS })
            }
            type="button"
          >
            Zoom In
          </button>
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            onClick={async () =>
              reactFlow.zoomOut({ duration: REACT_FLOW_ANIMATION_DURATION_MS })
            }
            type="button"
          >
            Zoom Out
          </button>
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            onClick={async () =>
              reactFlow.fitView({
                padding: REACT_FLOW_FIT_VIEW_PADDING,
                duration: REACT_FLOW_ANIMATION_DURATION_MS,
              })
            }
            type="button"
          >
            Fit View
          </button>
          <button
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white shadow hover:bg-blue-600"
            onClick={addNewNode}
            type="button"
          >
            + Add Node
          </button>
        </div>
      </Panel>
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}

/**
 * Lesson 3: programmatic control with useReactFlow and Panel.
 * @returns A React Flow page with zoom and add-node controls.
 */
export default function Page() {
  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          React Flow / Lesson 3
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Interactive Controls
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Wrap the canvas in `ReactFlowProvider`, then call `useReactFlow()`
              from a child component to zoom, fit the viewport, or add nodes
              from UI outside the graph.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/react-flow">All lessons</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section
          className={`bg-card overflow-hidden rounded-2xl border ${REACT_FLOW_CANVAS_HEIGHT_CLASS}`}
        >
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </section>

        <aside className="bg-card space-y-4 rounded-2xl border p-5 text-sm">
          <div>
            <h2 className="font-semibold">Provider rule</h2>
            <p className="text-muted-foreground mt-2">
              `useReactFlow()` only works in descendants of
              `&lt;ReactFlowProvider&gt;`. Keep the provider near the canvas,
              not at the app root, unless you really need global access.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Try this</h2>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4">
              <li>Use the top-right buttons to zoom and fit the graph.</li>
              <li>Add a few nodes, then connect them manually.</li>
              <li>
                Try creating the same edge twice — duplicates are blocked.
              </li>
            </ul>
          </div>
          <Button asChild className="w-full" variant="secondary">
            <Link href="/react-flow/basics">Back to Basics</Link>
          </Button>
        </aside>
      </div>
    </Main>
  )
}
