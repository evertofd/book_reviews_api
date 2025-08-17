import { Context } from 'moleculer';
import { getLastSearches, saveSearch, getUserSearchStats } from './methods';

/**
 * @Everto Farias
 * @description: Health check del servicio de historial de búsquedas
 * @return: Promise<Object> - Estado del servicio con timestamp
 */
export const healthHandler = async (_ctx: Context) => ({
  service: 'search',
  status: 'ok',
  timestamp: new Date().toISOString()
});

/**
 * @Everto Farias
 * @description: Obtiene las últimas búsquedas del usuario desde el contexto autenticado
 * @return: Promise<Object> - Historial de búsquedas con total y alias del usuario
 */
export const getLastSearchesHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const logger = ctx.service?.logger || console;
  
  try {
    const searches = await getLastSearches(user._id);    
    return {
      success: true,
      searches,
      total: searches.length,
      user: user.alias
    };
    
  } catch (error: any) {
    logger.error(`Error obteniendo historial:`, error.message);
    throw new Error('Error al obtener historial de búsquedas');
  }
};

/**
 * @Everto Farias
 * @description: Guarda nueva búsqueda en historial del usuario especificado
 * @return: Promise<Object> - Confirmación de guardado exitoso o error
 */
export const saveSearchHandler = async (ctx: Context) => {
  const { query, userId } = ctx.params as any;
  const logger = ctx.service?.logger || console;
  
  try {
    await saveSearch(userId, query);
    return {
      success: true,
      message: 'Búsqueda guardada en historial'
    };
    
  } catch (error: any) {
    logger.error(` Error guardando búsqueda:`, error.message);
    return {
      success: false,
      message: 'Error al guardar búsqueda'
    };
  }
};

/**
 * @Everto Farias
 * @description: Obtiene estadísticas de búsquedas del usuario con métricas de uso
 * @return: Promise<Object> - Estadísticas de búsquedas con alias del usuario
 */
export const getSearchStatsHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const logger = ctx.service?.logger || console;
  try {
    const stats = await getUserSearchStats(user._id);
    return {
      success: true,
      stats: {
        ...stats,
        user: user.alias
      }
    };
    
  } catch (error: any) {
    logger.error(`Error obteniendo estadísticas:`, error.message);
    throw new Error('Error al obtener estadísticas');
  }
};