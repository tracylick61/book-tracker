import type { BookStatus } from '../types/book'

const labels: Record<BookStatus, string> = { reading: 'Reading', read: 'Read', 'want-to-read': 'Want to read' }

export function StatusBadge({ status }: { status: BookStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>
}
