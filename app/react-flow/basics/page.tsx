'use client'

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  REACT_FLOW_CANVAS_HEIGHT_CLASS,
  REACT_FLOW_LESSONS,
} from '@/app/react-flow/constants'
import {
  logConnect,
  logEdgesChange,
  logFlowAction,
  summarizeEdges,
  summarizeNodes,
} from '@/app/react-flow/log-flow-event'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

const INITIAL_NODES: Node[] = [
  { id: 'input', position: { x: 240, y: 0 }, data: { label: 'Input node' } },
  {
    id: 'output',
    position: { x: 0, y: 400 },
    data: { label: 'Output node' },
  },
]

const INITIAL_EDGES: Edge[] = [
  { id: 'input-output', source: 'input', target: '', animated: true },
]

const LESSON_LABEL = 'Basics'

/**
 * Lesson 1: the smallest useful React Flow setup for learning.
 * @returns A playground page with nodes, edges, and sync handlers.
 */
export default function Page() {
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((currentNodes) => {
        const nextNodes = applyNodeChanges(changes, currentNodes)
        // logNodesChange(LESSON_LABEL, changes, currentNodes, nextNodes)
        return nextNodes
      }),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges)
        logEdgesChange(LESSON_LABEL, changes, currentEdges, nextEdges)
        return nextEdges
      }),
    [],
  )

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((currentEdges) => {
        toast('onConnect')
        const nextEdges = addEdge(connection, currentEdges)
        logConnect(LESSON_LABEL, connection, currentEdges, nextEdges)
        return nextEdges
      }),
    [],
  )

  const resetGraph = useCallback(() => {
    logFlowAction(LESSON_LABEL, 'resetGraph', {
      handler: 'setNodes(INITIAL_NODES) + setEdges(INITIAL_EDGES)',
      nodes: summarizeNodes(INITIAL_NODES),
      edges: summarizeEdges(INITIAL_EDGES),
    })
    setNodes(INITIAL_NODES)
    setEdges(INITIAL_EDGES)
  }, [])

  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">
          React Flow / Lesson 1
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Nodes, Edges, and Handlers
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              React Flow renders a graph, but your app still owns the data. Drag
              nodes, connect handles, and watch `onNodesChange`,
              `onEdgesChange`, and `onConnect` keep React state aligned with the
              canvas. Open DevTools Console to see each handler and state diff.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/react-flow">All lessons</Link>
            </Button>
            <Button onClick={resetGraph} type="button" variant="outline">
              Reset graph
            </Button>
          </div>
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
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </section>

        <aside className="bg-card space-y-4 rounded-2xl border p-5 text-sm">
          <div>
            <h2 className="font-semibold">Try this</h2>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4">
              <li>Drag either node around the canvas.</li>
              <li>Drag from one handle to another to create a new edge.</li>
              <li>Select an edge and press Delete to remove it.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Core pieces</h2>
            <dl className="text-muted-foreground mt-2 space-y-2">
              <div>
                <dt className="text-foreground font-medium">nodes</dt>
                <dd>Array of `{`{ id, position, data }`}` objects.</dd>
              </div>
              <div>
                <dt className="text-foreground font-medium">edges</dt>
                <dd>Array of `{`{ id, source, target }`}` links.</dd>
              </div>
              <div>
                <dt className="text-foreground font-medium">onConnect</dt>
                <dd>Runs when the user finishes drawing a connection.</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="font-semibold">Console</h2>
            <p className="text-muted-foreground mt-2">
              Logs are prefixed with{' '}
              <code className="text-foreground">[React Flow / Basics]</code>.
              Drag logs collapse while moving; click the group to expand them.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Next lesson</h2>
            <p className="text-muted-foreground mt-2">
              {REACT_FLOW_LESSONS[1]?.description}
            </p>
            <Button asChild className="mt-3 w-full" variant="secondary">
              <Link href="/react-flow/custom-nodes">Custom Nodes</Link>
            </Button>
          </div>
        </aside>
      </div>
    </Main>
  )
}
