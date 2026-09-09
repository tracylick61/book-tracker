import { demoBooks } from './demoBooks'
import type { Book } from '../types/book'

const STORAGE_KEY = 'book-tracker-library'

export function loadBooks(): Book[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as Book[]
  } catch {
    // A private browsing policy can make localStorage unavailable.
  }
  return demoBooks
}

export function saveBooks(books: Book[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch {
    // Keep the in-memory library usable if persistence is unavailable.
  }
}
