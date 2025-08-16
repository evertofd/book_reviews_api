import { JWTConfig } from '../../types/auth.types';

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400,
  algorithm: 'HS256'
};

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


export const validateAuthConfig = (): void => {
  if (jwtConfig.secret === 'default-secret-change-in-production') {
    console.warn('Usando JWT secret por defecto - CAMBIAR EN PRODUCCIÓN');
  }

  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET no está definido en variables de entorno');
  }
};