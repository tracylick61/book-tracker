interface SidebarProps { path: string; onNavigate: (path: string) => void; onAdd: () => void }

export function Sidebar({ path, onNavigate, onAdd }: SidebarProps) {
  const link = (to: string, label: string) => <a href={to} className={path === to ? 'active' : ''} onClick={(event) => { event.preventDefault(); onNavigate(to) }}>{label}</a>
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate('/')}>Book <em>Tracker</em></button>
      <nav aria-label="Main navigation">
        {link('/', 'Home')}
        {link('/library', 'Library')}
        <span className="disabled-link">Quotes <small>Soon</small></span>
      </nav>
      <button className="primary-button sidebar-add" onClick={onAdd}>+ Add book</button>
      <p className="sidebar-foot">Your reading life,<br />collected quietly.</p>
    </aside>
  )
}
