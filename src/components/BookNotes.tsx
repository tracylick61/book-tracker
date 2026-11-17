import { DeleteConfirmation } from './DeleteConfirmation'
import { useCallback, useRef, useState, type FormEvent } from 'react'

export function BookNotes({ notes, onSave }: { notes: string; onSave: (notes: string) => void }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const cancelClear = useCallback(() => setConfirmClear(false), [])
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = () => { setEditing(false); requestAnimationFrame(() => trigger.current?.focus()) }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (notes.trim() && !draft.trim()) { setConfirmClear(true); return }
    onSave(draft); close()
  }
  return <section className="diary-notes" aria-labelledby="notes-heading">
    <div className="diary-section-heading"><div><p className="eyebrow">Личное послесловие</p><h2 id="notes-heading">Заметки</h2></div></div>
    <p className="diary-section-intro">Личные мысли и впечатления от этой книги.</p>
    <div id="notes-content">{editing ? <form className="diary-editor" onSubmit={submit}>
      <label htmlFor="book-notes">Ваши впечатления</label><textarea autoFocus id="book-notes" rows={7} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Мысли на полях, впечатления, то, к чему хочется вернуться…" />
      <div className="diary-editor-footer"><span className="diary-help">{draft === notes ? 'Нет несохранённых изменений' : 'Есть несохранённые изменения'}</span><div className="diary-controls"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" disabled={draft === notes}>Сохранить заметку</button></div></div>
    </form> : <div className={notes.trim() ? 'diary-note-surface' : undefined}>
      {notes.trim() && <div className="diary-note-content">{notes}</div>}
      <div className="diary-note-actions diary-controls">
        <button ref={trigger} className="secondary-button" aria-expanded={editing} aria-controls="notes-content" onClick={() => { setDraft(notes); setEditing(true) }}>{notes.trim() ? 'Редактировать заметку' : 'Записать впечатление'}</button>
        {notes.trim() && <button className="destructive-button" onClick={() => setConfirmClear(true)}>Удалить заметку</button>}
      </div>
    </div>}</div>
    {confirmClear && <DeleteConfirmation title="Удалить заметку?" keepLabel="Оставить заметку" deleteLabel="Удалить заметку" onCancel={cancelClear} onConfirm={() => { setConfirmClear(false); onSave(''); close() }} />}
  </section>
}
