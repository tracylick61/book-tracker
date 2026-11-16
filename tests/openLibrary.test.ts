import test from 'node:test'
import assert from 'node:assert/strict'
import { coverUrl, mapSearchResult, searchBooks, selectEdition } from '../src/api/openLibrary.ts'
import { isDuplicateBook } from '../src/data/bookIdentity.ts'

test('catalogue mapping uses the first matching edition and omits missing metadata', () => {
  const work = { key: '/works/OL1W', title: ' Book ', author_name: [' A ', 'B', 'A'], cover_i: 10, first_publish_year: 1965,
    editions: { docs: [{ key: '/books/OL1M', publisher: ['Publisher'], publish_date: ['2001'], isbn: ['123'], number_of_pages: 304, cover_i: 20 }, { key: '/books/OL2M', number_of_pages: 900 }] } }
  assert.equal(selectEdition(work)?.key, '/books/OL1M')
  assert.deepEqual(mapSearchResult(work), { id: '/works/OL1W', title: 'Book', author: 'A, B', cover: 'https://covers.openlibrary.org/b/id/20-M.jpg', year: 1965, publisher: 'Publisher', publishDate: '2001', totalPages: 304, isbn: '123' })
  assert.equal(mapSearchResult({ ...work, editions: { docs: [{ key: '/books/OL1M' }] } })?.cover, coverUrl(10))
  const sparse = mapSearchResult({ key: '/works/OL3W', title: 'Sparse' })
  assert.equal(sparse?.author, '')
  assert.equal(sparse?.cover, '')
  assert.equal(sparse?.totalPages, undefined)
  assert.equal(mapSearchResult({ title: 'No identity' }), undefined)
  assert.equal(coverUrl(-1), '')
  assert.equal(mapSearchResult({ key: 'x', title: 'x', editions: { docs: [{ key: 'e', number_of_pages: [0, 12] }] } })?.totalPages, 12)
})

test('duplicates use normalized title and author, and allow editing the same book', () => {
  const books = [{ id: 'one', title: ' Ёж — в тумане ', author: 'ИВАН  ИВАНОВ', cover: '', status: 'read' as const }]
  const candidate = { title: 'еж в тумане', author: 'Иван Иванов' }
  assert.equal(isDuplicateBook(books, candidate), true)
  assert.equal(isDuplicateBook(books, candidate, 'one'), false)
  assert.equal(isDuplicateBook(books, { ...candidate, author: 'Другой автор' }), false)
})

test('search limits fields/results and frequency; recognizes ISBN; handles errors and cancellation', async t => {
  const calls: { at: number; url: URL }[] = []
  const mock = t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    calls.push({ at: Date.now(), url: new URL(String(input)) })
    return new Response(JSON.stringify({ docs: Array.from({ length: 15 }, (_, i) => ({ key: `work-${i}`, title: `Book ${i}` })) }))
  })
  const signal = new AbortController().signal
  assert.deepEqual(await searchBooks('ab', signal), [])
  assert.equal(calls.length, 0)
  const results = await searchBooks('Dune', signal)
  assert.equal(results.length, 10)
  await searchBooks('978-0-441-17271-9', signal)
  assert(calls[1].at - calls[0].at >= 1000)
  assert.equal(calls[1].url.searchParams.get('q'), 'isbn:9780441172719')
  assert.equal(calls[0].url.origin, 'https://openlibrary.org')
  assert.equal(calls[0].url.pathname, '/search.json')
  assert.equal(calls[0].url.searchParams.get('limit'), '10')
  assert(!calls[0].url.searchParams.get('fields')?.includes('*'))
  assert(calls[0].url.searchParams.get('fields')?.includes('editions.number_of_pages'))
  const aborted = new AbortController(); aborted.abort()
  await assert.rejects(searchBooks('cancelled', aborted.signal), { name: 'AbortError' })
  assert.equal(calls.length, 2)
  mock.mock.mockImplementation(async () => new Response('', { status: 503 }))
  await assert.rejects(searchBooks('outage', signal), /Catalogue unavailable/)
  mock.mock.mockImplementation(async () => new Response(JSON.stringify({ wrong: [] })))
  await assert.rejects(searchBooks('invalid', signal), /Invalid catalogue response/)
})
