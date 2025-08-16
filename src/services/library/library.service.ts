
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

  constructor(broker: ServiceBroker) {
    super(broker);

    validateLibraryConfig();

    this.parseServiceSchema({
      name: libraryServiceConfig.name,
      settings: libraryServiceConfig,
      actions: {
        health: {
          handler: healthHandler
        },
        saveBook: {
          params: {
            title: { type: 'string', min: 1, max: 200 },
            author: { type: 'string', min: 1, max: 100 },
            publishYear: { type: 'string' },
            coverBase64: { type: 'string', optional: true },
            review: { type: 'string', min: 1, max: 500 },
            rating: { type: 'number', integer: true, min: 1, max: 5 },
            openLibraryId: { type: 'string', optional: true },
            isbn: { type: 'string', optional: true }
          },
          handler: saveBookHandler
        },
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
            excludeNoReview: { type: 'boolean', optional: true }
          },
          handler: getMyBooksHandler
        },
        getBook: {
          params: {
            id: { type: 'string', min: 1 }
          },
          handler: getBookHandler
        },
        updateBook: {
          params: {
            id: { type: 'string', min: 1 },
            review: { type: 'string', min: 1, max: 500 },
            rating: { type: 'number', integer: true, min: 1, max: 5 }
          },
          handler: updateBookHandler
        },
        deleteBook: {
          params: {
            id: { type: 'string', min: 1 }
          },
          handler: deleteBookHandler
        },
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
  async serviceCreated(): Promise<void> {
    this.logger.info('Library Service creado');
  }

  async serviceStarted(): Promise<void> {
    this.logger.info('Library Service iniciado');
  }


  async serviceStopped(): Promise<void> {
    this.logger.info('Library Service detenido');
  }
}