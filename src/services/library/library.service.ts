
import { Service, ServiceBroker } from 'moleculer';
import dotenv from 'dotenv';
import { libraryServiceConfig, validateLibraryConfig } from './config';
import {
  healthHandler,
  saveBookHandler,
  getMyBooksHandler,
  getBookHandler,
  updateBookHandler,
  deleteBookHandler,
  getCoverHandler
} from './handlers';

dotenv.config();

export default class LibraryService extends Service {
  /**
   * @Everto Farias
   * @description: Inicializa servicio de biblioteca personal con CRUD completo y validaciones de parámetros
   * @return: void - Configura servicio con acciones para gestión de libros guardados
   */
  constructor(broker: ServiceBroker) {
    super(broker);

    validateLibraryConfig();

    this.parseServiceSchema({
      name: libraryServiceConfig.name,
      settings: libraryServiceConfig,
      actions: {
        /**
         * @Everto Farias
         * @description: Endpoint de health check para verificar estado del servicio de biblioteca
         * @return: Object - Estado del servicio con timestamp
         */
        health: {
          handler: healthHandler
        },
        /**
         * @Everto Farias
         * @description: Guarda libro en biblioteca personal con review, rating y portada en base64
         * @return: Object - Libro guardado con confirmación de éxito
         */
        saveBook: {
          params: {
            title: { type: 'string', min: 1, max: 200 },
            author: { type: 'string', min: 1, max: 100 },
            publishYear: { type: 'string' },
            coverBase64: { type: 'string', optional: true },
            review: { type: 'string', max: 500, optional: true },
            rating: { type: 'number', integer: true, min: 1, max: 5 },
            openLibraryId: { type: 'string', optional: true },
            isbn: { type: 'string', optional: true }
          },
          handler: saveBookHandler
        },
        /**
         * @Everto Farias
         * @description: Obtiene biblioteca del usuario con filtros de búsqueda, ordenamiento y exclusión
         * @return: Object - Lista paginada de libros con filtros aplicados
         */
        getMyBooks: {
          params: {
            limit: { type: 'number', integer: true, min: 1, max: 100, optional: true },
            offset: { type: 'number', integer: true, min: 0, optional: true },
            search: { type: 'string', min: 1, max: 100, optional: true },
            sortBy: {
              type: 'enum',
              values: ['rating-asc', 'rating-desc', 'title-asc', 'title-desc', 'newest', 'oldest'],
              optional: true
            },
            excludeNoReview: { type: 'string', optional: true }
          },
          handler: getMyBooksHandler
        },
        /**
         * @Everto Farias
         * @description: Obtiene un libro específico de la biblioteca del usuario por ID
         * @return: Object - Libro encontrado con todos sus datos
         */
        getBook: {
          params: {
            id: { type: 'string', min: 1 }
          },
          handler: getBookHandler
        },
        /**
         * @Everto Farias
         * @description: Actualiza review y calificación de un libro existente en la biblioteca
         * @return: Object - Libro actualizado con confirmación
         */
        updateBook: {
          params: {
            id: { type: 'string', min: 1 },
            review: { type: 'string', min: 1, max: 500 },
            rating: { type: 'number', integer: true, min: 1, max: 5 }
          },
          handler: updateBookHandler
        },
        /**
         * @Everto Farias
         * @description: Elimina libro de la biblioteca personal del usuario
         * @return: Object - Confirmación de eliminación exitosa
         */
        deleteBook: {
          params: {
            id: { type: 'string', min: 1 }
          },
          handler: deleteBookHandler
        },
        /**
         * @Everto Farias
         * @description: Retorna portada de libro guardado como imagen desde base64 almacenado
         * @return: Buffer - Imagen decodificada con headers HTTP apropiados
         */
        getCover: {
          params: {
            id: { type: 'string', min: 1 }
          },
          handler: getCoverHandler
        }
      },
      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }
  /**
 * @Everto Farias
 * @description: Hooks de ciclo de vida del servicio con logging informativo
 * @return: Promise<void> - Registra estados del servicio
 */
  async serviceCreated(): Promise<void> {
    this.logger.info('Library Service creado');
  }
  /**
   * @Everto Farias
   * @description: Hooks de ciclo de vida del servicio con logging informativo
   * @return: Promise<void> - Registra estados del servicio
   */
  async serviceStarted(): Promise<void> {
    this.logger.info('Library Service iniciado');
  }

  /**
   * @Everto Farias
   * @description: Hooks de ciclo de vida del servicio con logging informativo
   * @return: Promise<void> - Registra estados del servicio
   */
  async serviceStopped(): Promise<void> {
    this.logger.info('Library Service detenido');
  }
}