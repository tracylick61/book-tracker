import { useState } from 'react'
import { loadBooks, saveBooks } from '../data/libraryStorage'
import type { Book, NewBook, Quote } from '../types/book'

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(loadBooks)
  const commit = (transform: (current: Book[]) => Book[]) => setBooks(current => {
    const next = transform(current)
    saveBooks(next)
    return next
  })
  const updateBook = (id: string, changes: Partial<NewBook>) => commit(current => current.map(book => {
    if (book.id !== id) return book
    const next = { ...book, ...changes }
    if (next.status === 'reading' && !next.startedAt) next.startedAt = new Date().toISOString()
    if (next.status === 'read' && !next.finishedAt) next.finishedAt = new Date().toISOString()
    if (next.status !== 'read') next.finishedAt = undefined
    return next
  }))
  const addBook = (book: NewBook) => {
    const entry = { ...book, id: crypto.randomUUID(), quotes: [], notes: '' }
    commit(current => [entry, ...current])
  }
  const deleteBook = (id: string) => commit(current => current.filter(book => book.id !== id))
  const updateProgress = (id: string, page: number) => {
    const book = books.find(book => book.id === id)
    if (!book || book.status !== 'reading' || !Number.isInteger(page) || page < 0 || (book.totalPages !== undefined && page > book.totalPages)) return
    updateBook(id, { currentPage: page })
  }
  const addQuote = (id: string, quote: Pick<Quote, 'text' | 'page'>) => {
    if (!quote.text.trim()) return
    const entry = { ...quote, text: quote.text.trim(), id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    commit(current => current.map(book => book.id === id ? { ...book, quotes: [...(book.quotes ?? []), entry] } : book))
  }
  const deleteQuote = (id: string, quoteId: string) => commit(current => current.map(book => book.id === id ? { ...book, quotes: (book.quotes ?? []).filter(quote => quote.id !== quoteId) } : book))
  const saveNotes = (id: string, notes: string) => updateBook(id, { notes })
  return { books, addBook, updateBook, deleteBook, updateProgress, addQuote, deleteQuote, saveNotes }
}
