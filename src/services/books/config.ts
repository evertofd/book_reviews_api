
export const booksServiceConfig = {
  name: 'books',

  openLibraryBaseUrl: process.env.OPENLIBRARY_API_URL || 'https://openlibrary.org',

  endpoints: {
    search: '/search.json',
    covers: 'https://covers.openlibrary.org/b/id'
  },

  search: {
    defaultLimit: 10,
    maxLimit: 50,
    minQueryLength: 1
  },

  cache: {
    enabled: true,
    ttlSeconds: 300
  }
};


export const validateBooksConfig = () => {
  if (!booksServiceConfig.openLibraryBaseUrl) {
    console.warn('No hay URL de OpenLibrary definida, se usará la por defecto');
  }

  console.log(`Books Service configurado para: ${booksServiceConfig.openLibraryBaseUrl}`);
};