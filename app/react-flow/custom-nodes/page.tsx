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
import Link from 'next/link'
import { useCallback, useState } from 'react'
import '@xyflow/react/dist/style.css'

import {
  REACT_FLOW_CANVAS_HEIGHT_CLASS,
  REACT_FLOW_LESSONS,
} from '@/app/react-flow/constants'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

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

type ConditionNodeData = { label: string }
type ConditionNodeType = Node<ConditionNodeData, 'conditionNode'>

/**
 * A condition node with one input and two labeled source handles.
 * @param props - React Flow node props for the custom node type.
 * @returns A diamond-style decision node with Yes/No handles.
 */
function ConditionNode({ data }: NodeProps<ConditionNodeType>) {
  return (
    <div className="relative min-w-40 rounded-lg border-2 border-amber-400 bg-amber-100 px-4 py-3 text-center shadow-md dark:border-amber-500 dark:bg-amber-950">
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

/**
 * Lesson 2: custom nodes and multiple handles on one node.
 * @returns A React Flow page with a branching condition node.
 */
export default function Page() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  )

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  )

  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          React Flow / Lesson 2
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Custom Nodes</h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Register custom components with `nodeTypes`, then use `Handle` IDs
              so each branch edge can leave from a specific source handle.
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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </section>

        <aside className="bg-card space-y-4 rounded-2xl border p-5 text-sm">
          <div>
            <h2 className="font-semibold">Important detail</h2>
            <p className="text-muted-foreground mt-2">
              `sourceHandle: &apos;yes&apos;` and `sourceHandle: &apos;no&apos;`
              tell React Flow which handle an edge starts from. React Flow does
              not evaluate the condition — your app reads the graph data later.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Try this</h2>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4">
              <li>Reconnect the green Yes edge to another node.</li>
              <li>
                Drag the amber condition node and watch handles move with it.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Next lesson</h2>
            <p className="text-muted-foreground mt-2">
              {REACT_FLOW_LESSONS[2]?.description}
            </p>
            <Button asChild className="mt-3 w-full" variant="secondary">
              <Link href="/react-flow/interactive">Interactive Controls</Link>
            </Button>
          </div>
        </aside>
      </div>
    </Main>
  )
}
