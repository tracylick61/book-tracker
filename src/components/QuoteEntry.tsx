import type { Book, Quote } from '../types/book'
import { readingDate } from '../lib/readingFormat'

interface Props { quote: Quote; book?: Book; onDelete?: () => void }
export function QuoteEntry({ quote, book, onDelete }: Props) {
  return <article className="diary-quote">
    <blockquote>«{quote.text}»</blockquote>
    {book && <a className="diary-quote-source" href={`/book/${book.id}`}>
      <span><strong>{book.title}</strong><span>{book.author}</span></span><span className="quote-open-book">Открыть книгу →</span>
    </a>}
    <footer>
      <div className="quote-metadata">{quote.page !== undefined && <span>Стр. {quote.page}</span>}<time dateTime={quote.createdAt}>{readingDate(quote.createdAt)}</time></div>
      {onDelete && <button className="text-button" onClick={onDelete} aria-label={`Удалить цитату: ${quote.text}`}>Удалить цитату</button>}
    </footer>
  </article>
}
