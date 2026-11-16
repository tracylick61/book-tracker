import { useDialog } from '../hooks/useDialog'
import { useState, type FormEvent } from 'react'
import type { Book, BookStatus, NewBook } from '../types/book'

interface Props { open: boolean; onClose: () => void; onAdd: (book: NewBook) => void; book?: Book }
const initial = { title: '', author: '', cover: '', status: 'want-to-read' as BookStatus, totalPages: '', currentPage: '', rating: '5' }

export function AddBookModal({ open, onClose, onAdd, book }: Props) {
  const [form, setForm] = useState(() => book ? { title: book.title, author: book.author, cover: book.cover, status: book.status, totalPages: String(book.totalPages ?? ''), currentPage: String(book.currentPage ?? ''), rating: String(book.rating ?? 5) } : initial)
  const [error, setError] = useState('')
  useDialog(open, onClose)
  if (!open) return null

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const totalPages = Number(form.totalPages) || undefined
    const currentPage = form.currentPage === '' ? undefined : Number(form.currentPage)
    if (!form.title.trim() || !form.author.trim()) return setError('Title and author are required.')
    if ((form.totalPages && (!Number.isInteger(totalPages) || !totalPages || totalPages < 1)) || (form.currentPage && (currentPage !== undefined && (!Number.isInteger(currentPage) || currentPage < 0)))) return setError('Enter valid whole page numbers.')
    if (totalPages && currentPage && currentPage > totalPages) return setError('Current page cannot be greater than total pages.')
    onAdd({ title: form.title.trim(), author: form.author.trim(), cover: form.cover.trim(), status: form.status, totalPages, currentPage, rating: form.status === 'read' ? Number(form.rating) : undefined, startedAt: form.status === 'reading' ? (book?.startedAt ?? new Date().toISOString()) : book?.startedAt, finishedAt: form.status === 'read' ? (book?.finishedAt ?? new Date().toISOString()) : undefined })
    setForm(initial); setError(''); onClose()
  }
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="add-title">
        <div className="modal-heading"><div><p className="eyebrow">{book ? 'Your reading journal' : 'New to your shelves'}</p><h2 id="add-title">{book ? 'Edit book' : 'Add a book'}</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>Title<input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Book title" /></label>
            <label>Author<input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" /></label>
            <label className="full-field">Cover image URL<input type="url" value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://…" /></label>
            <label>Status<select aria-label="Status" value={form.status} onChange={(e) => set('status', e.target.value)}><option value="want-to-read">Want to read</option><option value="reading">Reading</option><option value="read">Read</option></select></label>
            <label>Total pages<input type="number" min="1" step="1" value={form.totalPages} onChange={(e) => set('totalPages', e.target.value)} placeholder="320" /></label>
            {(book || form.status === 'reading') && <label>Current page<input type="number" min="0" step="1" max={form.totalPages || undefined} value={form.currentPage} onChange={(e) => set('currentPage', e.target.value)} placeholder="42" /></label>}
            {form.status === 'read' && <label>Rating<select aria-label="Rating" value={form.rating} onChange={(e) => set('rating', e.target.value)}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}</select></label>}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{book ? 'Save changes' : 'Add to library'}</button></div>
        </form>
      </section>
    </div>
  )
}
