import { useMemo, useState } from 'react'
import type { Book, BookStatus } from '../types/book'
import { BookCard } from '../components/BookCard'

type Filter = 'all' | BookStatus
const filters: { value: Filter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'reading', label: 'Reading' }, { value: 'read', label: 'Read' }, { value: 'want-to-read', label: 'Want to read' }]

export function Library({ books, onAdd }: { books: Book[]; onAdd: () => void }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return books.filter((book) => (filter === 'all' || book.status === filter) && (!search || `${book.title} ${book.author}`.toLocaleLowerCase().includes(search)))
  }, [books, filter, query])
  return (
    <div className="page library-page">
      <header className="library-header"><div><p className="eyebrow">The collection</p><h1>My Library</h1><p>All the books you want to remember.</p></div><button className="primary-button" onClick={onAdd}>+ Add book</button></header>
      <div className="library-tools">
        <div className="filters" aria-label="Filter books">{filters.map((item) => <button key={item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'all' ? books.length : books.filter((book) => book.status === item.value).length}</span></button>)}</div>
        <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or author" aria-label="Search title or author" /></label>
      </div>
      <p className="result-count">{visible.length} {visible.length === 1 ? 'book' : 'books'}</p>
      {visible.length ? <div className="library-grid">{visible.map((book) => <BookCard key={book.id} book={book} />)}</div> : <div className="empty-state"><h2>No books found</h2><p>Try another search or choose a different shelf.</p></div>}
    </div>
  )
}
