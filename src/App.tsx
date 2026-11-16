import { useEffect, useState } from 'react'
import './App.css'
import { AddBookModal } from './components/AddBookModal'
import { Sidebar } from './components/Sidebar'
import { useLibrary } from './hooks/useLibrary'
import { BookDetail } from './pages/BookDetail'
import { Quotes } from './pages/Quotes'
import { Home } from './pages/Home'
import { Library } from './pages/Library'

const currentPath = () => window.location.pathname

function App() {
  const [path, setPath] = useState(currentPath)
  const [isAdding, setIsAdding] = useState(false)
  const library = useLibrary()
  const { books, addBook } = library
  const book = books.find(item => `/book/${item.id}` === path)

  useEffect(() => {
    const updatePath = () => setPath(currentPath())
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setPath(currentPath())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Sidebar path={path} onNavigate={navigate} onAdd={() => setIsAdding(true)} />
      <main className="main-content">
        {path.startsWith('/book/') ? (book ? <BookDetail key={book.id} book={book} library={library} onNavigate={navigate} /> : <div className="page"><div className="empty-state"><h1>Book not found</h1><p>This book may have been removed from your library.</p><a href="/library" className="quote-source">← Back to Library</a></div></div>) : path === '/quotes' ? <Quotes books={books} /> : path === '/library' ? (
          <Library books={books} onAdd={() => setIsAdding(true)} />
        ) : (
          <Home books={books} onNavigate={navigate} />
        )}
      </main>
      {isAdding && <AddBookModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={addBook}
      />}
    </div>
  )
}

export default App
