import { useState } from 'react'

interface BookCoverProps { src: string; title: string; className?: string }

export function BookCover({ src, title, className = '' }: BookCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  return (
    <div className={`book-cover ${className}`}>
      {src && src !== failedSrc ? <img src={src} alt={`Обложка книги «${title}»`} onError={() => setFailedSrc(src)} /> : <div className="cover-placeholder"><span>{title}</span></div>}
    </div>
  )
}
