
export interface BookSearchParams {
  q: string;
  limit?: number;
  offset?: number;
}


export interface ProcessedBook {
  title: string;
  author: string;
  publishYear: string;
  coverId?: number;
  coverUrl?: string;
  openLibraryId: string;
  isbn?: string;
  inLibrary: boolean; 
  hasFulltext?: boolean;
  editionCount?: number;
}


export interface BookSearchResponse {
  success: boolean;
  message: string;
  books: ProcessedBook[];
  total: number;
  query: string;
  timestamp: string;
}


export interface BooksServiceSettings {
  openLibraryBaseUrl: string;
  searchEndpoint: string;
  coverBaseUrl: string;
  defaultLimit: number;
  maxLimit: number;
  cacheTimeout: number; 
}


export interface BooksContext {
  params: BookSearchParams;
  meta: {
    user?: {
      _id: string;
      email: string;
      alias: string;
    };
    userAgent?: string;
    clientIP?: string;
  };
}