import type { Book } from '../types/book'

export const demoBooks: Book[] = [
  { id: 'demo-1', title: 'The Creative Act', author: 'Rick Rubin', cover: 'https://covers.openlibrary.org/b/isbn/9780593652886-L.jpg', status: 'reading', totalPages: 432, currentPage: 168, startedAt: '2026-08-18' },
  { id: 'demo-2', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', cover: 'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg', status: 'read', totalPages: 416, rating: 5, finishedAt: '2026-07-12' },
  { id: 'demo-3', title: 'The Midnight Library', author: 'Matt Haig', cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg', status: 'read', totalPages: 304, rating: 4, finishedAt: '2026-04-03' },
  { id: 'demo-4', title: 'On Earth We’re Briefly Gorgeous', author: 'Ocean Vuong', cover: 'https://covers.openlibrary.org/b/isbn/9780525562023-L.jpg', status: 'want-to-read', totalPages: 256 },
  { id: 'demo-5', title: 'The Anthropocene Reviewed', author: 'John Green', cover: 'https://covers.openlibrary.org/b/isbn/9780525555216-L.jpg', status: 'want-to-read', totalPages: 304 },
  { id: 'demo-6', title: 'Pachinko', author: 'Min Jin Lee', cover: 'https://covers.openlibrary.org/b/isbn/9781455563937-L.jpg', status: 'read', totalPages: 496, rating: 5, finishedAt: '2025-11-20' },
]
