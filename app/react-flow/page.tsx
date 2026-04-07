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
  Handle,
  Position,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps,
} from '@xyflow/react'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import '@xyflow/react/dist/style.css'

import { Main } from '@/components/main'

const initialNodes: Node[] = [
  {
    id: 'condition',
    position: { x: 0, y: 0 },
    data: { label: 'Age >= 18?' },
    type: 'conditionNode',
  },
  { id: 'yes-result', position: { x: -150, y: 200 }, data: { label: 'Adult' } },
  { id: 'no-result', position: { x: 150, y: 200 }, data: { label: 'Minor' } },
  { id: 'start', position: { x: 0, y: -150 }, data: { label: 'Start' } },
]

// Each edge specifies which sourceHandle it leaves from.
// "yes" and "no" are just string IDs — React Flow does NOT evaluate conditions.
// YOUR app code would read this data to decide which path to follow.
const initialEdges: Edge[] = [
  { id: 'e-start', source: 'start', target: 'condition' },
  {
    id: 'e-yes',
    source: 'condition',
    sourceHandle: 'yes',
    target: 'yes-result',
    label: 'Yes',
    style: { stroke: '#22c55e' },
  },
  {
    id: 'e-no',
    source: 'condition',
    sourceHandle: 'no',
    target: 'no-result',
    label: 'No',
    style: { stroke: '#ef4444' },
  },
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
            nodeTypes={nodeTypes}
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

type ConditionNodeData = { label: string }
type ConditionNodeType = Node<ConditionNodeData, 'conditionNode'>

/**
 * A condition node with 1 input (top) and 2 outputs (bottom-left, bottom-right).
 * The two source handles have distinct IDs so edges can target them individually.
 */
function ConditionNode({ data }: NodeProps<ConditionNodeType>) {
  return (
    <div className="relative min-w-40 rounded-lg border-2 border-amber-400 bg-amber-100 px-4 py-3 text-center shadow-md">
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-bold">{data.label}</div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>Yes</span>
        <span>No</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '75%' }}
      />
    </div>
  )
}

const nodeTypes = { conditionNode: ConditionNode }
