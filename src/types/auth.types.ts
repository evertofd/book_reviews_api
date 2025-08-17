import { Context as MoleculerContext } from 'moleculer';

export interface JWTPayload {
  _id: string;
  email: string;
  alias: string;
  iat: number;
  exp: number; 
}
export interface ContextMeta {
  user: JWTPayload; 
  token: string;
}
export interface AuthContext<P = unknown> extends MoleculerContext<P, ContextMeta> {}


export interface RegisterParams {
  email: string;
  password: string;
  alias: string;
}


export interface LoginParams {
  email: string;
  password: string;
}


export interface AuthResponse {
  success: true;
  message: string;
  user: {
    _id: string; 
    email: string;
    alias: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
  expiresAt: string;
}


export interface AuthErrorResponse {
  success: false;
  message: string;
  error: string;
}


export interface AuthenticatedUser {
  _id: string;
  email: string;
  alias: string;
}


export interface AuthenticatedContext {
  meta: {
    user: AuthenticatedUser;
    token: string;
    userAgent?: string;
    clientIP?: string;
  };
}


export interface VerifyTokenParams {
  token: string;
}


export interface JWTConfig {
  secret: string;
  expiresIn: number;
  algorithm: string;
}