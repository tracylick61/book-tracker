import { useRef, useState, type FormEvent } from 'react'

export function BookNotes({ notes, onSave }: { notes: string; onSave: (notes: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = () => { setEditing(false); requestAnimationFrame(() => trigger.current?.focus()) }
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(draft); close() }
  return <section className="diary-notes" aria-labelledby="notes-heading">
    <div className="diary-section-heading"><div><p className="eyebrow">Личное послесловие</p><h2 id="notes-heading">Заметки</h2></div>
      <button ref={trigger} className="secondary-button" disabled={editing} aria-expanded={editing} aria-controls="notes-content" onClick={() => { setDraft(notes); setEditing(true) }}>{notes.trim() ? 'Редактировать заметку' : 'Записать впечатление'}</button>
    </div>
    <p className="diary-section-intro">Что эта книга оставила после себя? Здесь можно быть собой.</p>
    <div id="notes-content">{editing ? <form className="diary-editor" onSubmit={submit}>
      <label htmlFor="book-notes">Ваши впечатления</label><textarea autoFocus id="book-notes" rows={7} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Мысли на полях, впечатления, то, к чему хочется вернуться…" />
      <div className="diary-editor-footer"><span className="diary-help">{draft === notes ? 'Нет несохранённых изменений' : 'Есть несохранённые изменения'}</span><div className="diary-controls"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" disabled={draft === notes}>Сохранить заметку</button></div></div>
    </form> : notes.trim() ? <div className="diary-note-content">{notes}</div> : <div className="diary-empty"><h3>У каждой книги — своё послевкусие</h3><p>Запишите первую мысль, важное открытие или то, с чем хочется поспорить.</p></div>}</div>
  </section>
}
