/**
 * Format a Date as YYYY-MM-DD using the local timezone.
 * Avoids the UTC shift caused by Date.toISOString().
 */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
