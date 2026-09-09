import { useEffect, useState, type FormEvent } from 'react'
import type { BookStatus, NewBook } from '../types/book'

interface Props { open: boolean; onClose: () => void; onAdd: (book: NewBook) => void }
const initial = { title: '', author: '', cover: '', status: 'want-to-read' as BookStatus, totalPages: '', currentPage: '', rating: '5' }

export function AddBookModal({ open, onClose, onAdd }: Props) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open, onClose])
  if (!open) return null

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const totalPages = Number(form.totalPages) || undefined
    const currentPage = Number(form.currentPage) || undefined
    if (!form.title.trim() || !form.author.trim()) return setError('Title and author are required.')
    if (totalPages && currentPage && currentPage > totalPages) return setError('Current page cannot be greater than total pages.')
    onAdd({ title: form.title.trim(), author: form.author.trim(), cover: form.cover.trim(), status: form.status, totalPages, currentPage: form.status === 'reading' ? currentPage : undefined, rating: form.status === 'read' ? Number(form.rating) : undefined, startedAt: form.status === 'reading' ? new Date().toISOString() : undefined, finishedAt: form.status === 'read' ? new Date().toISOString() : undefined })
    setForm(initial); setError(''); onClose()
  }
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="add-title">
        <div className="modal-heading"><div><p className="eyebrow">New to your shelves</p><h2 id="add-title">Add a book</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>Title<input autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Book title" /></label>
            <label>Author<input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" /></label>
            <label className="full-field">Cover image URL<input type="url" value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://…" /></label>
            <label>Status<select value={form.status} onChange={(e) => set('status', e.target.value)}><option value="want-to-read">Want to read</option><option value="reading">Reading</option><option value="read">Read</option></select></label>
            <label>Total pages<input type="number" min="1" value={form.totalPages} onChange={(e) => set('totalPages', e.target.value)} placeholder="320" /></label>
            {form.status === 'reading' && <label>Current page<input type="number" min="0" value={form.currentPage} onChange={(e) => set('currentPage', e.target.value)} placeholder="42" /></label>}
            {form.status === 'read' && <label>Rating<select value={form.rating} onChange={(e) => set('rating', e.target.value)}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}</select></label>}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Add to library</button></div>
        </form>
      </section>
    </div>
  )
}
