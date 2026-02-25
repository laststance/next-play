// Vitest Global Setup
// Runs once before all tests execute

// Set up environment
process.env.NODE_ENV = 'test'

// Global test utilities
declare global {
  var testSetupTime: number
}

// Record setup time for performance monitoring
globalThis.testSetupTime = Date.now()

console.log('🧪 Vitest Global Setup initialized')

// Teardown hook (optional)
export function teardown() {
  const duration = Date.now() - globalThis.testSetupTime
  console.log(`✅ Tests completed in ${duration}ms`)
}
