import type { Book, NewBook } from '../types/book'

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
export const isDuplicateBook = (books: Book[], candidate: Pick<NewBook, 'title' | 'author'>, excludingId?: string) =>
  books.some(book => book.id !== excludingId && normalize(book.title) === normalize(candidate.title) && normalize(book.author) === normalize(candidate.author))
