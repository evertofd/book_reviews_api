import { Service, ServiceBroker } from 'moleculer';
import dotenv from 'dotenv';
import { booksServiceConfig, validateBooksConfig } from './config';
import { healthHandler, searchHandler } from './handlers';

dotenv.config();

export default class BooksService extends Service {
  /**
   * @Everto Farias
   * @description: Inicializa el servicio de búsqueda de libros con validación de configuración y acciones definidas
   * @return: void - Configura el servicio con cache, validación de parámetros y handlers
   */
  constructor(broker: ServiceBroker) {
    super(broker);

    validateBooksConfig();

    this.parseServiceSchema({
      name: booksServiceConfig.name,
      settings: booksServiceConfig,
      actions: {
        /**
         * @Everto Farias
         * @description: Endpoint de health check para verificar el estado del servicio de libros
         * @return: Object - Estado del servicio y conectividad con OpenLibrary API
         */
        health: {
          handler: healthHandler
        },
        /**
         * @Everto Farias
         * @description: Busca libros en OpenLibrary API usando query string, con cache y validación de parámetros
         * @return: Object - Resultados de búsqueda con máximo 10 libros (título, portada, etc.)
         */
        search: {
          cache: {
            enabled: booksServiceConfig.cache.enabled,
            ttl: booksServiceConfig.cache.ttlSeconds
          },
          params: {
            q: { type: 'string', min: 1, max: 100 },
            limit: { type: 'string', integer: true, min: 1, max: 50, optional: true },
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
  /**
   * @Everto Farias
   * @description: Hook de ciclo de vida ejecutado cuando el servicio Books es creado
   * @return: Promise<void> - Registra log de creación del servicio
   */

  async serviceCreated(): Promise<void> {
    this.logger.info('Books Service creado');
  }

  /**
   * @Everto Farias
   * @description: Hook de ciclo de vida ejecutado al iniciar el servicio, muestra configuración de OpenLibrary
   * @return: Promise<void> - Registra logs con URL base de OpenLibrary configurada
   */
  async serviceStarted(): Promise<void> {
    this.logger.info('Books Service iniciado');
    this.logger.info(`OpenLibrary URL: ${booksServiceConfig.openLibraryBaseUrl}`);
  }

  /**
   * @Everto Farias
   * @description: Hook de ciclo de vida ejecutado cuando el servicio Books se detiene
   * @return: Promise<void> - Registra log de detención del servicio
   */

  async serviceStopped(): Promise<void> {
    this.logger.info('Books Service detenido');
  }
}