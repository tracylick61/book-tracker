import { useState, type FormEvent } from 'react'
import type { Book } from '../types/book'
import type { useLibrary } from '../hooks/useLibrary'
import { useDialog } from '../hooks/useDialog'
import { BookCover } from '../components/BookCover'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { AddBookModal } from '../components/AddBookModal'

type Props = { book: Book; library: ReturnType<typeof useLibrary>; onNavigate: (path: string) => void }
const date = (value: string) => new Date(value).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
export function BookDetail({ book, library, onNavigate }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pageDraft, setPage] = useState<string | null>(null)
  const page = pageDraft ?? String(book.currentPage ?? 0)
  const [text, setText] = useState('')
  const [quotePage, setQuotePage] = useState('')
  const [notes, setNotes] = useState(book.notes ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const closeDelete = () => setDeleting(false)
  useDialog(deleting, closeDelete)
  const percent = book.totalPages ? Math.round((book.currentPage ?? 0) / book.totalPages * 100) : 0
  const validPage = page.trim() !== '' && Number.isInteger(Number(page)) && Number(page) >= 0 && (book.totalPages === undefined || Number(page) <= book.totalPages)
  const addQuote = (event: FormEvent) => {
    event.preventDefault()
    if (!text.trim() || (quotePage !== '' && (!Number.isInteger(Number(quotePage)) || Number(quotePage) < 1 || (book.totalPages !== undefined && Number(quotePage) > book.totalPages)))) { setError('Введите цитату и корректный номер страницы.'); return }
    library.addQuote(book.id, { text, page: quotePage === '' ? undefined : Number(quotePage) })
    setText(''); setQuotePage(''); setError('')
  }
  return <div className="page book-page">
    <a className="back-link" href="/library">← В библиотеку</a>
    <section className="book-hero"><BookCover src={book.cover} title={book.title} className="detail-cover" />
      <div className="book-heading"><p className="eyebrow">Дневник чтения</p><StatusBadge status={book.status} /><h1>{book.title}</h1><p className="detail-author">{book.author}</p>
        <p className="detail-rating" aria-label={book.rating ? `Оценка: ${book.rating} из 5` : 'Без оценки'}>{book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : 'Пока без оценки'}</p>
        <div className="progress-copy"><span>{book.currentPage ?? 0} из {book.totalPages ?? '—'} стр.</span><strong>{book.totalPages ? `${percent}%` : 'Количество страниц не указано'}</strong></div><ProgressBar value={percent} />
        <div className="reading-dates">{book.startedAt && <p>Начало: {date(book.startedAt)}</p>}{book.finishedAt && <p>Прочитано: {date(book.finishedAt)}</p>}</div>
        <div className="book-actions"><button className="primary-button" onClick={() => setEditing(true)}>Редактировать книгу</button><label className="status-control">Статус<select aria-label="Статус" value={book.status} onChange={e => { library.updateBook(book.id, { status: e.target.value as Book['status'] }); setPage(null); setMessage('Статус сохранён.') }}><option value="want-to-read">Хочу прочитать</option><option value="reading">Читаю</option><option value="read">Прочитано</option></select></label><button className="text-button" onClick={() => setDeleting(true)}>Удалить книгу</button></div>
        {book.status === 'reading' && <form className="progress-form" onSubmit={e => { e.preventDefault(); if (validPage) { library.updateProgress(book.id, Number(page)); setMessage('Прогресс сохранён.') } }}><label>Текущая страница<input type="number" min="0" step="1" max={book.totalPages} value={page} onChange={e => setPage(e.target.value)} /></label><button className="secondary-button" disabled={!validPage || Number(page) === (book.currentPage ?? 0)}>Обновить прогресс</button>{!validPage && <p className="form-error">Укажите целое число от 0 до {book.totalPages ?? 'последней страницы'}.</p>}</form>}
        {book.status === 'reading' && book.totalPages !== undefined && book.currentPage === book.totalPages && <div className="completion"><p>Последняя страница позади. Отметим книгу прочитанной?</p><button className="link-button" onClick={() => { library.updateBook(book.id, { status: 'read' }); setMessage('Книга прочитана! Оценку можно добавить при редактировании.') }}>Отметить прочитанной</button></div>}
        <p className="save-message" role="status">{message}</p>
      </div></section>
    <div className="journal-sections"><section><p className="eyebrow">Личные впечатления</p><h2>Заметки</h2><p className="muted">Что вы запомните об этой книге?</p><label className="sr-only" htmlFor="notes">Заметки</label><textarea id="notes" rows={9} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Впечатления и мысли, к которым хочется вернуться…" /><button className="secondary-button" disabled={notes === (book.notes ?? '')} onClick={() => { library.saveNotes(book.id, notes); setMessage('Заметка сохранена.') }}>Сохранить заметку</button></section>
      <section><p className="eyebrow">Строки на память</p><h2>Цитаты</h2>{!book.quotes?.length && <p className="quiet-empty">Пока без цитат. Сохраните строку, которая вам откликнулась.</p>}
        {(book.quotes ?? []).map(quote => <article className="journal-quote" key={quote.id}><blockquote>«{quote.text}»</blockquote><footer><span>{quote.page !== undefined ? `Стр. ${quote.page} · ` : ''}{date(quote.createdAt)}</span><button className="text-button" aria-label={`Удалить цитату: ${quote.text}`} onClick={() => library.deleteQuote(book.id, quote.id)}>Удалить цитату</button></footer></article>)}
        <form className="quote-form" onSubmit={addQuote}><label htmlFor="quote-text">Новая цитата</label><textarea id="quote-text" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Слова, которые хочется сохранить…" required /><label>Страница (необязательно)<input type="number" min="1" step="1" max={book.totalPages} value={quotePage} onChange={e => setQuotePage(e.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="secondary-button" disabled={!text.trim()}>Сохранить цитату</button></form>
      </section></div>
    {editing && <AddBookModal book={book} open onClose={() => setEditing(false)} onAdd={changes => { library.updateBook(book.id, changes); setPage(null); setMessage('Изменения сохранены.') }} />}
    {deleting && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeDelete()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><p className="eyebrow">Ваша библиотека</p><h2 id="delete-title">Удалить книгу?</h2><p>Книга «{book.title}», её заметки и цитаты будут удалены. Это действие нельзя отменить.</p><div className="form-actions"><button autoFocus className="secondary-button" onClick={closeDelete}>Оставить книгу</button><button className="primary-button" onClick={() => { library.deleteBook(book.id); onNavigate('/library') }}>Удалить книгу</button></div></section></div>}
  </div>
}
