import SearchHistory from '../../models/SearchHistory.model';
import { searchServiceConfig } from './config';

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