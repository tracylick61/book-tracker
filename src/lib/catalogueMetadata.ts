import type { BookSearchResult } from '../api/openLibrary'

export function publicationLabels(result: Pick<BookSearchResult, 'year' | 'publishDate'>): string[] {
  const first = result.year ? `Впервые опубликовано: ${result.year}` : undefined
  const editionDate = result.publishDate?.trim()
  const editionYear = editionDate?.match(/\b\d{4}\b/)?.[0]
  // One year is enough when the selected edition belongs to the first publication year.
  const edition = editionDate && (!result.year || editionYear !== String(result.year)) ? `Издание: ${editionDate}` : undefined
  return [first, edition].filter((label): label is string => Boolean(label))
}
