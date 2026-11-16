import { useRef, useState, type FormEvent } from 'react'
import type { Quote } from '../types/book'
import { QuoteEntry } from './QuoteEntry'
import { quoteCount } from '../lib/readingFormat'

interface Props {
  quotes: Quote[]; totalPages?: number;
  onAdd: (quote: Pick<Quote, 'text' | 'page'>) => void; onDelete: (id: string) => void;
}
export function BookQuotes({ quotes, totalPages, onAdd, onDelete }: Props) {
  const [composing, setComposing] = useState(false)
  const [text, setText] = useState('')
  const [page, setPage] = useState('')
  const [error, setError] = useState('')
  const trigger = useRef<HTMLButtonElement>(null)
  const close = () => { setComposing(false); setText(''); setPage(''); setError(''); requestAnimationFrame(() => trigger.current?.focus()) }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!text.trim()) { setError('Введите текст цитаты.'); return }
    if (page !== '' && (!Number.isInteger(Number(page)) || Number(page) < 1 || (totalPages !== undefined && Number(page) > totalPages))) { setError('Укажите корректный номер страницы.'); return }
    onAdd({ text: text.trim(), page: page === '' ? undefined : Number(page) }); close()
  }
  return <section className="diary-quotes" aria-labelledby="quotes-heading">
    <div className="diary-section-heading"><div><p className="eyebrow">Строки на память</p><h2 id="quotes-heading">Цитаты</h2></div><button ref={trigger} className="secondary-button" disabled={composing} aria-expanded={composing} aria-controls="quote-composer" onClick={() => setComposing(true)}>Добавить цитату <span aria-hidden="true">＋</span></button></div>
    <p className="diary-section-intro">Слова из этой книги, которые хочется оставить с собой.</p>
    {quotes.length ? <div className="diary-quote-list" aria-label={quoteCount(quotes.length)}>{[...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(quote => <QuoteEntry key={quote.id} quote={quote} onDelete={() => onDelete(quote.id)} />)}</div> : <p className="diary-empty-copy">Пока здесь нет сохранённых цитат.</p>}
    <div id="quote-composer">{composing && <form className="diary-editor quote-composer" onSubmit={submit}>
      <h3>Новая цитата</h3><label htmlFor="book-quote">Текст цитаты</label><textarea autoFocus id="book-quote" rows={4} value={text} onChange={event => { setText(event.target.value); setError('') }} placeholder="Слова, которые хочется сохранить…" required />
      <label className="quote-page-field" htmlFor="quote-page">Страница <span>необязательно</span><input id="quote-page" type="number" min="1" step="1" max={totalPages} value={page} onChange={event => { setPage(event.target.value); setError('') }} placeholder="Например, 42" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}<div className="diary-controls"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" disabled={!text.trim()}>Сохранить цитату</button></div>
    </form>}</div>
  </section>
}
