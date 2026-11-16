import type { BookStatus } from '../types/book'

const labels: Record<BookStatus, string> = { reading: 'Читаю', read: 'Прочитано', 'want-to-read': 'Хочу прочитать' }

export function StatusBadge({ status }: { status: BookStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>
}
