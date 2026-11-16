export const readingDate = (value: string) => new Date(value).toLocaleDateString('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
})

export const quoteCount = (count: number) => {
  const n = count % 100
  const word = n >= 11 && n <= 19 ? 'цитат' : n % 10 === 1 ? 'цитата' : n % 10 >= 2 && n % 10 <= 4 ? 'цитаты' : 'цитат'
  return `${count} ${word}`
}
