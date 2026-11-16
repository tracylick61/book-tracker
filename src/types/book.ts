export type BookStatus = 'want-to-read' | 'reading' | 'read'

export interface Quote {
  id: string
  text: string
  page?: number
  createdAt: string
}

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
  quotes?: Quote[]
  notes?: string
  finishedAt?: string
}

export type NewBook = Omit<Book, 'id'>
