import { useRef, useState, type FormEvent } from 'react'
import type { Book, NewBook } from '../types/book'
import type { BookSearchResult } from '../api/openLibrary'
import { isDuplicateBook } from '../data/bookIdentity'

interface Props {
  book?: Book; selected?: BookSearchResult; books: Book[];
  onSave: (book: NewBook) => boolean | void; onDone: () => void; onCancel: () => void;
}
export function BookForm({ book, selected, books, onSave, onDone, onCancel }: Props) {
  const [form, setForm] = useState(() => ({
    title: book?.title ?? selected?.title ?? '', author: book?.author ?? selected?.author ?? '',
    cover: book?.cover ?? selected?.cover ?? '', status: book?.status ?? 'want-to-read',
    totalPages: String(book?.totalPages ?? selected?.totalPages ?? ''),
    currentPage: String(book?.currentPage ?? ''), rating: String(book?.rating ?? (selected ? '' : 5)),
  }))
  const [error, setError] = useState('')
  const submitting = useRef(false)
  const set = (key: keyof typeof form, value: string) => { setForm(current => ({ ...current, [key]: value })); setError('') }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const totalPages = form.totalPages === '' ? undefined : Number(form.totalPages)
    const currentPage = form.currentPage === '' ? undefined : Number(form.currentPage)
    const rating = form.rating === '' ? undefined : Number(form.rating)
    if (!form.title.trim() || !form.author.trim()) return setError('Укажите название книги и автора.')
    if ((totalPages !== undefined && (!Number.isInteger(totalPages) || totalPages < 1)) || (currentPage !== undefined && (!Number.isInteger(currentPage) || currentPage < 0))) return setError('Укажите корректное целое количество страниц.')
    if (totalPages !== undefined && currentPage !== undefined && currentPage > totalPages) return setError('Текущая страница не может быть больше объёма книги.')
    if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) return setError('Выберите оценку от 1 до 5.')
    const entry: NewBook = {
      title: form.title.trim(), author: form.author.trim(), cover: form.cover.trim(), status: form.status,
      totalPages, currentPage: form.status === 'read' && totalPages !== undefined ? totalPages : currentPage,
      rating: form.status === 'read' ? rating : undefined,
      startedAt: form.status === 'reading' ? book?.startedAt ?? new Date().toISOString() : book?.startedAt,
      finishedAt: form.status === 'read' ? book?.finishedAt ?? new Date().toISOString() : undefined,
    }
    if (isDuplicateBook(books, entry, book?.id)) return setError('Эта книга уже есть в вашей библиотеке.')
    submitting.current = true
    if (onSave(entry) === false) { submitting.current = false; setError('Эта книга уже есть в вашей библиотеке.'); return }
    onDone()
  }
  return <form onSubmit={submit} className="book-entry-form">
    <div className="form-grid">
      {!selected && <><label>Название<input autoFocus value={form.title} onChange={e => set('title', e.target.value)} placeholder="Название книги" /></label><label>Автор<input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Имя автора" /></label><label className="full-field">Ссылка на обложку<input type="url" value={form.cover} onChange={e => set('cover', e.target.value)} placeholder="https://…" /></label></>}
      {selected && !selected.author && <label className="full-field">Автор<input autoFocus aria-describedby="missing-author-hint" value={form.author} onChange={e => set('author', e.target.value)} placeholder="Укажите автора" /></label>}
      <label>Статус<select autoFocus={Boolean(selected?.author)} aria-label="Статус" value={form.status} onChange={e => set('status', e.target.value)}><option value="want-to-read">Хочу прочитать</option><option value="reading">Читаю</option><option value="read">Прочитано</option></select></label>
      <label>Всего страниц<input type="number" min="1" step="1" value={form.totalPages} onChange={e => set('totalPages', e.target.value)} placeholder={selected ? 'Не указано' : '320'} /></label>
      {(book || form.status === 'reading') && <label>Текущая страница<input type="number" min="0" step="1" max={form.totalPages || undefined} value={form.currentPage} onChange={e => set('currentPage', e.target.value)} placeholder="0" /></label>}
      {form.status === 'read' && <label>Оценка<select aria-label="Оценка" value={form.rating} onChange={e => set('rating', e.target.value)}><option value="">Без оценки</option>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} из 5</option>)}</select></label>}
    </div>
    {selected && !selected.author && <p id="missing-author-hint" className="entry-hint">В каталоге нет автора. Заполните его перед добавлением.</p>}
    {selected && !selected.totalPages && <p className="entry-hint">Объём не найден в каталоге. Можно указать страницы или оставить поле пустым.</p>}
    {form.status === 'read' && <p className="entry-hint">Книга будет отмечена прочитанной. При известном объёме прогресс составит 100%.</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="secondary-button" onClick={onCancel}>Отмена</button><button className="primary-button" type="submit">{book ? 'Сохранить изменения' : 'Добавить в библиотеку'}</button></div>
  </form>
}
