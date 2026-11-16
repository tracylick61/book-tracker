import type { Book } from '../types/book'
import { BookCover } from './BookCover'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card"><a className="book-card-link" href={`/book/${book.id}`}>
      <BookCover src={book.cover} title={book.title} />
      <div className="book-card-meta">
        <StatusBadge status={book.status} />
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        {book.status === 'reading' && <div className="card-reading-progress"><ProgressBar value={book.totalPages ? (book.currentPage ?? 0) / book.totalPages * 100 : 0} /><span>{book.currentPage ?? 0} из {book.totalPages ?? '—'} стр.</span></div>}
        {book.status === 'read' && book.rating && <div className="rating" aria-label={`Оценка: ${book.rating} из 5`}>{'★'.repeat(book.rating)}<span>{'★'.repeat(5 - book.rating)}</span></div>}
      </div>
    </a></article>
  )
}
