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
  /**
   * @Everto Farias
   * @description: Inicializa servicio de historial de búsquedas con validación de configuración y acciones
   * @return: void - Configura servicio para gestión de historial y estadísticas de búsqueda
   */
  constructor(broker: ServiceBroker) {
    super(broker);

    validateSearchConfig();

    this.parseServiceSchema({
      name: searchServiceConfig.name,
      settings: searchServiceConfig,
      actions: {
        /**
         * @Everto Farias
         * @description: Endpoint de health check para verificar estado del servicio de búsquedas
         * @return: Object - Estado del servicio con timestamp
         */
        health: {
          handler: healthHandler
        },
        /**
         * @Everto Farias
         * @description: Obtiene las últimas 5 búsquedas del usuario según requerimientos
         * @return: Object - Array con historial de búsquedas recientes
         */
        getLastSearches: {
          handler: getLastSearchesHandler
        },
        /**
         * @Everto Farias
         * @description: Guarda nueva búsqueda en historial del usuario con validación de parámetros
         * @return: Object - Confirmación de búsqueda guardada
         */
        saveSearch: {
          params: {
            query: { type: 'string', min: 1, max: 100 },
            userId: { type: 'string', min: 1 }
          },
          handler: saveSearchHandler
        },
        /**
         * @Everto Farias
         * @description: Obtiene estadísticas de búsquedas del usuario
         * @return: Object - Estadísticas de uso del historial de búsquedas
         */
        getStats: {
          handler: getSearchStatsHandler
        }
      },

      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }

  /**
   * @Everto Farias
   * @description: Hooks de ciclo de vida del servicio cuando se crea
   * @return: Promise<void> - Registra estados del servicio
  */
  async serviceCreated(): Promise<void> {
    this.logger.info('Search Service creado');
  }

  /**
   * @Everto Farias
   * @description: Hooks de ciclo de vida del servicio cuando se inicia
   * @return: Promise<void> - Registra estados del servicio
  */
  async serviceStarted(): Promise<void> {
    this.logger.info('Search Service iniciado');
  }
  /**
   * @Everto Farias
   * @description: Hooks de ciclo de vida del servicio cuando se detiene
   * @return: Promise<void> - Registra estados del servicio
  */
  async serviceStopped(): Promise<void> {
    this.logger.info('Search Service detenido');
  }
}