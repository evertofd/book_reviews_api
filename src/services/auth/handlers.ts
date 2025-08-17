import { Context } from 'moleculer';
import {
  RegisterParams,
  LoginParams,
  AuthResponse,
  VerifyTokenParams,
  AuthContext
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

/**
 * @Everto Farias
 * @description: Obtiene logger del contexto del servicio o usa console como fallback
 * @return: Logger - Instancia de logger para registro de eventos
 */
const getLogger = (ctx: Context) => {
  return ctx.service?.logger || console;
};

/**
 * @Everto Farias
 * @description: Health check que verifica estado del servicio y configuración JWT
 * @return: Object - Estado completo con JWT configurado, uptime y timestamp
 */
export const healthHandler = (_ctx: Context): object => {
  return {
    service: 'auth',
    status: 'ok',
    jwtConfigured: !!process.env.JWT_SECRET && process.env.JWT_SECRET !== 'default-secret-change-in-production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
};

/**
 * @Everto Farias
 * @description: Registra nuevo usuario validando email/alias y crea el usuario.
 * @return: Promise<AuthResponse> - Usuario creado con token JWT y mensaje de éxito
 */
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

/**
 * @Everto Farias
 * @description: Autentica usuario con email/password, valida credenciales y genera token JWT
 * @return: Promise<AuthResponse> - Token JWT y datos del usuario autenticado
 */
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
    logger.error('Error en login:', error.message);
    throw new Error(`Error en login: ${error.message}`);
  }
};

/**
 * @Everto Farias
 * @description: Verifica validez de token JWT y retorna datos decodificados del usuario
 * @return: Promise<Object> - Usuario decodificado si el token es válido
 */
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

/**
 * @Everto Farias
 * @description: Maneja logout del usuario (stateless JWT, solo confirma acción)
 * @return: Object - Confirmación de logout exitoso
 */
export const logoutHandler = (ctx: Context): object => {
  const logger = getLogger(ctx);

  logger.info('Usuario deslogueado');

  return {
    success: true,
    message: 'Logout exitoso'
  };
};
/**
 * @Everto Farias
 * @description: Obtiene datos del usuario actual verificando token desde meta context
 * @return: Promise<Object> - Datos públicos del usuario autenticado
 */
export const getCurrentUserHandler = async (ctx: Context<AuthContext>): Promise<object> => {
  try {
    
    if (!(ctx.meta as any).user)  {
       throw new Error('Unauthorized');
    }
    const { user } = await verifyUserExistsByToken((ctx.meta as any).token); 
    return {
      success: true,
      user: user.toPublicJSON()
    };

  } catch (error: any) {
    throw new Error(`Error obteniendo usuario: ${error.message}`);
  }
};