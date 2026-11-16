import { useState, type FormEvent } from 'react'
import type { Book } from '../types/book'
import type { useLibrary } from '../hooks/useLibrary'
import { useDialog } from '../hooks/useDialog'
import { BookCover } from '../components/BookCover'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { AddBookModal } from '../components/AddBookModal'

type Props = { book: Book; library: ReturnType<typeof useLibrary>; onNavigate: (path: string) => void }
const date = (value: string) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
export function BookDetail({ book, library, onNavigate }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(String(book.currentPage ?? 0))
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
    if (!text.trim() || (quotePage !== '' && (!Number.isInteger(Number(quotePage)) || Number(quotePage) < 1 || (book.totalPages !== undefined && Number(quotePage) > book.totalPages)))) { setError('Enter a quote and a valid page number.'); return }
    library.addQuote(book.id, { text, page: quotePage === '' ? undefined : Number(quotePage) })
    setText(''); setQuotePage(''); setError('')
  }
  return <div className="page book-page">
    <a className="back-link" href="/library">← Back to Library</a>
    <section className="book-hero"><BookCover src={book.cover} title={book.title} className="detail-cover" />
      <div className="book-heading"><p className="eyebrow">Your reading journal</p><StatusBadge status={book.status} /><h1>{book.title}</h1><p className="detail-author">by {book.author}</p>
        <p className="detail-rating" aria-label={book.rating ? `${book.rating} out of 5 stars` : 'Not rated'}>{book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : 'Not rated yet'}</p>
        <div className="progress-copy"><span>{book.currentPage ?? 0} of {book.totalPages ?? '—'} pages</span><strong>{book.totalPages ? `${percent}%` : 'Total pages not set'}</strong></div><ProgressBar value={percent} />
        <div className="reading-dates">{book.startedAt && <p>Started {date(book.startedAt)}</p>}{book.finishedAt && <p>Finished {date(book.finishedAt)}</p>}</div>
        <div className="book-actions"><button className="primary-button" onClick={() => setEditing(true)}>Edit book</button><label className="status-control">Status<select aria-label="Status" value={book.status} onChange={e => { library.updateBook(book.id, { status: e.target.value as Book['status'] }); setMessage('Status saved.') }}><option value="want-to-read">Want to read</option><option value="reading">Reading</option><option value="read">Read</option></select></label><button className="text-button" onClick={() => setDeleting(true)}>Delete book</button></div>
        {book.status === 'reading' && <form className="progress-form" onSubmit={e => { e.preventDefault(); if (validPage) { library.updateProgress(book.id, Number(page)); setMessage('Progress saved.') } }}><label>Current page<input type="number" min="0" step="1" max={book.totalPages} value={page} onChange={e => setPage(e.target.value)} /></label><button className="secondary-button" disabled={!validPage || Number(page) === (book.currentPage ?? 0)}>Update progress</button>{!validPage && <p className="form-error">Enter a valid page number from 0 to {book.totalPages ?? 'the last page'}.</p>}</form>}
        {book.status === 'reading' && book.totalPages !== undefined && book.currentPage === book.totalPages && <div className="completion"><p>You’ve reached the final page. Ready to close this chapter?</p><button className="link-button" onClick={() => { library.updateBook(book.id, { status: 'read' }); setMessage('Marked as read. Add a rating with Edit book.') }}>Mark as read</button></div>}
        <p className="save-message" role="status">{message}</p>
      </div></section>
    <div className="journal-sections"><section><p className="eyebrow">In your own words</p><h2>Notes</h2><p className="muted">What will you remember about this book?</p><label className="sr-only" htmlFor="notes">Notes</label><textarea id="notes" rows={9} value={notes} onChange={e => setNotes(e.target.value)} placeholder="An impression, a thought, a little something to return to…" /><button className="secondary-button" disabled={notes === (book.notes ?? '')} onClick={() => { library.saveNotes(book.id, notes); setMessage('Notes saved.') }}>Save notes</button></section>
      <section><p className="eyebrow">Words to keep</p><h2>Quotes</h2>{!book.quotes?.length && <p className="quiet-empty">No quotes yet. Keep a line that speaks to you.</p>}
        {(book.quotes ?? []).map(quote => <article className="journal-quote" key={quote.id}><blockquote>“{quote.text}”</blockquote><footer><span>{quote.page !== undefined ? `Page ${quote.page} · ` : ''}{date(quote.createdAt)}</span><button className="text-button" aria-label={`Delete quote: ${quote.text}`} onClick={() => library.deleteQuote(book.id, quote.id)}>Delete quote</button></footer></article>)}
        <form className="quote-form" onSubmit={addQuote}><label htmlFor="quote-text">New quote</label><textarea id="quote-text" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="The words you want to keep…" required /><label>Page (optional)<input type="number" min="1" step="1" max={book.totalPages} value={quotePage} onChange={e => setQuotePage(e.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="secondary-button" disabled={!text.trim()}>Add quote</button></form>
      </section></div>
    {editing && <AddBookModal book={book} open onClose={() => setEditing(false)} onAdd={changes => { library.updateBook(book.id, changes); setPage(String(changes.currentPage ?? 0)); setMessage('Book saved.') }} />}
    {deleting && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeDelete()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><p className="eyebrow">Your library</p><h2 id="delete-title">Remove this book?</h2><p>“{book.title}” and its notes and quotes will be removed from your library. This cannot be undone.</p><div className="form-actions"><button autoFocus className="secondary-button" onClick={closeDelete}>Keep book</button><button className="primary-button" onClick={() => { library.deleteBook(book.id); onNavigate('/library') }}>Delete book</button></div></section></div>}
  </div>
}
