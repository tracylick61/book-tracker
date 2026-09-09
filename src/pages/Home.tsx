import type { Book } from '../types/book'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'
import { ProgressBar } from '../components/ProgressBar'
import { SectionHeader } from '../components/SectionHeader'
import { StatusBadge } from '../components/StatusBadge'

export function Home({ books, onNavigate }: { books: Book[]; onNavigate: (path: string) => void }) {
  const current = books.find((book) => book.status === 'reading')
  const readThisYear = books.filter((book) => book.status === 'read' && book.finishedAt?.startsWith(String(new Date().getFullYear()))).length
  const counts = [
    { value: readThisYear, label: 'Books read this year' },
    { value: books.filter((book) => book.status === 'reading').length, label: 'Currently reading' },
    { value: books.filter((book) => book.status === 'want-to-read').length, label: 'Want to read' },
  ]
  const percent = current?.totalPages ? Math.round(((current.currentPage ?? 0) / current.totalPages) * 100) : 0

  return (
    <div className="page home-page">
      <header className="page-intro"><p className="eyebrow">Wednesday, September 9</p><h1>Good afternoon</h1><p>Keep track of what you read and what stays with you.</p></header>
      {current && <section className="current-section">
        <SectionHeader title="Currently reading" />
        <div className="current-reading">
          <BookCover src={current.cover} title={current.title} className="current-cover" />
          <div className="current-details">
            <StatusBadge status={current.status} />
            <h2>{current.title}</h2><p className="author">by {current.author}</p>
            <div className="progress-copy"><span>Page {current.currentPage ?? 0} of {current.totalPages ?? '—'}</span><strong>{percent}%</strong></div>
            <ProgressBar value={percent} />
            <button className="primary-button">Continue reading <span>→</span></button>
          </div>
          <blockquote>“The object isn’t to make art, it’s to be in that wonderful state which makes art inevitable.”</blockquote>
        </div>
      </section>}
      <section>
        <SectionHeader title="Your library" action={<button className="link-button" onClick={() => onNavigate('/library')}>View all <span>→</span></button>} />
        <div className="home-books">{books.slice(0, 5).map((book) => <BookCard key={book.id} book={book} />)}</div>
      </section>
      <div className="home-bottom">
        <section className="overview"><SectionHeader title="Reading overview" /><div className="stats">{counts.map((item) => <div key={item.label}><strong>{String(item.value).padStart(2, '0')}</strong><span>{item.label}</span></div>)}</div></section>
        <section className="recent-quote"><p className="eyebrow">Recent quote</p><blockquote>“A reader lives a thousand lives before he dies. The man who never reads lives only one.”</blockquote><p><strong>A Dance with Dragons</strong><br />George R. R. Martin</p></section>
      </div>
    </div>
  )
}
