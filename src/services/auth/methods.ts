import jwt from 'jsonwebtoken';
import { JWTPayload } from '../../types/auth.types';
import { jwtConfig } from './config';
import User from '../../models/User.model';

/**
 * @Everto Farias
 * @description: Genera token JWT con payload del usuario y configuración de expiración
 * @return: string - Token JWT firmado con secret configurado
 */
export const generateToken = (user: any): string => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    _id: user._id.toString(),
    email: user.email,
    alias: user.alias
  };

  const options: jwt.SignOptions = {
    expiresIn: jwtConfig.expiresIn
  };

  return jwt.sign(payload, jwtConfig.secret, options);
};

/**
 * @Everto Farias
 * @description: Verifica y decodifica token JWT con manejo específico de errores de expiración y formato
 * @return: JWTPayload - Payload decodificado del token si es válido
 */

export const verifyJWTToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, jwtConfig.secret) as JWTPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token malformado');
    }
    throw new Error('Token inválido');
  }
};

/**
 * @Everto Farias
 * @description: Verifica si existe un usuario con el email proporcionado en la base de datos
 * @return: Promise<boolean> - true si el email ya está registrado
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ email });
  return !!existingUser;
};

/**
 * @Everto Farias
 * @description: Verifica si existe un usuario con el alias proporcionado en la base de datos
 * @return: Promise<boolean> - true si el alias ya está en uso
 */
export const checkAliasExists = async (alias: string): Promise<boolean> => {
  const existingUser = await User.findOne({ alias });
  return !!existingUser;
};

/**
 * @Everto Farias
 * @description: Busca usuario por email incluyendo el campo password 
 * @return: Promise<User|null> - Usuario con password para validación de credenciales
 */
export const findUserByEmailWithPassword = async (email: string) => {
  return await User.findOne({ email }).select('+password');
};

/**
 * @Everto Farias
 * @description: Busca usuario por ID en la base de datos
 * @return: Promise<User|null> - Usuario encontrado o null si no existe
 */
export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

/**
 * @Everto Farias
 * @description: Crea y guarda un nuevo usuario en la base de datos con email, password y alias
 * @return: Promise<User> - Usuario creado y guardado en MongoDB
 */
export const createUser = async (email: string, password: string, alias: string) => {
  const user = new User({ email, password, alias });
  return await user.save();
};

/**
 * @Everto Farias
 * @description: Valida credenciales de usuario verificando email y comparando password hasheado
 * @return: Promise<User|null> - Usuario si las credenciales son válidas, null si no
 */
export const validateUserCredentials = async (email: string, password: string) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};

/**
 * @Everto Farias
 * @description: Extrae y formatea la fecha de expiración de un token JWT
 * @return: string - Fecha de expiración en formato ISO string
 */
export const getTokenExpirationDate = (token: string): string => {
  const decoded = verifyJWTToken(token);
  return new Date(decoded.exp * 1000).toISOString();
};

/**
 * @Everto Farias
 * @description: Verifica token JWT y valida que el usuario aún existe en base de datos
 * @return: Promise<Object> - Objeto con token decodificado y usuario de DB
 */
export const verifyUserExistsByToken = async (token: string): Promise<any> => {
  const decoded = verifyJWTToken(token);
  const user = await findUserById(decoded._id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return { decoded, user };
};

/**
 * @Everto Farias
 * @description: Formatea respuesta estándar de autenticación con usuario, token y expiración
 * @return: Object - Respuesta consistente para todos los endpoints de auth
 */
export const formatAuthResponse = (user: any, token: string) => {
  return {
    success: true as const,
    message: 'Autenticación exitosa',
    user: user.toPublicJSON(),
    token,
    expiresAt: getTokenExpirationDate(token)
  };
};