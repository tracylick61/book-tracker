interface HeaderProps { path: string; onNavigate: (path: string) => void; onAdd: () => void }
export function Header({ path, onNavigate, onAdd }: HeaderProps) {
  return <header className="site-header"><div className="header-inner">
    <a className="site-brand" href="/" aria-label="Book Tracker — на главную" onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate('/') }}><svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 7C10 4 6 4 3 5v17c4-1 7-1 11 2 4-3 7-3 11-2V5c-3-1-7-1-11 2Zm0 0v17" /></svg><span>Book <em>Tracker</em><small>Личный дневник чтения</small></span></a>
    <nav aria-label="Основная навигация">{[{ to: '/', label: 'Главная' }, { to: '/library', label: 'Библиотека' }, { to: '/quotes', label: 'Цитаты' }].map(item => {
      const active = path === item.to || (item.to === '/library' && path.startsWith('/book/'))
      return <a key={item.to} href={item.to} aria-current={active ? 'page' : undefined} className={active ? 'active' : ''} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(item.to) }}>{item.label}</a>
    })}</nav>
    <button className="primary-button header-add" onClick={onAdd}><span aria-hidden="true">＋</span> Добавить книгу</button>
  </div></header>
}
