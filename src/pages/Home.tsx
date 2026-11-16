import type { Book } from '../types/book'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'
import { ProgressBar } from '../components/ProgressBar'
import { SectionHeader } from '../components/SectionHeader'
import { StatusBadge } from '../components/StatusBadge'

export function Home({ books, onNavigate, onAdd }: { books: Book[]; onNavigate: (path: string) => void; onAdd: () => void }) {
  const recent = books.flatMap(book => (book.quotes ?? []).map(quote => ({ book, quote }))).sort((a, b) => b.quote.createdAt.localeCompare(a.quote.createdAt))[0]
  const current = books.find(book => book.status === 'reading')
  const year = new Date().getFullYear()
  const stats = [
    { value: books.filter(book => book.status === 'read' && book.finishedAt?.startsWith(String(year))).length, label: `прочитано в ${year}` },
    { value: books.filter(book => book.status === 'reading').length, label: 'сейчас в чтении' },
    { value: books.filter(book => book.status === 'want-to-read').length, label: 'в планах' },
  ]
  const percent = current?.totalPages ? Math.round((current.currentPage ?? 0) / current.totalPages * 100) : 0
  return <div className="page home-page stage-one">
    <header className="reader-welcome"><div><p className="eyebrow">Ваше читательское пространство</p><h1>Хороший день для чтения</h1><p>Книги, мысли и строки, к которым хочется вернуться.</p></div><time dateTime={new Date().toLocaleDateString('en-CA')}>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}</time></header>
    <section className="reading-section" aria-labelledby="reading-title"><div className="section-label"><h2 id="reading-title">Сейчас читаю</h2><span>В своём ритме, страница за страницей</span></div>
      {current ? <div className="reading-feature"><a className="feature-cover" href={`/book/${current.id}`} aria-label={`Открыть книгу «${current.title}»`}><BookCover src={current.cover} title={current.title} /></a><div className="feature-details"><StatusBadge status={current.status} /><h2><a href={`/book/${current.id}`}>{current.title}</a></h2><p className="feature-author">{current.author}</p><div className="feature-progress"><div className="progress-copy"><span>{current.currentPage ?? 0} из {current.totalPages ?? '—'} стр.</span><strong>{current.totalPages ? `${percent}%` : 'Объём не указан'}</strong></div><ProgressBar value={percent} /></div><button className="primary-button" onClick={() => onNavigate(`/book/${current.id}`)}>Продолжить чтение <span aria-hidden="true">→</span></button><p className="feature-hint">Обновить прогресс, записать мысль или сохранить цитату</p></div><aside className="feature-aside"><p className="feature-journal-label">Дневник книги</p><p>{current.notes ? 'Впечатления уже на полях.' : 'Что останется после прочтения?'}</p><button className="link-button" onClick={() => onNavigate(`/book/${current.id}`)}>Заметки и цитаты <span aria-hidden="true">→</span></button></aside></div> : <div className="reading-feature reading-empty"><div><p className="eyebrow">Следующая глава впереди</p><h2>Какую историю начнём?</h2><p>Выберите книгу на своей полке и отметьте её статусом «Читаю».</p><button className="primary-button" onClick={() => books.length ? onNavigate('/library') : onAdd()}>{books.length ? 'Выбрать книгу' : 'Добавить первую книгу'} <span aria-hidden="true">→</span></button></div></div>}
    </section>
    <dl className="reading-summary" aria-label="Статистика чтения">{stats.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value.toLocaleString('ru-RU')}</dd></div>)}</dl>
    <section className="personal-shelf"><SectionHeader title="На вашей полке" action={<button className="link-button" onClick={() => onNavigate('/library')}>Вся библиотека <span aria-hidden="true">→</span></button>} />{books.length ? <div className="home-books">{books.slice(0, 5).map(book => <BookCard key={book.id} book={book} />)}</div> : <div className="empty-state"><h2>Здесь начинается ваша библиотека</h2><p>Добавьте любимую книгу или ту, которую давно хотите прочитать.</p><button className="secondary-button" onClick={onAdd}>Добавить книгу</button></div>}</section>
    <div className="reader-bottom"><section className="reader-recent"><p className="eyebrow">Последняя цитата</p>{recent ? <><blockquote>«{recent.quote.text}»</blockquote><a className="quote-source" href={`/book/${recent.book.id}`}><strong>{recent.book.title}</strong><span>{recent.book.author}{recent.quote.page !== undefined && ` · стр. ${recent.quote.page}`} →</span></a></> : <><blockquote>Некоторые строки<br />остаются с нами.</blockquote><p>Сохраните первую цитату на странице книги — она появится здесь.</p><button className="link-button" onClick={() => onNavigate('/library')}>Выбрать книгу <span aria-hidden="true">→</span></button></>}</section><section className="reader-actions"><p className="eyebrow">Маленькие читательские привычки</p><h2>Оставьте след от прочитанного</h2><p>Собирайте не только книги, но и то, что они в вас меняют.</p><button onClick={onAdd}><span>Добавить книгу<small>Ещё одна история на вашей полке</small></span><span aria-hidden="true">＋</span></button><button onClick={() => onNavigate('/quotes')}><span>Открыть цитатник<small>Вернуться к сохранённым словам</small></span><span aria-hidden="true">→</span></button></section></div>
  </div>
}
