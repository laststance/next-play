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
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import '@xyflow/react/dist/style.css'

import { Main } from '@/components/main'

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3' } },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2' },
  { id: 'e2-3', source: 'n2', target: 'n3' },
]

/**
 * Step 5: useReactFlow Hook
 *
 * Demonstrates programmatic graph control — zoom, fit, and dynamic node creation
 * via buttons in a floating Panel.
 *
 * Key concept: useReactFlow() must be called inside a child of <ReactFlowProvider>,
 * NOT in the same component that renders <ReactFlowProvider>.
 * That's why we split into Page (provider) and FlowCanvas (consumer).
 */
export default function Page() {
  return (
    <Main>
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>
      <div className="w-full flex-1">
        <div style={{ width: '100%', height: '100vh' }}>
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </Main>
  )
}

let nodeIdCounter = 4

function FlowCanvas() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const reactFlow = useReactFlow()

  /**
   * @param edgeOrConnection - In-progress link as Connection or Edge (XYFlow typing)
   * @returns True when the link may be created
   */
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
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  )

  const addNewNode = useCallback(() => {
    const id = `node-${nodeIdCounter++}`
    reactFlow.addNodes({
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
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
        <div className="flex gap-1">
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100"
            onClick={() => reactFlow.zoomIn({ duration: 300 })}
          >
            Zoom In
          </button>
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100"
            onClick={() => reactFlow.zoomOut({ duration: 300 })}
          >
            Zoom Out
          </button>
          <button
            className="rounded bg-white px-2 py-1 text-xs shadow hover:bg-gray-100"
            onClick={() => reactFlow.fitView({ padding: 0.2, duration: 300 })}
          >
            Fit View
          </button>
          <button
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white shadow hover:bg-blue-600"
            onClick={addNewNode}
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
