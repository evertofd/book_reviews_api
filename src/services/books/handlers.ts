import { Context } from 'moleculer';
import { BookSearchParams, BookSearchResponse } from '../../types/books.types';
import { searchOpenLibrary, processBooks, saveSearchHistory, validateSearchParams } from './methods';

/**
 * @Everto Farias
 * @description: Handler de health check que retorna el estado actual del servicio Books
 * @return: Promise<Object> - Objeto con servicio, status ok y timestamp actual
 */
export const healthHandler = async (_ctx: Context) => ({
  service: 'books',
  status: 'ok',
  timestamp: new Date().toISOString()
});

/**
 * @Everto Farias
 * @description: Handler principal de búsqueda de libros en OpenLibrary, procesa resultados y guarda historial
 * @return: Promise<BookSearchResponse> - Respuesta con libros encontrados, total, query y metadata
 */
export const searchHandler = async (ctx: Context<BookSearchParams>): Promise<BookSearchResponse> => {
  const { q: query, limit = 10, offset = 0 } = ctx.params;
  const user = (ctx.meta as any).user;
  const logger = ctx.service?.logger || console;

  try {
    validateSearchParams(query, limit, offset);
    const docs = await searchOpenLibrary(query, limit, offset);

    if (!docs || docs.length === 0) {
      logger.info(` No se encontraron libros para: "${query}"`);
      return {
        success: false,
        message: 'No encontramos libros con el título ingresado',
        books: [],
        total: 0,
        query,
        timestamp: new Date().toISOString()
      };
    }

    const books = await processBooks(docs, user?._id);

    if (user) {
      saveSearchHistory(query, user._id, ctx.broker).catch(err =>
        logger.warn('Error guardando historial:', err.message)
      );
    }

    logger.info(`Búsqueda completada - ${books.length} libros`);

    return {
      success: true,
      message: `Se encontraron ${books.length} libros`,
      books,
      total: docs.length,
      query,
      timestamp: new Date().toISOString()
    };

  } catch (error: any) {
    logger.error(`Error al buscar libros:`, error.message);
    throw new Error('Error al buscar libros');
  }
};