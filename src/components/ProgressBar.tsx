export function ProgressBar({ value }: { value: number }) {
  return <div className="progress-track" aria-label={`Прочитано ${Math.round(value)}%`}><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
}
