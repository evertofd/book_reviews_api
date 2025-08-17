import { Context } from 'moleculer';

/**
 * @Everto Farias
 * @description: Middleware de autenticación que valida token Bearer JWT y establece usuario en contexto
 * @return: Promise<Object> - Usuario decodificado del token si es válido
 */
export const authenticateToken = async (ctx: Context, _route: any, req: any): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token de autorización requerido');
    }

    const token = authHeader.substring(7);

    const decoded = await ctx.call('auth.verifyToken', { token });

    (ctx.meta as any).user = decoded;
    (ctx.meta as any).token = token;

    return decoded;

  } catch (error: any) {
    console.error(' Error de autenticación:', error.message);
    throw new Error('Token inválido o expirado');
  }
};

/**
 * @Everto Farias
 * @description: Manejador de errores de autenticación que formatea respuesta HTTP 401 con estructura consistente
 * @return: void - Envía respuesta JSON con error, mensaje y timestamp
 */
export const handleAuthError = (_req: any, res: any, err: any) => {
  console.error(' Error de autenticación:', err.message);

  res.writeHead(401, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  res.end(JSON.stringify({
    success: false,
    error: 'No autorizado',
    message: err.message || 'Token inválido o expirado',
    code: 401,
    timestamp: new Date().toISOString()
  }));
};