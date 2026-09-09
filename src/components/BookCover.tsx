interface BookCoverProps { src: string; title: string; className?: string }

export function BookCover({ src, title, className = '' }: BookCoverProps) {
  return (
    <div className={`book-cover ${className}`}>
      {src ? <img src={src} alt={`Cover of ${title}`} /> : <div className="cover-placeholder"><span>{title}</span></div>}
    </div>
  )
}
