import type { Book } from '../types/book'

// Illustrative page counts, not a catalogue of specific editions. Quotes omit page numbers
// because pagination varies by edition. Covers may be translated editions of the same work.
// The seven classic-edition ISBNs were matched to titles/authors in:
// https://github.com/zygmuntz/goodbooks-10k/blob/master/books.csv
// Static ISBN URLs; default=false requests an HTTP error for missing covers, so BookCover falls back.
export const demoBooks: Book[] = [
  {
    id: 'demo-master', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', cover: 'https://covers.openlibrary.org/b/isbn/9780679760801-L.jpg?default=false',
    status: 'reading', totalPages: 480, currentPage: 192, startedAt: '2026-10-28',
    notes: 'Пока сильнее всего цепляет московская сатира: смешно, а через страницу уже не по себе. Мистическая линия совсем не кажется отдельной от повседневной. Интересно, как изменится это ощущение, когда история Мастера и Маргариты выйдет на первый план.',
  },
  {
    id: 'demo-crime', title: 'Преступление и наказание', author: 'Фёдор Достоевский', cover: 'https://covers.openlibrary.org/b/isbn/9780143058144-L.jpg?default=false',
    status: 'read', totalPages: 672, currentPage: 672, rating: 5, startedAt: '2026-01-12', finishedAt: '2026-02-24',
    notes: 'Думал, что буду следить прежде всего за спором идей, но всё время возвращался к состоянию Раскольникова. Его теория звучит уверенно только на расстоянии от живого человека. После чтения хочется немного помолчать, а не сразу объяснять, кто здесь прав.',
    quotes: [
      { id: 'demo-quote-crime-1', text: 'Тварь ли я дрожащая или право имею?', createdAt: '2026-02-17T18:20:00Z' },
      { id: 'demo-quote-crime-2', text: 'Страдание и боль всегда обязательны для широкого сознания и глубокого сердца.', createdAt: '2026-02-23T19:10:00Z' },
    ],
  },
  {
    id: 'demo-hero', title: 'Герой нашего времени', author: 'Михаил Лермонтов', cover: 'https://covers.openlibrary.org/b/isbn/9780140441765-L.jpg?default=false',
    status: 'read', totalPages: 256, currentPage: 256, rating: 4, startedAt: '2026-03-08', finishedAt: '2026-03-19',
    quotes: [
      { id: 'demo-quote-hero-1', text: 'Из двух друзей всегда один раб другого.', createdAt: '2026-03-14T11:30:00Z' },
      { id: 'demo-quote-hero-2', text: 'Я люблю сомневаться во всём.', createdAt: '2026-03-18T17:45:00Z' },
    ],
  },
  {
    id: 'demo-fathers', title: 'Отцы и дети', author: 'Иван Тургенев', cover: 'https://covers.openlibrary.org/b/isbn/9780451529695-L.jpg?default=false',
    status: 'want-to-read', totalPages: 288,
  },
  {
    id: 'demo-onegin', title: 'Евгений Онегин', author: 'Александр Пушкин', cover: 'https://covers.openlibrary.org/b/isbn/9780192838995-L.jpg?default=false',
    status: 'read', totalPages: 224, currentPage: 224, rating: 5, startedAt: '2025-12-27', finishedAt: '2026-01-09',
    notes: 'При перечитывании совсем иначе смотрю на Татьяну и Онегина. Раньше хотелось поскорее узнать, что будет дальше, а теперь замечаю паузы и несказанное. Пожалуй, книга меняется не меньше, чем сам читатель.',
    quotes: [
      { id: 'demo-quote-onegin-1', text: 'Мы все учились понемногу\nЧему-нибудь и как-нибудь', createdAt: '2026-01-02T09:15:00Z' },
      { id: 'demo-quote-onegin-2', text: 'Привычка свыше нам дана:\nЗамена счастию она.', createdAt: '2026-01-08T20:05:00Z' },
    ],
  },
  {
    id: 'demo-anna', title: 'Анна Каренина', author: 'Лев Толстой', cover: 'https://covers.openlibrary.org/b/isbn/9780345803924-L.jpg?default=false',
    status: 'reading', totalPages: 864, currentPage: 173, startedAt: '2026-10-04',
  },
  {
    id: 'demo-1984', title: '1984', author: 'George Orwell', cover: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg?default=false',
    status: 'read', totalPages: 328, currentPage: 328, rating: 5, startedAt: '2026-05-03', finishedAt: '2026-05-15',
  },
  {
    id: 'demo-midnight', title: 'The Midnight Library', author: 'Matt Haig',
    cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg?default=false',
    status: 'read', totalPages: 304, currentPage: 304, rating: 4, startedAt: '2026-08-09', finishedAt: '2026-08-17',
    notes: 'Поймал себя на привычке представлять чужую жизнь более удачной, чем свою. Мне понравилось, что после этой истории захотелось не выбирать идеальную версию прошлого, а внимательнее отнестись к тому, что есть сейчас.',
  },
  {
    id: 'demo-pachinko', title: 'Pachinko', author: 'Min Jin Lee',
    cover: 'https://covers.openlibrary.org/b/isbn/9781455563937-L.jpg?default=false',
    status: 'reading', totalPages: 496, currentPage: 74, startedAt: '2026-11-06',
  },
]
