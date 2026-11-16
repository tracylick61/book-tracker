import { useMemo, useState } from 'react'
import type { Book, BookStatus } from '../types/book'
import { BookCard } from '../components/BookCard'

type Filter = 'all' | BookStatus
const filters: { value: Filter; label: string }[] = [{ value: 'all', label: 'Все книги' }, { value: 'reading', label: 'Читаю' }, { value: 'want-to-read', label: 'Хочу прочитать' }, { value: 'read', label: 'Прочитано' }]
const bookCount = (n: number) => `${n} ${n % 100 >= 11 && n % 100 <= 19 ? 'книг' : n % 10 === 1 ? 'книга' : n % 10 >= 2 && n % 10 <= 4 ? 'книги' : 'книг'}`
export function Library({ books, onAdd }: { books: Book[]; onAdd: () => void }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => books.filter(book => (filter === 'all' || book.status === filter) && `${book.title} ${book.author}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [books, filter, query])
  const reset = () => { setQuery(''); setFilter('all') }
  return <div className="page library-page stage-one"><header className="reader-library-header"><div><p className="eyebrow">Личная коллекция</p><h1>Моя библиотека</h1><p>Прочитанное, любимое и всё, что ещё впереди.</p></div><span className="shelf-total">{bookCount(books.length)} на ваших полках</span></header>
    <div className="reader-library-tools"><label className="reader-search"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Название книги или автор" aria-label="Поиск по названию или автору" />{query && <button onClick={() => setQuery('')} aria-label="Очистить поиск">×</button>}</label><button className="secondary-button" onClick={onAdd}><span aria-hidden="true">＋</span>Добавить книгу</button></div>
    <div className="reader-filters" aria-label="Фильтр по статусу">{filters.map(item => <button key={item.value} aria-pressed={filter === item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'all' ? books.length : books.filter(book => book.status === item.value).length}</span></button>)}</div>
    <div className="reader-results"><p role="status" aria-live="polite">{bookCount(visible.length)}{query.trim() ? ` по запросу «${query.trim()}»` : ''}</p><span>{filter === 'all' ? 'Каждая книга — часть вашей истории' : filters.find(item => item.value === filter)?.label}</span></div>
    {visible.length ? <div className="library-grid">{visible.map(book => <BookCard key={book.id} book={book} />)}</div> : <div className="empty-state"><p className="eyebrow">Место для новых историй</p><h2>{books.length ? 'Книги не нашлись' : 'Всё начинается с одной книги'}</h2><p>{books.length ? 'Попробуйте другой запрос или выберите другую полку.' : 'Добавьте книгу, которую читаете сейчас, или сохраните планы на будущее.'}</p><button className="secondary-button" onClick={books.length ? reset : onAdd}>{books.length ? 'Сбросить поиск и фильтры' : 'Добавить первую книгу'}</button></div>}
  </div>
}
