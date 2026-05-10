# React 19 における Strict Mode の二重レンダリング挙動 調査レポート

調査日: 2026-05-10
対象バージョン: React 19.0 / 19.1 / 19.2、Next.js 16.x
情報源タイプ: 一次資料優先 (react.dev / facebook/react リポジトリ / Next.js 公式ドキュメント)

---

## TL;DR (結論を先に)

**いいえ、React 19 では Strict Mode の二重レンダリングは「解消」されていません。**

- コンポーネント本体の二重呼び出し (double render) は **React 19 でもそのまま継続**
- Effect の `setup -> cleanup -> setup` (mount -> unmount -> remount) も **React 19 でもそのまま継続**
- React 19 で行われたのは「廃止」ではなく **改良 (refinements)**
  - `useMemo` / `useCallback` が 2 回目のレンダーで 1 回目のメモ化結果を再利用するようになった
  - ref callback が初回マウント時に二重呼び出しされるようになった (Suspense fallback シミュレーションのため)
  - `useId`、`useSyncExternalStore` などの Strict Mode 関連バグ修正
- 「React 19 で useEffect の二重実行が直った」という LinkedIn / Medium の主張は **誤情報**。React 公式の Upgrade Guide および React リポジトリの CHANGELOG が真逆のことを述べています。

確信度: **高 (High)** — 一次資料 3 つ以上で相互裏付け。

---

## Executive Summary

React 18 で導入された "Stricter Strict Mode" (= 開発時にコンポーネントを意図的に unmount/remount して effect の cleanup 漏れを検知する仕組み) は **React 19 でも動作も哲学も同一** です。

これは React チームの将来計画 (Activity / Offscreen API による「state を保ったままの un-mount/re-mount」) のための準備として位置づけられており、React 19 では撤回されるどころか **より厳格化 (例: Activity 可視化時の double invoke、ハイドレーション時の double invoke)** されています。

ユーザーが感じる「二重レンダリング」「useEffect の二重実行」は仕様通りで、開発モード限定。本番ビルドには **一切影響しません**。

---

## 詳細調査結果 (Sub-questions ごと)

### Sub-Q1: React 19 で関数コンポーネント本体は依然として 2 回呼ばれるか?

**答え: はい。完全に継続。**

React 公式 `<StrictMode>` リファレンスページ ([react.dev/reference/react/StrictMode](https://react.dev/reference/react/StrictMode)) より逐語引用:

> "Your components will re-render an extra time to find bugs caused by impure rendering."
>
> "Strict Mode calls some of your functions (only the ones that should be pure) **twice in development.**"

対象は以下:

- `useState` の initializer
- `set` 関数 (updater form)
- `useMemo` の計算関数
- `useReducer` の reducer
- クラスコンポーネントの `constructor` / `render` / `shouldComponentUpdate`

facebook/react リポジトリのソースコード上では、`shouldDoubleRenderDEV` フラグが `__DEV__ && (mode & StrictLegacyMode)` のときに true となり、`renderWithHooksAgain` を呼んで第 2 レンダーを実行します (DeepWiki による facebook/react コードベース解析結果)。

確信度: **高**

---

### Sub-Q2: React 19 で Effect (useEffect / useLayoutEffect) は依然として mount → unmount → remount されるか?

**答え: はい。完全に継続。**

React 公式 `<StrictMode>` ドキュメント逐語引用:

> "When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every Effect.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually."

つまり開発モードでは `setup -> cleanup -> setup` のサイクルが走ります。

facebook/react コードベース上では `doubleInvokeEffectsOnFiber` 関数が passive effect / layout effect を無条件に disconnect & connect します (DeepWiki 解析より)。これは React 18 と React 19 で **共通**。

さらに、2026 年 4 月のコミット [#35961](https://github.com/facebook/react/commit/67e47593b607ecc08ac59361d8aba7ad2eef028a) ("[Fiber] Double invoke Effects in Strict Mode during Hydration") では **ハイドレーション時にも Effect の double invoke が走るように追加修正** されています。これは「廃止の方向」とは真逆です。

確信度: **高**

---

### Sub-Q3: React 19 で新規追加された Strict Mode のチェックはあるか?

**答え: あります。主に refs と useMemo/useCallback 周り。**

React 19 Upgrade Guide ([react.dev/blog/2024/04/25/react-19-upgrade-guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)) より逐語引用:

> "React 19 includes several fixes and improvements to Strict Mode.
>
> When double rendering in Strict Mode in development, `useMemo` and `useCallback` will reuse the memoized results from the first render during the second render. Components that are already Strict Mode compatible should not notice a difference in behavior.
>
> As with all Strict Mode behaviors, these features are designed to proactively surface bugs in your components during development so you can fix them before they are shipped to production. For example, during development, Strict Mode will double-invoke ref callback functions on initial mount, to simulate what happens when a mounted component is replaced by a Suspense fallback."

要点:

1. **`useMemo` / `useCallback` の挙動改善** — 2 回目のレンダーで 1 回目のメモ化結果を再利用 (factory 関数自体は二重実行されるが、結果は使い回される)
2. **ref callback の初回マウント時 double invocation** — Suspense fallback で置き換わる挙動をシミュレート

この記述は「React 19 でも double rendering / double invocation は動いている」という前提を直接表明している点に注目してください。

確信度: **高**

---

### Sub-Q4: React 18 → React 19 で具体的に何が変わったか? PR/コミット番号付き

facebook/react CHANGELOG.md の React 19 セクションより、StrictMode 関連の PR 一覧を逐語引用:

> "Changes to _StrictMode_
>
> - Handle `info`, `group`, and `groupCollapsed` in _StrictMode_ logging (#25172 by @timneutkens)
> - Refs are now attached/detached/attached in _StrictMode_ (#25049 by @sammy-SC)
> - Fix `useSyncExternalStore()` hydration in _StrictMode_ (#26791 by @sophiebits)
> - Always trigger `componentWillUnmount()` in _StrictMode_ (#26842 by @tyao1)
> - Restore double invoking `useState()` and `useReducer()` initializer functions in _StrictMode_ (#28248 by @eps1lon)
> - Reuse memoized result from first pass (#25583 by @acdlite)
> - Fix `useId()` in _StrictMode_ (#25713 by @gnoff)
> - Add component name to _StrictMode_ error messages (#25718 by @sammy-SC)"

そして React 19 の "Notable changes" セクションに:

> "**StrictMode changes:** `useMemo` and `useCallback` will now reuse the memoized results from the first render, during the second render. Additionally, StrictMode will now double-invoke ref callback functions on initial mount."

注目すべきは PR #28248 (eps1lon) の **"Restore double invoking ... in StrictMode"** — これは React 18 の途中で意図せず無効化されていた double invocation を React 19 で **復活** させたもの。React 19 は double invocation を弱めるどころか、抜けていた箇所を埋めて **強化** する方向に動いています。

CHANGELOG ソース: [github.com/facebook/react/blob/main/CHANGELOG.md](https://github.com/facebook/react/blob/main/CHANGELOG.md)

確信度: **高**

---

### Sub-Q5: 開発モードと本番モードでの違いは?

公式ドキュメント逐語引用:

> "**All of these checks are development-only and do not impact the production build.**"

- 開発時 (`NODE_ENV !== 'production'`): Strict Mode の二重呼び出し全てが有効
- 本番ビルド (`NODE_ENV === 'production'`): Strict Mode のチェックは **完全に無効**。コンポーネントは 1 回しか呼ばれず、Effect も 1 回しか走らない

これは React 18 / 19 で同一です。

確信度: **高**

---

### Sub-Q6: なぜ React チームはこの挙動を維持しているのか?

公式の理由 (legacy.reactjs.org/docs/strict-mode.html および react.dev) を要約:

1. **将来の Activity (旧 Offscreen) API への準備** — タブ離脱 → 戻る、画面遷移 → 戻る、で state を保持したまま unmount/remount するための耐性チェック
2. **Fast Refresh での挙動保証** — 開発中のホットリロードでも effect は再マウントされうる
3. **Suspense fallback への耐性** — Suspense でツリーが一時的にアンマウントされる際の挙動を事前にシミュレート
4. **Effect cleanup の習慣付け** — 「二重実行されると壊れる effect は本番でも壊れる可能性がある」という哲学

React 公式 `<StrictMode>` ページより:

> "If your effect breaks when it runs twice, it would have broken in production anyway—you just wouldn't have caught it during development." (これは公式ドキュメントの精神を要約した二次資料の表現だが、内容は公式の哲学と一致)

確信度: **高 (公式ドキュメントとの整合)**

---

### Sub-Q7: React 19 で Strict Mode をオプトアウトする方法はあるか?

**答え: はい、`<StrictMode>` ラッパー自体を外せばオプトアウト可能。ただしツリー内部での部分的な opt-out は不可能。**

公式ドキュメント逐語引用:

> "There is no way to opt out of Strict Mode inside a tree wrapped in `<StrictMode>`. This gives you confidence that all components inside `<StrictMode>` are checked."

つまり:

- アプリ全体: `<StrictMode>` を `root.render()` から外せばよい
- 部分的: 内側からは無効化できない (これは仕様)
- Next.js では `next.config.js` の `reactStrictMode: false` を設定可能 (後述)

ただし React チームは継続的に Strict Mode の使用を推奨しており、**外すことは将来の React 機能 (Activity 等) に対する耐性を失うことを意味**します。

確信度: **高**

---

### Sub-Q8: Next.js 16 は Strict Mode をデフォルトでラップしているか?

**答え: はい。App Router では Next.js 13.5.1 以降、デフォルトで有効。**

Next.js 公式ドキュメント ([nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode)) より逐語引用 (バージョン 16.2.6):

> "**Good to know**: Since Next.js 13.5.1, Strict Mode is `true` by default with `app` router, so the above configuration is only necessary for `pages`. You can still disable Strict Mode by setting `reactStrictMode: false`."

> "**Suggested**: We strongly suggest you enable Strict Mode in your Next.js application to better prepare your application for the future of React."

つまりこのプロジェクト (next-play, Next.js 16.x + App Router) では:

- `<StrictMode>` ラッパーは **Next.js が自動で挿入** している
- `app/layout.tsx` に明示的な `<StrictMode>` を書いていなくても有効
- 無効化したい場合は `next.config.js` で `reactStrictMode: false` を指定

確信度: **高**

---

## React 18 vs React 19 比較表

| 項目                                          | React 18                  | React 19                          | 変更点             |
| --------------------------------------------- | ------------------------- | --------------------------------- | ------------------ |
| 関数コンポーネント本体の二重呼び出し          | あり                      | あり                              | 変更なし           |
| `useEffect` の setup→cleanup→setup            | あり                      | あり                              | 変更なし           |
| `useLayoutEffect` の setup→cleanup→setup      | あり                      | あり                              | 変更なし           |
| `useState` initializer の二重呼び出し         | あり (途中で抜けたが復活) | あり                              | 復活/修正 (#28248) |
| `useReducer` initializer の二重呼び出し       | あり (同上)               | あり                              | 復活/修正 (#28248) |
| `useMemo` factory の二重実行                  | あり                      | あり                              | **継続**           |
| `useMemo` 結果の扱い                          | 2 回目も計算              | 2 回目は **1 回目の結果を再利用** | **改良** (#25583)  |
| `useCallback` factory の二重実行              | あり                      | あり                              | **継続**           |
| `useCallback` 結果の扱い                      | 2 回目も新規生成          | 2 回目は **1 回目の結果を再利用** | **改良** (#25583)  |
| ref callback の初回マウント double invoke     | なし                      | **あり (新規)**                   | **新規**           |
| ref の attach/detach/attach in StrictMode     | 一部不完全                | 完全動作                          | 修正 (#25049)      |
| `useSyncExternalStore` ハイドレーション       | バグあり                  | 修正                              | 修正 (#26791)      |
| `useId` in StrictMode                         | バグあり                  | 修正                              | 修正 (#25713)      |
| `componentWillUnmount` 発火                   | 一部抜け                  | 常時発火                          | 修正 (#26842)      |
| StrictMode エラーメッセージにコンポーネント名 | なし                      | あり                              | 改良 (#25718)      |
| ハイドレーション時の Effect double invoke     | なし                      | あり (19.2 系で追加)              | 強化 (#35961)      |
| 本番ビルドへの影響                            | なし                      | なし                              | 変更なし           |

---

## 「React 19 で useEffect の二重実行が解消された」という主張への反論

LinkedIn ([Rajendra Sharma の投稿](https://www.linkedin.com/posts/rajendra-sharma-12b661237_reactjs-react19-javascript-activity-7305099592507826176-T6ry)) や一部の Medium 記事で **「React 19 では useEffect が一度しか走らなくなった」** という主張が流通していますが、これは **誤情報** です。根拠:

1. React 19 Upgrade Guide が "When **double rendering** in Strict Mode in development..." と現在形で書いている → 二重レンダリングは存続している前提
2. CHANGELOG に "useEffect が 1 回だけ走るようになった" という記述は **存在しない**
3. facebook/react のソース上、`doubleInvokeEffectsOnFiber` 関数は React 19 でも生存している (DeepWiki 確認済)
4. 実際の dev.to の検証記事 [Why is useEffect Running Twice? The Complete Guide to React 19](https://dev.to/pockit_tools/why-is-useeffect-running-twice-the-complete-guide-to-react-19-strict-mode-and-effect-cleanup-1n60) は逆に「React 19 でも二重実行は続いている」と詳細に検証している
5. GitHub Issue [#29585](https://github.com/facebook/react/issues/29585) は React 19 で StrictMode 起因の effect 過剰実行が **増えた** ケースを報告している (= 仕組みは健在)

公式一次資料 vs LinkedIn の二次資料が衝突する場合、**公式が正**。

確信度: **高 (反証材料が一次資料 3 件以上)**

---

## next-play プロジェクト (Next.js 16 + React 19) への実践的推奨事項

1. **Strict Mode は外さない** — 外すと React 19 / Next.js 16 が想定する将来の機能 (Activity 等) との互換性チェックを失う。`next.config.js` でも `reactStrictMode: true` (デフォルト) を維持するべき。

2. **`useEffect` には必ず cleanup を書く** — 二重実行で壊れる場合は cleanup の漏れがある可能性が高い。例:

   ```typescript
   useEffect(() => {
     const controller = new AbortController()
     fetch(`/api/data`, { signal: controller.signal }).then(/* ... */)
     return () => controller.abort() // 必須
   }, [])
   ```

3. **`useMemo` / `useCallback` の factory に副作用を書かない** — React 19 では結果は 1 回目を再利用するが、factory 関数自体は **2 回呼ばれる**。副作用 (DOM 操作、ログ送信等) を書くと開発時に 2 回走る。

4. **ref callback には cleanup 関数を返す (React 19 新機能)**:

   ```typescript
   <input
     ref={(node) => {
       node?.focus()
       return () => {
         // クリーンアップ
       }
     }}
   />
   ```

5. **開発時にログが 2 重になるのは仕様** — Chrome DevTools 拡張の React DevTools には「Hide logs during second render in Strict Mode」オプションがあるので、必要なら有効化を検討。

6. **本番ビルドの挙動を疑った時は `next build && next start` で確認** — `pnpm build && pnpm start` (このプロジェクトはポート 3458) で本番モードを再現すると、Strict Mode のチェックは完全に外れる。

---

## 一次資料 (信頼度: 高、tier 1)

1. [React 公式 `<StrictMode>` リファレンス](https://react.dev/reference/react/StrictMode)
2. [React 19 Upgrade Guide (公式ブログ)](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
3. [React v19 リリースブログ](https://react.dev/blog/2024/12/05/react-19)
4. [facebook/react CHANGELOG.md](https://github.com/facebook/react/blob/main/CHANGELOG.md)
5. [PR #25049: Refs are now attached/detached/attached in StrictMode](https://github.com/facebook/react/pull/25049)
6. [PR #25583: Reuse memoized result from first pass (useMemo/useCallback)](https://github.com/facebook/react/pull/25583)
7. [PR #28248: Restore double invoking useState() and useReducer() initializer functions](https://github.com/facebook/react/pull/28248)
8. [Commit #35961: [Fiber] Double invoke Effects in Strict Mode during Hydration (2026-04-17)](https://github.com/facebook/react/commit/67e47593b607ecc08ac59361d8aba7ad2eef028a)
9. [Issue #29585: React 19 runs extra effects when elements are reordered](https://github.com/facebook/react/issues/29585)
10. [Next.js 公式: reactStrictMode 設定](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode)
11. [Legacy React Strict Mode ドキュメント (React 18 当時の経緯)](https://legacy.reactjs.org/docs/strict-mode.html)

## 補助資料 (信頼度: 中)

12. [DeepWiki: facebook/react ソースコード解析結果](https://deepwiki.com/facebook/react)
13. [dev.to: Why is useEffect Running Twice? The Complete Guide to React 19](https://dev.to/pockit_tools/why-is-useeffect-running-twice-the-complete-guide-to-react-19-strict-mode-and-effect-cleanup-1n60)

## 誤情報を含む参考 (反証用)

14. [LinkedIn: React 19 fixes useEffect double execution in Strict Mode](https://www.linkedin.com/posts/rajendra-sharma-12b661237_reactjs-react19-javascript-activity-7305099592507826176-T6ry) — **公式ドキュメントと矛盾するため誤り**

---

## 確信度サマリ

| 主張                                                                    | 確信度 | 一次資料数           |
| ----------------------------------------------------------------------- | ------ | -------------------- |
| React 19 でも関数コンポーネントは 2 回呼ばれる                          | 高     | 3+                   |
| React 19 でも Effect は mount→unmount→remount される                    | 高     | 3+                   |
| React 19 で useMemo/useCallback の結果は 1 回目を再利用                 | 高     | 2+                   |
| React 19 で ref callback が初回マウント時に double invoke される        | 高     | 2+                   |
| Next.js 16 App Router は Strict Mode をデフォルトで有効化               | 高     | 1 (公式ドキュメント) |
| 「React 19 で useEffect が 1 回しか走らない」という LinkedIn 主張は誤り | 高     | 3+ の反証            |

---

## 最後に — ユーザーの問いへの直接的回答 (日本語)

質問: 「React v19 では Strict Mode の 2 重 render が解消されているのか?」

**回答: 解消されていません。**

- コンポーネントの二重レンダリングは React 19 でも継続
- Effect の二重実行 (mount→unmount→remount) も React 19 でも継続
- React 19 で行われたのは **既存の挙動の改良 (useMemo/useCallback 結果の再利用、ref callback の double invoke 追加など)** であり、廃止ではありません
- これは React チームの一貫した方針 (将来の Activity / Offscreen API への耐性、effect cleanup の習慣付け) に基づいています
- Next.js 16 (App Router) ではデフォルトで Strict Mode が有効なので、next-play プロジェクトでもこの挙動は発生します
- 本番ビルドには影響しないので、開発時の挙動として許容するのが推奨される対処です
