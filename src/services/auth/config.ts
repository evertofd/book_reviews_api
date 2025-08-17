import { JWTConfig } from '../../types/auth.types';

/**
 * @Everto Farias
 * @description: Configuración JWT con secret, expiración y algoritmo desde variables de entorno
 * @return: JWTConfig - Objeto tipado con configuración de tokens JWT
 */
export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'quiero_amigos_1',
  expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400,
  algorithm: 'HS256'
};
/**
 * @Everto Farias
 * @description: Configuración centralizada del servicio Auth con validaciones, JWT y logging
 * @return: Object - Configuración completa para autenticación y validación de campos
 */
export const authServiceConfig = {
  name: 'auth',

  jwt: jwtConfig,
  validation: {
    email: {
      min: 5,
      max: 100
    },
    password: {
      min: 6,
      max: 100
    },
    alias: {
      min: 3,
      max: 20
    }
  },

  logging: {
    logSuccessfulAuth: true,
    logFailedAuth: true,
    logTokenValidation: false
  }
};

/**
 * @Everto Farias
 * @description: Valida que el JWT_SECRET esté definido en variables de entorno
 * @return: void - Registra warning si JWT_SECRET no está configurado
 */
export const validateAuthConfig = (): void => {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET no está definido en variables de entorno');
  }
};