import { simulateDeleteAction, simulateLikeAction } from '@/actions/demo'
import { ActionButton } from '@/components/action-button'

export default function ActionPropPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          useTransition + Action Prop Pattern
        </h1>
        <p className="text-muted-foreground mt-2">
          Issue #1 — React 19 の useTransition を使ったデザインコンポーネント
        </p>
      </div>

      {/* Pattern explanation */}
      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ul className="text-muted-foreground list-disc space-y-1 pl-6">
          <li>
            <code>ActionButton</code> は内部で <code>useTransition()</code>{' '}
            を持つ
          </li>
          <li>
            利用者は <code>action</code> prop に非同期関数を渡すだけ
          </li>
          <li>isPending / disabled / スピナーは全てコンポーネントが管理</li>
          <li>Server Action でも Client 関数でも渡せる</li>
        </ul>
      </section>

      {/* Demo: Server Actions */}
      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Demo: Server Actions</h2>
        <p className="text-muted-foreground text-sm">
          ボタンを押すとサーバー側で処理が実行される。ターミナルのログを確認してみよう。
        </p>

        <div className="flex gap-4">
          <ActionButton action={simulateLikeAction.bind(null, 'post-42')}>
            Like Post
          </ActionButton>

          <ActionButton
            action={simulateDeleteAction.bind(null, 'item-7')}
            variant="destructive"
          >
            Delete Item
          </ActionButton>
        </div>
      </section>

      {/* Code example */}
      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Usage</h2>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{`// Server Action を .bind() で引数バインドして渡す
<ActionButton action={deleteAction.bind(null, id)} variant="destructive">
  Delete
</ActionButton>

// Client Component 内では直接ラムダも可能
<ActionButton action={async () => { await fetch('/api/like') }}>
  Like
</ActionButton>`}</code>
        </pre>
      </section>
    </main>
  )
}
