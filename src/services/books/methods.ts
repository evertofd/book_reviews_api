import axios from 'axios';
import { OpenLibraryBook } from '../../types/database.types';
import { booksServiceConfig } from './config';
import SavedBook from '../../models/SavedBook.model';


export const searchOpenLibrary = async (query: string, limit: number, offset: number): Promise<OpenLibraryBook[]> => {
  const url = `${booksServiceConfig.openLibraryBaseUrl}${booksServiceConfig.endpoints.search}`;

  const response = await axios.get(url, {
    params: {
      title: query,
      limit,
      offset,
      fields: 'key,title,author_name,first_publish_year,cover_i,isbn,edition_count,has_fulltext'
    },
    timeout: 10000
  });

  return response.data.docs || [];
};


export const processBooks = async (docs: any[], userId?: string) => {
  let userBooks = [];
  if (userId) {
    userBooks = await SavedBook.find({ userId }).select('title author isbn openLibraryId');
  }

  const books = docs.map(doc => {
    const book = {
      title: doc.title,
      author: doc.author_name?.[0] || 'Autor desconocido',
      publishYear: doc.first_publish_year?.toString() || '',
      coverId: doc.cover_i,
      coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
      openLibraryId: doc.key,
      isbn: doc.isbn?.[0] || '',
      inLibrary: false,
      hasFulltext: doc.has_fulltext || false,
      editionCount: doc.edition_count || 0
    };

    if (userId && userBooks.length > 0) {
      const isInLibrary = userBooks.some(savedBook =>
        savedBook.openLibraryId === book.openLibraryId ||
        (book.isbn && savedBook.isbn === book.isbn) ||
        (savedBook.title.toLowerCase() === book.title.toLowerCase() &&
          savedBook.author.toLowerCase() === book.author.toLowerCase())
      );

      if (isInLibrary) {
        book.inLibrary = true;
        const savedBook = userBooks.find((sb: any) =>
          sb.openLibraryId === book.openLibraryId ||
          sb.isbn === book.isbn ||
          (sb.title.toLowerCase() === book.title.toLowerCase() &&
            sb.author.toLowerCase() === book.author.toLowerCase())
        );
        if (isInLibrary && savedBook) {
          const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';
          book.coverUrl = `${API_BASE}/api/public/books/library/front-cover/${savedBook._id}`;
        }
      }
    }

    return book;
  });

  return books;
};


export const saveSearchHistory = async (query: string, userId: string, broker: any): Promise<void> => {
  await broker.call('search.saveSearch', { query, userId });
};


export const validateSearchParams = (query: string, limit: number, offset: number): void => {
  if (!query || query.trim().length < 1) {
    throw new Error('Query es requerido');
  }

  if (limit < 1 || limit > booksServiceConfig.search.maxLimit) {
    throw new Error(`Limit debe estar entre 1 y ${booksServiceConfig.search.maxLimit}`);
  }

  if (offset < 0) {
    throw new Error('Offset no puede ser negativo');
  }
};