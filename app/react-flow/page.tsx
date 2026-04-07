'use client'

import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
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

// Define the two nodes that appear when the page first loads.
const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 150 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 300, y: 50 }, data: { label: 'Node 3' } },
  { id: 'n4', position: { x: 300, y: 200 }, data: { label: 'Node 4' } },
]

// Seed the canvas with one edge connecting the initial nodes.
const initialEdges: Edge[] = [
  { id: 'n1-n2', source: 'n1', target: 'n2', label: 'some text' },
  { id: 'n1-n3', source: 'n1', target: 'n3', animated: true },
  { id: 'n1-n4', source: 'n1', target: 'n4', style: { stroke: 'red' } },
]

/**
 * Render a simple React Flow example with two nodes and one initial connection.
 * @returns The React Flow playground page.
 */
export default function Page() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  // Keep node state in sync with drag, move, and selection updates from React Flow.
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  )

  // Keep edge state in sync when existing connections are edited or removed.
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  )

  // Add a new edge when the user connects two handles in the canvas.
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  )

  return (
    <Main>
      <div className="w-full flex-1">
        <Link className="inline-flex place-items-center gap-2" href="/">
          <ArrowLeftIcon className="h-4 w-4" /> Home
        </Link>
      </div>
      <div className="w-full flex-1">
        {/* Give the flow canvas full viewport space for panning and zooming. */}
        <div style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            data-test-id="ReactFlow"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </Main>
  )
}
