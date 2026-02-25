import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn() utility function', () => {
  it('should merge class names with clsx', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-2', false && 'py-1', 'rounded')).toBe('px-2 rounded')
  })

  it('should resolve Tailwind conflicts with twMerge', () => {
    // When two conflicting Tailwind utilities are passed, twMerge keeps the last one
    expect(cn('px-2 px-4')).toBe('px-4')
  })

  it('should merge complex Tailwind classes correctly', () => {
    const result = cn(
      'px-2 py-1 rounded',
      'px-4', // This should override px-2
      'bg-white dark:bg-slate-900',
    )
    expect(result).toContain('px-4')
    expect(result).toContain('py-1')
    expect(result).toContain('rounded')
    expect(result).toContain('bg-white')
  })

  it('should handle array inputs (from clsx)', () => {
    expect(cn(['px-2', 'py-1'])).toContain('px-2')
    expect(cn(['px-2', 'py-1'])).toContain('py-1')
  })

  it('should handle object inputs (from clsx conditional)', () => {
    expect(cn({ 'px-2': true, 'py-1': false })).toBe('px-2')
  })

  it('should handle undefined and null gracefully', () => {
    expect(cn('px-2', undefined, null, 'py-1')).toBe('px-2 py-1')
  })

  it('should be idempotent with multiple calls', () => {
    const input = 'px-2 py-1 rounded'
    const result1 = cn(input)
    const result2 = cn(input)
    expect(result1).toBe(result2)
  })

  it('should work with complex shadcn/ui component scenarios', () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md'
    const sizeVariant = 'h-10 px-4 py-2'
    const stateClasses = 'disabled:opacity-50 disabled:cursor-not-allowed'

    const result = cn(baseClasses, sizeVariant, stateClasses)
    expect(result).toContain('inline-flex')
    expect(result).toContain('h-10')
    expect(result).toContain('disabled:opacity-50')
  })
})
