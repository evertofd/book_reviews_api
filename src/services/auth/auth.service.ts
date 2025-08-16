import { Service, ServiceBroker } from 'moleculer';
import dotenv from 'dotenv';
import { connectToDatabase } from '../../utils/database';
import { authServiceConfig, validateAuthConfig } from './config';
import {
  healthHandler,
  registerHandler,
  loginHandler,
  verifyTokenHandler,
  logoutHandler,
  getCurrentUserHandler
} from './handlers';

dotenv.config();

export default class AuthService extends Service {

  constructor(broker: ServiceBroker) {
    super(broker);

    validateAuthConfig();

    this.parseServiceSchema({
      name: authServiceConfig.name,
      settings: authServiceConfig,
      actions: {
        health: {
          handler: healthHandler
        },
        register: {
          params: {
            email: {
              type: 'string',
              min: authServiceConfig.validation.email.min,
              max: authServiceConfig.validation.email.max
            },
            password: {
              type: 'string',
              min: authServiceConfig.validation.password.min,
              max: authServiceConfig.validation.password.max
            },
            alias: {
              type: 'string',
              min: authServiceConfig.validation.alias.min,
              max: authServiceConfig.validation.alias.max
            }
          },
          handler: registerHandler
        },
        login: {
          params: {
            email: {
              type: 'string',
              min: authServiceConfig.validation.email.min,
              max: authServiceConfig.validation.email.max
            },
            password: {
              type: 'string',
              min: authServiceConfig.validation.password.min,
              max: authServiceConfig.validation.password.max
            }
          },
          handler: loginHandler
        },

        verifyToken: {
          params: {
            token: { type: 'string', min: 10 }
          },
          handler: verifyTokenHandler
        },

        logout: {
          handler: logoutHandler
        },

        getCurrentUser: {
          params: {
            token: { type: 'string', min: 10 }
          },
          handler: getCurrentUserHandler
        }
      },

      events: {
        'user.registered': this.onUserRegistered
      },

      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped
    });
  }


  async onUserRegistered(payload: { userId: string; email: string; alias: string }): Promise<void> {
    this.logger.info(`📧 Evento - Usuario registrado: ${payload.email}`);
  }


  async serviceCreated(): Promise<void> {
    this.logger.info('Auth Service creado');
  }


  async serviceStarted(): Promise<void> {
    this.logger.info('Auth Service iniciado');
    await connectToDatabase();
    this.logger.info(`JWT configurado - expires: ${authServiceConfig.jwt.expiresIn}`);
  }

  async serviceStopped(): Promise<void> {
    this.logger.info('Auth Service detenido');
  }
}