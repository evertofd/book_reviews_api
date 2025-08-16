import jwt from 'jsonwebtoken';
import { JWTPayload } from '../../types/auth.types';
import { jwtConfig } from './config';
import User from '../../models/User.model';

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


export const checkEmailExists = async (email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ email });
  return !!existingUser;
};

export const checkAliasExists = async (alias: string): Promise<boolean> => {
  const existingUser = await User.findOne({ alias });
  return !!existingUser;
};


export const findUserByEmailWithPassword = async (email: string) => {
  return await User.findOne({ email }).select('+password');
};


export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};


export const createUser = async (email: string, password: string, alias: string) => {
  const user = new User({ email, password, alias });
  return await user.save();
};


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


export const getTokenExpirationDate = (token: string): string => {
  const decoded = verifyJWTToken(token);
  return new Date(decoded.exp * 1000).toISOString();
};


export const verifyUserExistsByToken = async (token: string): Promise<any> => {
  const decoded = verifyJWTToken(token);
  const user = await findUserById(decoded._id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return { decoded, user };
};


export const formatAuthResponse = (user: any, token: string) => {
  return {
    success: true as const,
    message: 'Autenticación exitosa',
    user: user.toPublicJSON(),
    token,
    expiresAt: getTokenExpirationDate(token)
  };
};