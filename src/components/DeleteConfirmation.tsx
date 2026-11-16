import { useEffect, useId, useRef, useState } from 'react'
import { useDialog } from '../hooks/useDialog'

interface Props {
  title: string; keepLabel: string; deleteLabel: string;
  onCancel: () => void; onConfirm: () => void;
  description?: string; eyebrow?: string;
}
export function DeleteConfirmation({ title, keepLabel, deleteLabel, onCancel, onConfirm, description = 'Это действие нельзя отменить.', eyebrow = 'Читательский дневник' }: Props) {
  const titleId = useId()
  const descriptionId = useId()
  // Capture before autoFocus moves to the safe action on mount.
  const [previousFocus] = useState(() => document.activeElement instanceof HTMLElement ? document.activeElement : null)
  const safeAction = useRef<HTMLButtonElement>(null)
  useDialog(true, onCancel)
  useEffect(() => {
    safeAction.current?.focus()
    return () => previousFocus?.focus()
  }, [previousFocus])
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onCancel()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <p className="eyebrow">{eyebrow}</p><h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      <div className="form-actions"><button ref={safeAction} autoFocus className="secondary-button" onClick={onCancel}>{keepLabel}</button><button className="destructive-button" onClick={onConfirm}>{deleteLabel}</button></div>
    </section>
  </div>
}
