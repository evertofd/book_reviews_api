import { Service, ServiceBroker } from 'moleculer';
import dotenv from 'dotenv';
import { booksServiceConfig, validateBooksConfig } from './config';
import { healthHandler, searchHandler } from './handlers';

dotenv.config();

export default class BooksService extends Service {

  constructor(broker: ServiceBroker) {
    super(broker);

    validateBooksConfig();

    this.parseServiceSchema({
      name: booksServiceConfig.name,
      settings: booksServiceConfig,
      actions: {

        health: {
          handler: healthHandler
        },

        search: {
          cache: {
            enabled: booksServiceConfig.cache.enabled,
            ttl: booksServiceConfig.cache.ttlSeconds
          },
          params: {
            q: { type: 'string', min: 1, max: 100 },
            limit: { type: 'number', integer: true, min: 1, max: 50, optional: true },
            offset: { type: 'number', integer: true, min: 0, optional: true }
          },
          handler: searchHandler
        }
      },


      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }


  async serviceCreated(): Promise<void> {
    this.logger.info('Books Service creado');
  }


  async serviceStarted(): Promise<void> {
    this.logger.info('Books Service iniciado');
    this.logger.info(`OpenLibrary URL: ${booksServiceConfig.openLibraryBaseUrl}`);
  }


  async serviceStopped(): Promise<void> {
    this.logger.info('Books Service detenido');
  }
}