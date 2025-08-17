import SearchHistory from '../../models/SearchHistory.model';
import { searchServiceConfig } from './config';

/**
 * @Everto Farias
 * @description: Obtiene las últimas búsquedas del usuario ordenadas por fecha descendente
 * @return: Promise<Object[]> - Array de búsquedas con query y fecha de creación
 */

export const getLastSearches = async (userId: string, limit = searchServiceConfig.history.returnLimit) => {
  const searches = await SearchHistory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('query createdAt')
    .lean();

  return searches.map(search => ({
    query: search.query,
    createdAt: search.createdAt
  }));
};

/**
 * @Everto Farias
 * @description: Guarda búsqueda en historial si no existe y limpia registros antiguos
 * @return: Promise<void> - Guarda búsqueda única y mantiene límite de historial
 */
export const saveSearch = async (userId: string, query: string) => {
  try {
    const recentSearches = await getLastSearches(userId, searchServiceConfig.history.returnLimit);
    const queryExists = recentSearches.some(search =>
      search.query.toLowerCase() === query.toLowerCase()
    );

    if (!queryExists) {
      const searchHistory = new SearchHistory({ userId, query });
      await searchHistory.save();

      await cleanupOldSearches(userId);
    }

  } catch (error) {
    console.warn('Error guardando búsqueda:', error);
  }
};

/**
 * @Everto Farias
 * @description: Elimina búsquedas antiguas que excedan el límite máximo configurado manteniendo las más recientes
 * @return: Promise<void> - Mantiene solo maxSearches registros por usuario
 */
export const cleanupOldSearches = async (userId: string) => {
  const maxSearches = searchServiceConfig.history.maxSearches;
  const allSearches = await SearchHistory.find({ userId })
    .sort({ createdAt: -1 })
    .select('_id');

  if (allSearches.length > maxSearches) {
    const toDelete = allSearches.slice(maxSearches).map(s => s._id);
    await SearchHistory.deleteMany({ _id: { $in: toDelete } });
  }
};

/**
 * @Everto Farias
 * @description: Calcula estadísticas de búsqueda del usuario incluyendo total y última búsqueda
 * @return: Promise<Object> - Stats con total de búsquedas y datos de la más reciente
 */
export const getUserSearchStats = async (userId: string) => {
  const totalSearches = await SearchHistory.countDocuments({ userId });
  const lastSearch = await SearchHistory.findOne({ userId })
    .sort({ createdAt: -1 })
    .select('query createdAt');

  return {
    totalSearches,
    lastSearch: lastSearch ? (lastSearch as any).toPublicJSON() : null
  };
};