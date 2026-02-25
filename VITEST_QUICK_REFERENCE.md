# Vitest Global Setup - Quick Reference Card

## Installation & Commands

```bash
# Already installed ✓
pnpm install

# Run Tests
pnpm test              # Watch mode (default)
pnpm test:ui           # Interactive dashboard
pnpm test:coverage     # Coverage report

# Single test file
pnpm test lib/utils.test.ts
```

## Files Created

| File                       | Purpose         | Status         |
| -------------------------- | --------------- | -------------- |
| `vitest.config.ts`         | Main config     | ✅             |
| `vitest.setup.ts`          | Global setup    | ✅             |
| `lib/utils.test.ts`        | Test suite      | ✅ 9/9 passing |
| `VITEST_SETUP.md`          | Complete guide  | ✅             |
| `MCP_TESTING_WORKFLOWS.md` | MCP integration | ✅             |
| `package.json`             | Updated scripts | ✅             |

## Global Configuration Features

```typescript
// Available globally (no imports needed)
describe('Suite', () => {
  it('test', () => {
    expect(true).toBe(true)
  })
})
```

## Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from './my-function'

describe('myFunction', () => {
  it('should work', () => {
    expect(myFunction()).toBeDefined()
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('default')
  })
})
```

## Setup & Teardown

```typescript
describe('with setup', () => {
  beforeEach(() => {
    // Runs before each test
  })

  afterEach(() => {
    // Runs after each test
  })

  it('test', () => {
    // Uses setup/teardown
  })
})
```

## MCP Server Integration

### Use Serena to Find Code

```bash
# Find functions needing tests
serena find_symbol --pattern="export function"

# Find references
serena find_referencing_symbols --name_path="lib/utils/cn"
```

### Use Sequential-Thinking for Complex Tests

Ask: "Break down the test structure for [complex scenario]"

### Use Context7 for Documentation

```bash
context7 query-docs --library="vitest" --query="global setup"
```

### Use Exa for Research

```bash
# Research best practices
exa web_search_exa --query="Vitest global setup patterns"
```

## Common Patterns

### Test Utilities

```typescript
expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
```

### Test Conditionals

```typescript
const result = cn('px-2', isActive && 'bg-blue', 'rounded')
expect(result).toContain('rounded')
```

### Test Arrays

```typescript
expect(cn(['px-2', 'py-1'])).toContain('px-2')
```

### Test Objects

```typescript
expect(cn({ 'px-2': true, 'py-1': false })).toBe('px-2')
```

## Debugging Tests

```typescript
it('debug test', () => {
  console.log('Debug info')
  expect(value).toBeDefined()
})

// Run with logging
pnpm test
```

## Watch Mode Tips

- Press `?` in watch mode for help
- Press `c` to clear the screen
- Press `q` to quit
- Press `p` to filter by filename pattern
- Press `t` to filter by test name

## Dashboard (pnpm test:ui)

- URL: `http://localhost:51204/__vitest__/`
- Real-time test status
- Code coverage visualization
- Error details and stack traces
- Test filtering and search

## Coverage Report

```bash
pnpm test:coverage
# Generates: coverage/index.html
# Open in browser to explore
```

## Path Aliases

```typescript
// All of these work
import { cn } from '@/lib/utils'
import { cn } from '../lib/utils'
```

## Environment Setup

```typescript
// Available in vitest.setup.ts
process.env.NODE_ENV === 'test' // ✓ True
```

## Test Options

```typescript
// Skip test
it.skip('skipped', () => {})

// Only run this test
it.only('focus', () => {})

// Async test
it('async', async () => {
  const result = await asyncFn()
  expect(result).toBeDefined()
})

// With timeout
it(
  'slow test',
  async () => {
    // ...
  },
  { timeout: 5000 },
)
```

## Troubleshooting

| Issue              | Solution                                   |
| ------------------ | ------------------------------------------ |
| Tests not running  | Check `.test.ts` or `.spec.ts` filename    |
| Module not found   | Run `pnpm install`                         |
| Port 51204 in use  | Kill with `npx kill-port 51204`            |
| Tests not updating | Clear cache: `rm -rf node_modules/.vitest` |

## Resources

- [Vitest Docs](https://vitest.dev)
- [Happy DOM](https://github.com/capricorn86/happy-dom)
- [Global Setup](https://vitest.dev/config/global-setup)
- [VITEST_SETUP.md](./VITEST_SETUP.md) - Full guide
- [MCP_TESTING_WORKFLOWS.md](./MCP_TESTING_WORKFLOWS.md) - MCP integration

---

**Setup Date:** February 25, 2026
**Status:** ✅ Production Ready
**Tests:** 9/9 passing
