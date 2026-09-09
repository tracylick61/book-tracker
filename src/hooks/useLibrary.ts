import { useState } from 'react'
import { loadBooks, saveBooks } from '../data/libraryStorage'
import type { Book, NewBook } from '../types/book'

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(loadBooks)

  const addBook = (book: NewBook) => {
    const next = [{ ...book, id: crypto.randomUUID() }, ...books]
    setBooks(next)
    saveBooks(next)
  }

  return { books, addBook }
}
