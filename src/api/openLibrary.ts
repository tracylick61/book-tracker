/** Open Library is a catalogue only. Nothing here is required after a book is saved. */
interface OpenLibraryEdition {
  key?: string
  title?: string
  publisher?: string[]
  publish_date?: string[]
  number_of_pages?: number | number[]
  isbn?: string[]
  cover_i?: number
}
interface OpenLibraryWork {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  editions?: { docs?: OpenLibraryEdition[] }
}
interface OpenLibraryResponse { docs?: OpenLibraryWork[] }

export interface BookSearchResult {
  id: string
  title: string
  author: string
  cover: string
  year?: number
  publisher?: string
  publishDate?: string
  totalPages?: number
  isbn?: string
}

const fields = [
  'key', 'title', 'author_name', 'first_publish_year', 'cover_i', 'editions',
  'editions.key', 'editions.title', 'editions.publisher', 'editions.publish_date',
  'editions.number_of_pages', 'editions.isbn', 'editions.cover_i',
].join(',')
const cleanText = (value: unknown): string => {
  const text = typeof value === 'string' ? value.trim() : ''
  return /^(?:undefined|null)$/i.test(text) ? '' : text
}
const textList = (value: unknown): string[] => Array.isArray(value) ? value.map(cleanText).filter(Boolean) : []
const positiveInteger = (value: unknown): number | undefined => {
  if (Array.isArray(value)) return value.map(positiveInteger).find(value => value !== undefined)
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined
}
export const coverUrl = (id: unknown): string => {
  const cover = positiveInteger(id)
  return cover ? `https://covers.openlibrary.org/b/id/${cover}-M.jpg` : ''
}
export function selectEdition(work: OpenLibraryWork): OpenLibraryEdition | undefined {
  // Search API orders nested editions by relevance. Do not replace that order with page-count guesses.
  return Array.isArray(work.editions?.docs) ? work.editions.docs.find(edition => edition && (cleanText(edition.key) || cleanText(edition.title))) : undefined
}
export function mapSearchResult(work: OpenLibraryWork): BookSearchResult | undefined {
  if (!work || typeof work !== 'object') return undefined
  const title = cleanText(work.title)
  const id = cleanText(work.key)
  if (!id || !title) return undefined
  const edition = selectEdition(work)
  return {
    id, title, author: [...new Set(textList(work.author_name))].join(', '),
    cover: coverUrl(edition?.cover_i) || coverUrl(work.cover_i),
    year: positiveInteger(work.first_publish_year),
    publisher: textList(edition?.publisher).join(', ') || undefined,
    publishDate: textList(edition?.publish_date)[0],
    totalPages: positiveInteger(edition?.number_of_pages),
    isbn: textList(edition?.isbn)[0],
  }
}

const isIsbnQuery = (query: string) => /^(?:isbn:)?(?:\d{9}[\dXx]|\d{13})$/i.test(query.replace(/[\s-]/g, ''))
const normalizeTitle = (value: string) => value.normalize('NFKC').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
export function rankSearchResults(books: BookSearchResult[], query: string): BookSearchResult[] {
  if (isIsbnQuery(query)) return [...books]
  const term = normalizeTitle(query)
  if (!term) return [...books]
  const words = term.split(' ')
  const rank = (book: BookSearchResult) => {
    const title = normalizeTitle(book.title)
    if (title === term) return 0
    if (title.startsWith(term)) return 1
    if (title.includes(term) || words.every(word => title.split(' ').includes(word))) return 2
    return 3
  }
  // Only promote title matches; retain the API order within each group and keep every result.
  return books.map((book, index) => ({ book, index, rank: rank(book) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index).map(({ book }) => book)
}

let lastStartedAt = 0
let startQueue: Promise<void> = Promise.resolve()
const wait = (milliseconds: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
  signal.throwIfAborted()
  const abort = () => { clearTimeout(timer); reject(signal.reason) }
  const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, milliseconds)
  signal.addEventListener('abort', abort, { once: true })
})
async function fetchCatalogue(url: string, signal: AbortSignal): Promise<Response> {
  let request: Promise<Response> | undefined
  const turn = startQueue.catch(() => {}).then(async () => {
    signal.throwIfAborted()
    while (Date.now() < lastStartedAt + 1000) {
      await wait(lastStartedAt + 1000 - Date.now(), signal)
    }
    signal.throwIfAborted()
    const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(15_000)])
    request = fetch(url, { signal: requestSignal, headers: { Accept: 'application/json' } })
    // Record after fetch starts, not before its setup. Only starts are queued, not responses.
    lastStartedAt = Date.now()
  })
  startQueue = turn
  await turn
  if (!request) throw new Error('Catalogue request did not start')
  return request
}
export async function searchBooks(query: string, signal: AbortSignal): Promise<BookSearchResult[]> {
  const term = query.trim()
  if (term.length < 3) return []
  const isbn = term.replace(/[\s-]/g, '')
  const q = isIsbnQuery(isbn) ? `isbn:${isbn.replace(/^isbn:/i, '').toUpperCase()}` : term
  const params = new URLSearchParams({ q, limit: '10', fields })
  const response = await fetchCatalogue(`https://openlibrary.org/search.json?${params}`, signal)
  if (!response.ok) throw new Error('Catalogue unavailable')
  const data: OpenLibraryResponse = await response.json()
  if (!data || !Array.isArray(data.docs)) throw new Error('Invalid catalogue response')
  signal.throwIfAborted()
  const seen = new Set<string>()
  const books = data.docs.map(mapSearchResult).filter((book): book is BookSearchResult => {
    if (!book || seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
  return rankSearchResults(books, term).slice(0, 10)
}
