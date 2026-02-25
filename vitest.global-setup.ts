/**
 * Vitest Global Setup
 * Runs once before all test workers are created.
 * Teardown runs after all test files finish (or on watch exit).
 *
 * @see https://vitest.dev/config/global-setup
 */

const startTime = Date.now()

/**
 * Setup runs once before any test workers are created.
 * Note: Variables defined here are NOT available in tests (different scope).
 * Use project.provide() for serializable data.
 */
export function setup(): void {
  console.log('🧪 Vitest Global Setup initialized')
}

/**
 * Teardown runs after all tests complete (or when process exits in watch mode).
 * Logs total test run duration for performance monitoring.
 */
export function teardown(): void {
  const duration = Date.now() - startTime
  console.log(`✅ Tests completed in ${duration}ms`)
}
