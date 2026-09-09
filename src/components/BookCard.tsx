import type { Book } from '../types/book'
import { BookCover } from './BookCover'
import { StatusBadge } from './StatusBadge'

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <BookCover src={book.cover} title={book.title} />
      <div className="book-card-meta">
        <StatusBadge status={book.status} />
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        {book.status === 'read' && book.rating && <div className="rating" aria-label={`${book.rating} out of 5 stars`}>{'★'.repeat(book.rating)}<span>{'★'.repeat(5 - book.rating)}</span></div>}
      </div>
    </article>
  )
}
