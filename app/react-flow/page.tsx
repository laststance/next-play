import Link from 'next/link'

import { REACT_FLOW_LESSONS } from '@/app/react-flow/constants'
import { Main } from '@/components/main'
import { Button } from '@/components/ui/button'

/**
 * React Flow learning hub with links to each lesson.
 * @returns The index page for the React Flow playground.
 */
export default function Page() {
  return (
    <Main className="max-w-5xl items-stretch gap-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium">React Flow</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Node-Based UI Playground
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Learn React Flow step by step inside Next.js. Each lesson focuses on
            one concept: controlled state, custom nodes, then programmatic
            controls.
          </p>
        </div>
      </header>

      <section className="grid gap-4">
        {REACT_FLOW_LESSONS.map((lesson, index) => (
          <article
            key={lesson.href}
            className="bg-card flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Lesson {index + 1}
              </p>
              <h2 className="text-xl font-semibold">{lesson.label}</h2>
              <p className="text-muted-foreground text-sm">
                {lesson.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {lesson.topics.map((topic) => (
                  <li
                    key={topic}
                    className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild className="shrink-0">
              <Link href={lesson.href}>Open lesson</Link>
            </Button>
          </article>
        ))}
      </section>

      <section className="bg-muted/40 rounded-2xl border border-dashed p-5 text-sm">
        <h2 className="font-semibold">Setup notes</h2>
        <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4">
          <li>
            Package: <code className="text-foreground">@xyflow/react</code>{' '}
            (already installed in this repo).
          </li>
          <li>
            Client pages need{' '}
            <code className="text-foreground">use client</code> and{' '}
            <code className="text-foreground">
              import &apos;@xyflow/react/dist/style.css&apos;
            </code>
            .
          </li>
          <li>Start with Lesson 1 if you are new to node editors.</li>
        </ul>
      </section>
    </Main>
  )
}
