import { Service, ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { authenticateToken } from '../middlewares/auth.middleware';
import { swaggerConfig } from '../../utils/swagger';


export default class GatewayService extends Service {

  constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: 'gateway',
      mixins: [ApiGateway],

      settings: {
        port: process.env.PORT || 3000,

        cors: {
          origin: [
            process.env.CORS_ORIGIN || 'http://localhost:3001',
            'http://localhost:3000'
          ],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          credentials: true
        },


        routes: [
          {

            path: '/api/public',
            whitelist: [
              'auth.health',
              'auth.register',
              'auth.login',
              'books.health',
              'library.getCover'
            ],
            aliases: {
              'GET /auth/health': 'auth.health',
              'POST /auth/register': 'auth.register',
              'POST /auth/login': 'auth.login',
              'GET /books/health': 'books.health',
              'GET /books/library/front-cover/:id': 'library.getCover',

            },

            bodyParsers: {
              json: {
                strict: false,
                limit: '10MB',
                type: ['application/json', 'application/*+json', 'text/plain']
              },
              urlencoded: {
                extended: true,
                limit: '10MB'
              },
              text: {
                limit: '10MB'
              }
            },
            mappingPolicy: 'all',
            logging: true
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

            bodyParsers: {
              json: { strict: false, limit: '10MB' },
              urlencoded: { extended: true, limit: '10MB' }
            },

            logging: true
          },

          {
            path: '/api-docs',

            aliases: {
              'GET /': (_req: any, res: any) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Book Reviews API Documentation</title>
                    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
                  </head>
                  <body>
                    <div id="swagger-ui"></div>
                    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
                    <script>
                      SwaggerUIBundle({
                        url: '/api-docs/swagger.json',
                        dom_id: '#swagger-ui',
                        presets: [
                          SwaggerUIBundle.presets.apis,
                          SwaggerUIBundle.presets.standalone
                        ]
                      });
                    </script>
                  </body>
                  </html>
                `);
              },
              'GET /swagger.json': (_req: any, res: any) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(swaggerConfig, null, 2));
              }
            }
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