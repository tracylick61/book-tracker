import { useEffect, useRef, useState } from 'react'
import { searchBooks, type BookSearchResult } from '../api/openLibrary'

type SearchState = { query: string; status: 'loading' | 'results' | 'empty' | 'error'; books: BookSearchResult[] }
export function useBookSearch(active: boolean) {
  const [query, setRawQuery] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<SearchState | null>(null)
  const completed = useRef<SearchState | null>(null)
  const immediate = useRef(false)
  const cancel = useRef<(() => void) | null>(null)
  const sequence = useRef(0)
  const term = query.trim()
  const setQuery = (value: string) => {
    if (value.trim() === term) { setRawQuery(value); return }
    cancel.current?.()
    completed.current = null
    sequence.current++
    immediate.current = false
    setRawQuery(value)
  }
  const searchNow = () => {
    if (term.length < 3) return
    cancel.current?.()
    sequence.current++
    completed.current = null
    immediate.current = true
    setAttempt(value => value + 1)
  }
  useEffect(() => {
    if (!active || term.length < 3 || completed.current?.query === term) return
    const controller = new AbortController()
    const ticket = ++sequence.current
    const timer = setTimeout(async () => {
      setState({ query: term, status: 'loading', books: [] })
      try {
        const books = await searchBooks(term, controller.signal)
        if (controller.signal.aborted || sequence.current !== ticket) return
        const result: SearchState = { query: term, status: books.length ? 'results' : 'empty', books }
        completed.current = result
        setState(result)
      } catch {
        if (!controller.signal.aborted && sequence.current === ticket) setState({ query: term, status: 'error', books: [] })
      }
    }, immediate.current ? 0 : 800)
    immediate.current = false
    const abort = () => { clearTimeout(timer); controller.abort() }
    cancel.current = abort
    return abort
  }, [term, active, attempt])
  const view = term.length < 3 ? { status: 'initial' as const, books: [] } : state?.query === term ? state : { status: 'waiting' as const, books: [] }
  return { query, setQuery, searchNow, view }
}
