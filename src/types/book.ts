export type BookStatus = 'want-to-read' | 'reading' | 'read'

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: BookStatus
  totalPages?: number
  currentPage?: number
  rating?: number
  startedAt?: string
  finishedAt?: string
}

export type NewBook = Omit<Book, 'id'>
