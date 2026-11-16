import type { Book } from '../types/book'

/** Read books with a known length always end on the final page.
 * Other statuses retain the reader's progress, including when reopening a book.
 */
export function normalizeBookProgress(book: Book): Book {
  if (book.status === 'read' && book.totalPages !== undefined && book.totalPages > 0) {
    return { ...book, currentPage: book.totalPages }
  }
  return book
}
