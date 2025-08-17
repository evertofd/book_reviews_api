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
  /**
   * @Everto Farias
   * @description: Inicializa servicio de autenticación con validación de config, acciones JWT y eventos de usuario
   * @return: void - Configura servicio con validaciones estrictas y manejo de tokens
   */
  constructor(broker: ServiceBroker) {
    super(broker);

    validateAuthConfig();

    this.parseServiceSchema({
      name: authServiceConfig.name,
      settings: authServiceConfig,
      actions: {
        /**
         * @Everto Farias
         * @description: Endpoint de health check para verificar estado del servicio de autenticación
         * @return: Object - Estado del servicio y conectividad con base de datos
         */
        health: {
          handler: healthHandler
        },
        /**
         * @Everto Farias
         * @description: Registra nuevo usuario validando email, password y alias según configuración
         * @return: Object - Usuario creado con token JWT y datos básicos
         */
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
        /**
         * @Everto Farias
         * @description: Autentica usuario existente con email y password, genera token JWT
         * @return: Object - Token JWT y datos del usuario autenticado
         */
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
        /**
         * @Everto Farias
         * @description: Verifica validez de token JWT y retorna datos del usuario
         * @return: Object - Usuario decodificado del token si es válido
         */
        verifyToken: {
          params: {
            token: { type: 'string'}
          },
          handler: verifyTokenHandler
        },
        /**
         * @Everto Farias
         * @description: Maneja cierre de sesión del usuario (invalidación de token)
         * @return: Object - Confirmación de logout exitoso
         */
        logout: {
          handler: logoutHandler
        },
        /**
         * @Everto Farias
         * @description: Obtiene datos del usuario actual desde el contexto autenticado
         * @return: Object - Información del usuario logueado
         */
        getCurrentUser: {
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
    this.logger.info(` Evento - Usuario registrado: ${payload.email}`);
  }


  async serviceCreated(): Promise<void> {
    this.logger.info('Auth Service creado');
  }
  /**
   * @Everto Farias
   * @description: Hook de inicio que conecta a base de datos y muestra configuración JWT
   * @return: Promise<void> - Establece conexión DB y registra configuración
   */
  async serviceStarted(): Promise<void> {
    this.logger.info('Auth Service iniciado');
    await connectToDatabase();
    this.logger.info(`JWT configurado - expires: ${authServiceConfig.jwt.expiresIn}`);
  }

  async serviceStopped(): Promise<void> {
    this.logger.info('Auth Service detenido');
  }
}