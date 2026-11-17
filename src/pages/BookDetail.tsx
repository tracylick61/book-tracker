import { useCallback, useState, type FormEvent } from 'react'
import type { Book } from '../types/book'
import type { useLibrary } from '../hooks/useLibrary'
import { DeleteConfirmation } from '../components/DeleteConfirmation'
import { BookCover } from '../components/BookCover'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { AddBookModal } from '../components/AddBookModal'
import { BookNotes } from '../components/BookNotes'
import { BookQuotes } from '../components/BookQuotes'
import { readingDate } from '../lib/readingFormat'
import '../journal.css'

type Props = { book: Book; library: ReturnType<typeof useLibrary>; onNavigate: (path: string) => void }
export function BookDetail({ book, library, onNavigate }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pageDraft, setPage] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const page = pageDraft ?? String(book.currentPage ?? 0)
  const closeDelete = useCallback(() => setDeleting(false), [])
  const percent = book.status === 'read' ? 100 : book.totalPages ? Math.round((book.currentPage ?? 0) / book.totalPages * 100) : 0
  const validPage = page.trim() !== '' && Number.isInteger(Number(page)) && Number(page) >= 0 && (book.totalPages === undefined || Number(page) <= book.totalPages)
  const updateProgress = (event: FormEvent) => {
    event.preventDefault()
    if (validPage) { library.updateProgress(book.id, Number(page)); setPage(null); setMessage('Прогресс сохранён.') }
  }
  const changeStatus = (status: Book['status']) => { library.updateBook(book.id, { status }); setPage(null); setMessage('Статус сохранён.') }
  return <div className="page book-page journal-page">
    <a className="back-link" href="/library">← В библиотеку</a>
    <section className="book-introduction" aria-labelledby="book-title">
      <div className="journal-cover"><BookCover src={book.cover} title={book.title} /><p>{book.totalPages ? `${book.totalPages} стр.` : 'Количество страниц не указано'}</p></div>
      <div className="journal-book-info"><p className="eyebrow">Ваша личная история чтения</p><StatusBadge status={book.status} /><h1 id="book-title">{book.title}</h1><p className="journal-author">{book.author}</p>
        <div className="journal-rating"><span aria-label={book.rating ? `Оценка: ${book.rating} из 5` : 'Без оценки'} className={book.rating ? 'rated' : ''}>{book.rating ? <><span aria-hidden="true">{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</span><span className="rating-description">{book.rating} из 5 · ваша оценка</span></> : 'Пока без оценки'}</span></div>
        <div className={`book-reading-state is-${book.status}`}>
          <div className="reading-state-heading"><h2>{book.status === 'read' ? 'Книга прочитана' : book.status === 'reading' ? 'Ваш прогресс' : 'В планах на чтение'}</h2>{(book.status === 'read' || (book.status === 'reading' && book.totalPages !== undefined)) && <strong>{percent}%</strong>}</div>
          {book.status === 'want-to-read' ? <><p>У этой истории всё ещё впереди. Начните, когда придёт её время.</p><button className="primary-button" onClick={() => changeStatus('reading')}>Начать чтение <span aria-hidden="true">→</span></button></> : <>
            {(book.totalPages !== undefined || book.currentPage !== undefined) && <p className="journal-page-count">{book.totalPages ? `${book.currentPage ?? 0} из ${book.totalPages} стр.` : `${book.currentPage} стр. прочитано`}</p>}{book.totalPages ? <ProgressBar value={percent} /> : <p className="diary-help">Количество страниц не указано</p>}
            {book.status === 'reading' && <form className="journal-progress-form" onSubmit={updateProgress}><label htmlFor="current-page">Текущая страница<input id="current-page" type="number" min="0" step="1" max={book.totalPages} value={page} onChange={event => setPage(event.target.value)} aria-invalid={!validPage} aria-describedby={!validPage ? 'page-error' : undefined} /></label><button className="primary-button" disabled={!validPage || Number(page) === (book.currentPage ?? 0)}>Обновить прогресс</button>{!validPage && <p id="page-error" className="form-error">Укажите целое число от 0 до {book.totalPages ?? 'последней страницы'}.</p>}</form>}
            {book.status === 'reading' && book.totalPages !== undefined && book.currentPage === book.totalPages && <div className="journal-completion"><p>Последняя страница позади. Отметим книгу прочитанной?</p><button className="secondary-button" onClick={() => changeStatus('read')}>Отметить прочитанной</button></div>}
          </>}
        </div>
        {(book.startedAt || book.finishedAt || book.status === 'read') && <dl className="journal-dates">{book.startedAt && <div><dt>Начало чтения</dt><dd><time dateTime={book.startedAt}>{readingDate(book.startedAt)}</time></dd></div>}{book.status === 'read' && <div><dt>Прочитано</dt><dd>{book.finishedAt ? <time dateTime={book.finishedAt}>{readingDate(book.finishedAt)}</time> : 'Дата не указана'}</dd></div>}</dl>}
        <div className="journal-book-actions"><button className="secondary-button" onClick={() => setEditing(true)}>Редактировать книгу</button><label>Статус<select aria-label="Статус" value={book.status} onChange={event => changeStatus(event.target.value as Book['status'])}><option value="want-to-read">Хочу прочитать</option><option value="reading">Читаю</option><option value="read">Прочитано</option></select></label></div>
      </div>
    </section>
    <p className="journal-save-status" role="status" aria-live="polite">{message}</p>
    <div className="book-diary"><header className="book-diary-heading"><p className="eyebrow">Между страницами</p><h2>Читательский дневник</h2><p>Не только о том, что прочитано. О том, что осталось с вами.</p></header>
      <BookNotes notes={book.notes ?? ''} onSave={notes => { library.saveNotes(book.id, notes); setMessage(notes.trim() ? 'Заметка сохранена.' : 'Заметка удалена.') }} />
      <div className="diary-section-break" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 7C10 4 6 4 3 5v17c4-1 7-1 11 2 4-3 7-3 11-2V5c-3-1-7-1-11 2Zm0 0v17" /></svg></div>
      <BookQuotes quotes={book.quotes ?? []} totalPages={book.totalPages} onAdd={quote => { library.addQuote(book.id, quote); setMessage('Цитата сохранена.') }} onDelete={id => { library.deleteQuote(book.id, id); setMessage('Цитата удалена.') }} />
    </div>
    <footer className="journal-book-footer"><button className="text-button" onClick={() => setDeleting(true)}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>Удалить книгу</button><p>Книга будет удалена из вашей библиотеки вместе со всеми заметками и цитатами.</p></footer>
    {editing && <AddBookModal book={book} books={library.books} open onClose={() => setEditing(false)} onAdd={changes => { library.updateBook(book.id, changes); setPage(null); setMessage('Изменения сохранены.') }} />}
    {deleting && <DeleteConfirmation title="Удалить книгу?" eyebrow="Ваша библиотека" description={`Книга «${book.title}», её заметки и цитаты будут удалены. Это действие нельзя отменить.`} keepLabel="Оставить книгу" deleteLabel="Удалить книгу" onCancel={closeDelete} onConfirm={() => { library.deleteBook(book.id); onNavigate('/library') }} />}
  </div>
}
