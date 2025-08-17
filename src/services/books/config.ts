/**
 * @Everto Farias
 * @description: Configuración centralizada del servicio Books con URLs, límites de búsqueda y cache
 * @return: Object - Configuración completa para integración con OpenLibrary API
 */
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

/**
 * @Everto Farias
 * @description: Valida la configuración del servicio Books y muestra warnings si faltan parámetros críticos
 * @return: void - Registra logs de validación y configuración actual
 */
export const validateBooksConfig = () => {
  if (!booksServiceConfig.openLibraryBaseUrl) {
    console.warn('No hay URL de OpenLibrary definida, se usará la por defecto');
  }

  console.log(`Books Service configurado para: ${booksServiceConfig.openLibraryBaseUrl}`);
};