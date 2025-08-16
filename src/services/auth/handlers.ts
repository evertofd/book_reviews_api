import { Context } from 'moleculer';
import {
  RegisterParams,
  LoginParams,
  AuthResponse,
  VerifyTokenParams
} from '../../types/auth.types';
import {
  generateToken,
  checkEmailExists,
  checkAliasExists,
  createUser,
  validateUserCredentials,
  verifyUserExistsByToken,
  formatAuthResponse
} from './methods';

const getLogger = (ctx: Context) => {
  return ctx.service?.logger || console;
};


export const healthHandler = (_ctx: Context): object => {
  return {
    service: 'auth',
    status: 'ok',
    jwtConfigured: !!process.env.JWT_SECRET && process.env.JWT_SECRET !== 'default-secret-change-in-production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
};


export const registerHandler = async (ctx: Context<RegisterParams>): Promise<AuthResponse> => {
  try {
    const { email, password, alias } = ctx.params;
    const logger = getLogger(ctx);

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error('El email ya está registrado');
    }

    const aliasExists = await checkAliasExists(alias);
    if (aliasExists) {
      throw new Error('El alias ya está en uso');
    }

    const user = await createUser(email, password, alias);
    const token = generateToken(user);

    ctx.broker.emit('user.registered', {
      userId: user._id,
      email,
      alias
    });
    logger.info(`Usuario registrado exitosamente: ${email}`);

    return {
      ...formatAuthResponse(user, token),
      message: 'Usuario registrado exitosamente'
    };

  } catch (error: any) {
    const logger = getLogger(ctx);
    logger.error('Error registrando usuario:', error.message);
    throw new Error(`Error en registro: ${error.message}`);
  }
};


export const loginHandler = async (ctx: Context<LoginParams>): Promise<AuthResponse> => {
  try {
    const { email, password } = ctx.params;
    const logger = getLogger(ctx);

    const user = await validateUserCredentials(email, password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user);
    logger.info(`Login exitoso: ${email}`);

    return {
      ...formatAuthResponse(user, token),
      message: 'Login exitoso'
    };

  } catch (error: any) {
    const logger = getLogger(ctx);
    logger.error('❌ Error en login:', error.message);
    throw new Error(`Error en login: ${error.message}`);
  }
};


export const verifyTokenHandler = async (ctx: Context<VerifyTokenParams>) => {
  try {
    const { token } = ctx.params;

    const { decoded } = await verifyUserExistsByToken(token);

    return decoded;

  } catch (error: any) {
    const logger = getLogger(ctx);
    logger.warn(`Token inválido: ${error.message}`);
    throw new Error('Token inválido o expirado');
  }
};


export const logoutHandler = (ctx: Context): object => {
  const logger = getLogger(ctx);

  logger.info('Usuario deslogueado');

  return {
    success: true,
    message: 'Logout exitoso'
  };
};


export const getCurrentUserHandler = async (ctx: Context<VerifyTokenParams>): Promise<object> => {
  try {
    const { token } = ctx.params;
    const { user } = await verifyUserExistsByToken(token);

    return {
      success: true,
      user: user.toPublicJSON()
    };

  } catch (error: any) {
    throw new Error(`Error obteniendo usuario: ${error.message}`);
  }
};