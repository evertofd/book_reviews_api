import axios from 'axios';
import { OpenLibraryBook } from '../../types/database.types';
import { ProcessedBook } from '../../types/books.types';
import { booksServiceConfig } from './config';


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


export const processBooks = async (books: OpenLibraryBook[], _userId?: string): Promise<ProcessedBook[]> => {
  return books.map(book => ({
    title: book.title || 'Sin título',
    author: book.author_name ? book.author_name[0] : 'Autor desconocido',
    publishYear: book.first_publish_year ? book.first_publish_year.toString() : 'Año desconocido',
    coverId: book.cover_i,
    coverUrl: book.cover_i ? `${booksServiceConfig.endpoints.covers}/${book.cover_i}-M.jpg` : undefined,
    openLibraryId: book.key || '',
    isbn: book.isbn ? book.isbn[0] : undefined,
    inLibrary: false,
    hasFulltext: book.has_fulltext || false,
    editionCount: book.edition_count || 1
  }));
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