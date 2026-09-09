import { useEffect, useState } from 'react'
import './App.css'
import { AddBookModal } from './components/AddBookModal'
import { Sidebar } from './components/Sidebar'
import { useLibrary } from './hooks/useLibrary'
import { Home } from './pages/Home'
import { Library } from './pages/Library'

const currentPath = () => (window.location.pathname === '/library' ? '/library' : '/')

function App() {
  const [path, setPath] = useState(currentPath)
  const [isAdding, setIsAdding] = useState(false)
  const { books, addBook } = useLibrary()

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
        {path === '/library' ? (
          <Library books={books} onAdd={() => setIsAdding(true)} />
        ) : (
          <Home books={books} onNavigate={navigate} />
        )}
      </main>
      <AddBookModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={addBook}
      />
    </div>
  )
}

export default App
