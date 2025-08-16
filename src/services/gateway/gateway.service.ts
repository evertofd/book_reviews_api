import { Service, ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { authenticateToken } from '../middlewares/auth.middleware';


export default class GatewayService extends Service {

  constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: 'gateway',
      mixins: [ApiGateway],

      settings: {

        port: process.env.PORT || 3000,


        cors: {
          origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          credentials: true
        },


        routes: [
          {

            path: '/api/public',
            authorization: false,
            whitelist: [
              'auth.health',
              'auth.register',
              'auth.login',
              'books.health'
            ],
            aliases: {
              'GET /auth/health': 'auth.health',
              'POST /auth/register': 'auth.register',
              'POST /auth/login': 'auth.login',
              'GET /books/health': 'books.health'
            },
          },
          {

            path: '/api',
            authorization: true,
            whitelist: [
              'books.*',
              'library.*',
              'search.*',
              'auth.logout',
              'auth.getCurrentUser'
            ],

            aliases: {
              // Books endpoints 
              'GET /books/search': 'books.search',
              'GET /books/last-search': 'search.getLastSearches',

              // Library endpoints 
              'POST /books/my-library': 'library.saveBook',
              'GET /books/my-library': 'library.getMyBooks',
              'GET /books/my-library/:id': 'library.getBook',
              'PUT /books/my-library/:id': 'library.updateBook',
              'DELETE /books/my-library/:id': 'library.deleteBook',

              // Auth endpoints 
              'POST /auth/logout': 'auth.logout',
              'GET /auth/me': 'auth.getCurrentUser'
            },
          }
        ],

        assets: {
          folder: 'public',
          options: {}
        },

        onError(_req: any, res: any, err: any) {
          console.error(' Gateway Error:', err.message);

          res.writeHead(err.code || 500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });

          res.end(JSON.stringify({
            success: false,
            error: err.message || 'Error interno del servidor',
            code: err.code || 500,
            timestamp: new Date().toISOString()
          }));
        }
      },


      methods: {
        async authorize(ctx: any, route: any, req: any) {
          return await authenticateToken(ctx, route, req);
        }
      },


      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }


  async serviceCreated(): Promise<void> {
    this.logger.info('Gateway Service creado');
  }


  async serviceStarted(): Promise<void> {
    const port = this.settings.port;
    this.logger.info(`API Gateway iniciado en puerto ${port}`);
    this.logger.info(`API disponible en: http://localhost:${port}/api`);
    this.logger.info(`Health check: http://localhost:${port}/api/auth/health`);
  }

  async serviceStopped(): Promise<void> {
    this.logger.info('🌐 Gateway Service detenido');
  }
}