import { useState } from 'react'
import type { Book } from '../types/book'
import { QuoteEntry } from '../components/QuoteEntry'
import { quoteCount } from '../lib/readingFormat'
import '../journal.css'

export function Quotes({ books }: { books: Book[] }) {
  const [query, setQuery] = useState('')
  const quotes = books.flatMap(book => (book.quotes ?? []).map(quote => ({ book, quote }))).sort((a, b) => b.quote.createdAt.localeCompare(a.quote.createdAt))
  const visible = quotes.filter(({ book, quote }) => `${quote.text} ${book.title} ${book.author}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  return <div className="page quotes-page collection-page">
    <header className="collection-heading"><div><p className="eyebrow">Личная коллекция</p><h1>Цитаты</h1><p>Слова, которые остаются с вами после последней страницы.</p></div><p className="collection-total"><strong>{quotes.length}</strong><span>сохранено в цитатнике</span></p></header>
    <label className="collection-search"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg><input aria-label="Поиск цитаты, книги или автора" placeholder="Найти цитату, книгу или автора" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="Очистить поиск" onClick={() => setQuery('')}>×</button>}</label>
    <div className="collection-results"><p role="status" aria-live="polite">{quoteCount(visible.length)}{query.trim() && ` по запросу «${query.trim()}»`}</p><span>Сначала новые</span></div>
    {visible.length ? <div className="collection-quotes">{visible.map(({ book, quote }) => <QuoteEntry key={`${book.id}:${quote.id}`} quote={quote} book={book} />)}</div> : <div className="empty-state collection-empty"><p className="eyebrow">Строки на память</p><h2>{quotes.length ? 'Цитаты не найдены' : 'Начните свою коллекцию цитат'}</h2><p>{quotes.length ? 'Попробуйте другой текст, название или автора.' : 'Откройте книгу в библиотеке и сохраните первую цитату.'}</p>{quotes.length ? <button className="secondary-button" onClick={() => setQuery('')}>Сбросить поиск</button> : <a className="secondary-button collection-empty-cta" href="/library">Открыть библиотеку <span aria-hidden="true">→</span></a>}</div>}
  </div>
}
