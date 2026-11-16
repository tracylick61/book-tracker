import { useRef, useState, type FormEvent } from 'react'
import { useDialog } from '../hooks/useDialog'
import { useBookSearch } from '../hooks/useBookSearch'
import type { Book, NewBook } from '../types/book'
import type { BookSearchResult } from '../api/openLibrary'
import { publicationLabels } from '../lib/catalogueMetadata'
import { BookCover } from './BookCover'
import { BookForm } from './BookForm'
import './book-search.css'

interface Props { open: boolean; onClose: () => void; onAdd: (book: NewBook) => boolean | void; book?: Book; books?: Book[] }
function CatalogueDetails({ result, showYear = true }: { result: BookSearchResult; showYear?: boolean }) {
  const metadata = [showYear && result.year ? `${result.year} г.` : '', result.publisher, result.totalPages ? `${result.totalPages} стр.` : ''].filter(Boolean)
  return <><strong>{result.title}</strong>{result.author && <span className="catalogue-author">{result.author}</span>}{metadata.length > 0 && <span className="catalogue-meta">{metadata.join(' · ')}</span>}</>
}
export function AddBookModal({ open, onClose, onAdd, book, books = [] }: Props) {
  const [mode, setMode] = useState<'search' | 'confirm' | 'manual'>(book ? 'manual' : 'search')
  const [selected, setSelected] = useState<BookSearchResult | null>(null)
  const search = useBookSearch(open && mode === 'search' && !book)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef(new Map<string, HTMLButtonElement>())
  useDialog(open, onClose)
  if (!open) return null
  const backToSearch = () => { setMode('search'); requestAnimationFrame(() => ((selected && resultRefs.current.get(selected.id)) || inputRef.current)?.focus()) }
  const choose = (result: BookSearchResult) => { setSelected(result); setMode('confirm') }
  const submitSearch = (event: FormEvent) => { event.preventDefault(); search.searchNow() }
  const title = book ? 'Редактировать книгу' : mode === 'confirm' ? 'Добавить в библиотеку' : mode === 'manual' ? 'Добавить вручную' : 'Добавить книгу'
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className={`modal book-search-modal mode-${mode}`} role="dialog" aria-modal="true" aria-labelledby="add-title">
      <div className="modal-heading"><div><p className="eyebrow">{book ? 'Дневник чтения' : 'Новая история на вашей полке'}</p><h2 id="add-title">{title}</h2></div><button className="close-button" onClick={onClose} aria-label="Закрыть окно">×</button></div>
      {mode === 'search' ? <>
        <p className="catalogue-intro">Найдите книгу по названию, автору или ISBN.</p>
        <form className="catalogue-search" onSubmit={submitSearch}><label htmlFor="catalogue-query">Название, автор или ISBN</label><div><input ref={inputRef} autoFocus id="catalogue-query" type="search" autoComplete="off" value={search.query} onChange={e => search.setQuery(e.target.value)} aria-describedby="catalogue-hint" /><button className="secondary-button" disabled={search.query.trim().length < 3}>Найти</button></div><p id="catalogue-hint" className="entry-hint">Введите не менее 3 символов. Поиск по каталогу Open Library.</p></form>
        <div className="catalogue-results" aria-busy={search.view.status === 'loading'}>
          <p className="catalogue-status" role="status" aria-live="polite">{search.view.status === 'initial' ? 'Здесь появятся книги из каталога.' : search.view.status === 'waiting' ? 'Готовим поиск…' : search.view.status === 'loading' ? 'Ищем книги…' : search.view.status === 'results' ? `Найдено: ${search.view.books.length}. Выберите книгу.` : ''}</p>
          {search.view.status === 'empty' && <div className="catalogue-empty"><h3>Ничего не нашли</h3><p>Попробуйте изменить запрос или добавьте книгу вручную.</p><button className="secondary-button" onClick={() => setMode('manual')}>Добавить вручную</button></div>}
          {search.view.status === 'error' && <div className="catalogue-empty" role="alert"><p>Не удалось загрузить каталог. Попробуйте ещё раз или добавьте книгу вручную.</p><button className="secondary-button" onClick={search.searchNow}>Попробовать ещё раз</button></div>}
          {search.view.status === 'results' && <ul>{search.view.books.map(result => <li key={result.id}><button ref={element => { if (element) resultRefs.current.set(result.id, element); else resultRefs.current.delete(result.id) }} className="catalogue-result" onClick={() => choose(result)} aria-label={`Выбрать книгу «${result.title}»${result.author ? ` — ${result.author}` : ''}`}><BookCover src={result.cover} title={result.title} /><span className="catalogue-result-copy"><CatalogueDetails result={result} /></span><span aria-hidden="true">→</span></button></li>)}</ul>}
        </div>
        <footer className="catalogue-footer"><span>Не нашли книгу?</span><button className="text-button" onClick={() => setMode('manual')}>Добавить книгу вручную</button></footer>
      </> : <>
        {!book && <button className="link-button catalogue-back" onClick={backToSearch}>{mode === 'confirm' ? '← Назад к результатам' : '← Вернуться к поиску'}</button>}
        {mode === 'confirm' && selected && <div className="catalogue-confirm"><BookCover src={selected.cover} title={selected.title} /><div><CatalogueDetails result={selected} showYear={false} />{publicationLabels(selected).map(label => <p key={label} className="catalogue-meta">{label}</p>)}{selected.isbn && <p className="catalogue-meta">ISBN: {selected.isbn}</p>}</div></div>}
        <BookForm key={mode === 'confirm' ? selected?.id : book?.id ?? 'manual'} book={book} selected={mode === 'confirm' ? selected ?? undefined : undefined} books={books} onSave={onAdd} onDone={onClose} onCancel={onClose} />
      </>}
    </section>
  </div>
}
