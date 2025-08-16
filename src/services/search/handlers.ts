import { Context } from 'moleculer';
import { getLastSearches, saveSearch, getUserSearchStats } from './methods';


export const healthHandler = async (_ctx: Context) => ({
  service: 'search',
  status: 'ok',
  timestamp: new Date().toISOString()
});


export const getLastSearchesHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const logger = ctx.service?.logger || console;
  
  try {
    logger.info(` Obteniendo historial de búsquedas para usuario: ${user.alias}`);
    const searches = await getLastSearches(user._id);
    logger.info(`Encontradas ${searches.length} búsquedas en historial`);
    
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


export const saveSearchHandler = async (ctx: Context) => {
  const { query, userId } = ctx.params as any;
  const logger = ctx.service?.logger || console;
  
  try {
    logger.info(`Guardando búsqueda: "${query}" para usuario: ${userId}`);
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