import { Service, ServiceBroker } from 'moleculer';
import dotenv from 'dotenv';
import { searchServiceConfig, validateSearchConfig } from './config';
import {
  healthHandler,
  getLastSearchesHandler,
  saveSearchHandler,
  getSearchStatsHandler
} from './handlers';

dotenv.config();


export default class SearchService extends Service {

  constructor(broker: ServiceBroker) {
    super(broker);

    validateSearchConfig();

    this.parseServiceSchema({
      name: searchServiceConfig.name,
      settings: searchServiceConfig,
      actions: {
        health: {
          handler: healthHandler
        },

        getLastSearches: {
          handler: getLastSearchesHandler
        },

        saveSearch: {
          params: {
            query: { type: 'string', min: 1, max: 100 },
            userId: { type: 'string', min: 1 }
          },
          handler: saveSearchHandler
        },

        getStats: {
          handler: getSearchStatsHandler
        }
      },

      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }


  async serviceCreated(): Promise<void> {
    this.logger.info('Search Service creado');
  }


  async serviceStarted(): Promise<void> {
    this.logger.info('Search Service iniciado');
  }

  async serviceStopped(): Promise<void> {
    this.logger.info('Search Service detenido');
  }
}