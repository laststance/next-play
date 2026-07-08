import { codeInspectorPlugin } from 'code-inspector-plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
      // Inline client code to avoid brittle pnpm versioned import paths after upgrades.
      importClient: 'code',
      hotKeys: ['altKey'],
    }),
  },
}

export default nextConfig
