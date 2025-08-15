import { Document, ObjectId } from 'mongoose';

/**
 * Interface base para todos los documentos de MongoDB
 */
export interface BaseDocument extends Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para el modelo User
 */
export interface IUser extends BaseDocument {
  email: string;
  password: string;
  alias: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para el modelo SavedBook (Mi Biblioteca)
 */
export interface ISavedBook extends BaseDocument {
  userId: ObjectId;
  title: string;
  author: string;
  publishYear: string;
  coverBase64: string;
  review: string;
  rating: number; // 1-5
  openLibraryId?: string;
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface ISearchHistory extends BaseDocument {
  userId: ObjectId;
  query: string;
  createdAt: Date;
}


export interface OpenLibraryBook {
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key: string;
  isbn?: string[];
  edition_count?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ia?: string[];
  language?: string[];
  publisher?: string[];
  publish_date?: string[];
  publish_year?: number[];
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
  numFound: number;
  num_found: number; 
  start: number;
  numFoundExact?: boolean;
}