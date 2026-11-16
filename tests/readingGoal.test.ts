import test from 'node:test'
import assert from 'node:assert/strict'
import { demoBooks } from '../src/data/demoBooks.ts'
import { DEFAULT_READING_GOAL, isValidReadingGoal, loadReadingGoal, readingGoalProgress, READING_GOAL_KEY, saveReadingGoal } from '../src/data/readingGoal.ts'

test('demo library has nine consistent books, four notes and six public-domain quotes', () => {
  assert.equal(demoBooks.length, 9)
  assert.equal(new Set(demoBooks.map(book => book.id)).size, 9)
  assert.equal(demoBooks.filter(book => book.status === 'reading').length, 3)
  assert.equal(demoBooks.filter(book => book.status === 'read').length, 5)
  assert.equal(demoBooks.filter(book => book.status === 'want-to-read').length, 1)
  assert.equal(demoBooks.filter(book => book.notes).length, 4)
  const quotes = demoBooks.flatMap(book => book.quotes ?? [])
  assert.equal(quotes.length, 6)
  assert.equal(new Set(quotes.map(quote => quote.id)).size, 6)
  assert.equal(new Set(quotes.map(quote => quote.createdAt)).size, 6)
  for (const book of demoBooks) {
    if (book.status === 'read') assert.equal(book.currentPage, book.totalPages)
    if (book.status === 'reading') assert((book.currentPage ?? 0) > 0 && book.currentPage! < book.totalPages!)
    if (['The Midnight Library', 'Pachinko'].includes(book.title)) assert.equal(book.quotes?.length ?? 0, 0)
  }
})

test('reading goal validation and progress stay finite and bounded', () => {
  for (const value of [0, -1, 1.5, NaN, Infinity, '12', Number.MAX_SAFE_INTEGER + 1]) assert.equal(isValidReadingGoal(value), false)
  assert.equal(isValidReadingGoal(12), true)
  assert.equal(readingGoalProgress(5, 12), 42)
  assert.equal(readingGoalProgress(13, 12), 100)
  assert.equal(readingGoalProgress(0, 12), 0)
  assert.equal(readingGoalProgress(5, 0), 0)
  assert.equal(readingGoalProgress(NaN, 12), 0)
})

test('goal uses only its own key and safely handles missing, malformed and unavailable storage', t => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const entries = new Map([['book-tracker-library', '[{"id":"my-book"}]']])
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
  } })
  t.after(() => { if (original) Object.defineProperty(globalThis, 'localStorage', original); else Reflect.deleteProperty(globalThis, 'localStorage') })
  assert.equal(loadReadingGoal(), DEFAULT_READING_GOAL)
  for (const saved of ['oops', 'null', '-3', '0', '1.5', '"12"']) {
    entries.set(READING_GOAL_KEY, saved)
    assert.equal(loadReadingGoal(), 12)
  }
  assert.equal(saveReadingGoal(8), true)
  assert.equal(loadReadingGoal(), 8)
  assert.equal(entries.get('book-tracker-library'), '[{"id":"my-book"}]')
  assert.equal(saveReadingGoal(-1), false)
  assert.equal(loadReadingGoal(), 8)
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw new Error('Storage denied') } })
  assert.equal(loadReadingGoal(), 12)
  assert.equal(saveReadingGoal(8), false)
})
