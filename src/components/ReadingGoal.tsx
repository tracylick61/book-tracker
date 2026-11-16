import { useRef, useState, type FormEvent } from 'react'
import { isValidReadingGoal, loadReadingGoal, readingGoalProgress, saveReadingGoal } from '../data/readingGoal'
import { ProgressBar } from './ProgressBar'
import './reading-goal.css'

export function ReadingGoal({ read, year }: { read: number; year: number }) {
  const [target, setTarget] = useState(loadReadingGoal)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const trigger = useRef<HTMLButtonElement>(null)
  const value = draft.trim() === '' ? NaN : Number(draft)
  const valid = isValidReadingGoal(value)
  const percent = readingGoalProgress(read, target)
  const close = () => { setEditing(false); requestAnimationFrame(() => trigger.current?.focus()) }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!valid) return
    const saved = saveReadingGoal(value)
    setTarget(value)
    setMessage(saved ? 'Цель сохранена.' : 'Цель изменена на время этой сессии. Браузер не разрешил сохранение.')
    close()
  }
  return <section className="reading-goal" aria-labelledby="reading-goal-heading">
    <div className="reading-goal-copy"><p className="eyebrow">В своём темпе</p><h2 id="reading-goal-heading">Цель на {year} год</h2></div>
    <div className="reading-goal-progress"><div><span>{read} из {target} прочитано</span><strong>{percent}%</strong></div><ProgressBar value={percent} /></div>
    <button ref={trigger} className="link-button" disabled={editing} aria-expanded={editing} aria-controls="reading-goal-editor" onClick={() => { setDraft(String(target)); setMessage(''); setEditing(true) }}>Изменить цель</button>
    {editing && <form id="reading-goal-editor" className="reading-goal-editor" onSubmit={submit} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); close() } }}>
      <label htmlFor="reading-goal-input">Сколько книг хотите прочитать?<input autoFocus id="reading-goal-input" type="number" min="1" step="1" max={Number.MAX_SAFE_INTEGER} value={draft} onChange={event => setDraft(event.target.value)} aria-invalid={!valid} aria-describedby={!valid ? 'reading-goal-error' : undefined} /></label>
      <div><button className="secondary-button" type="button" onClick={close}>Отмена</button><button className="primary-button" disabled={!valid}>Сохранить цель</button></div>
      {!valid && <p className="form-error" id="reading-goal-error">Укажите целое положительное количество книг.</p>}
    </form>}
    <p className="reading-goal-status" role="status" aria-live="polite">{message}</p>
  </section>
}
