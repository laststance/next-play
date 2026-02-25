/**
 * Vitest Setup Files
 * Runs before each test file (same process as tests).
 * Exports are ignored by Vitest — use for side effects only.
 *
 * @see https://vitest.dev/config/setupfiles
 */

// Set up environment for test execution (cast needed for @types/node readonly)
;(process.env as Record<string, string>).NODE_ENV = 'test'
