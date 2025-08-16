import { Context } from 'moleculer';
import { 
  saveBookToLibrary, 
  getUserBooks, 
  getBookById, 
  updateBookReview, 
  deleteBookFromLibrary,
  checkIfBookExists
} from './methods';


export const healthHandler = async (_ctx: Context) => ({
  service: 'library',
  status: 'ok',
  timestamp: new Date().toISOString()
});


export const saveBookHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const bookData = ctx.params as any; // Cast simple
  const logger = ctx.service?.logger || console;
  
  try {    
    const exists = await checkIfBookExists(bookData.title, bookData.author, user._id);
    if (exists) {
      throw new Error('El libro ya está en tu biblioteca');
    }
    
    const savedBook = await saveBookToLibrary(bookData, user._id);
    
    logger.info(`Libro guardado exitosamente: ${bookData.title}`);
    
    return {
      success: true,
      message: 'Libro guardado en tu biblioteca',
      book: savedBook
    };
    
  } catch (error: any) {
    logger.error(` Error guardando libro:`, error.message);
    throw new Error(`Error al guardar libro: ${error.message}`);
  }
};


export const getMyBooksHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const { limit = 20, offset = 0 } = ctx.params as any; // Cast simple
  const logger = ctx.service?.logger || console;
  
  try {
    const books = await getUserBooks(user._id, limit, offset);    
    return {
      success: true,
      books,
      total: books.length,
      user: user.alias
    };
    
  } catch (error: any) {
    logger.error(`Error obteniendo biblioteca:`, error.message);
    throw new Error('Error al obtener tu biblioteca');
  }
};


export const getBookHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const { id } = ctx.params as any; // Cast simple
  const logger = ctx.service?.logger || console;
  
  try {
    const book = await getBookById(id, user._id);
    
    if (!book) {
      throw new Error('Libro no encontrado en tu biblioteca');
    }
    
    return {
      success: true,
      book
    };
    
  } catch (error: any) {
    logger.error(`Error obteniendo libro:`, error.message);
    throw new Error(`Error al obtener libro: ${error.message}`);
  }
};


export const updateBookHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const { id, review, rating } = ctx.params as any; 
  const logger = ctx.service?.logger || console;
  
  try {    
    const updatedBook = await updateBookReview(id, user._id, review, rating);
    
    if (!updatedBook) {
      throw new Error('Libro no encontrado en tu biblioteca');
    }
    
    logger.info(`Libro actualizado exitosamente`);
    
    return {
      success: true,
      message: 'Libro actualizado exitosamente',
      book: updatedBook
    };
    
  } catch (error: any) {
    logger.error(`Error actualizando libro:`, error.message);
    throw new Error(`Error al actualizar libro: ${error.message}`);
  }
};


export const deleteBookHandler = async (ctx: Context) => {
  const user = (ctx.meta as any).user;
  const { id } = ctx.params as any; 
  const logger = ctx.service?.logger || console;
  
  try {    
    const deletedBook = await deleteBookFromLibrary(id, user._id);
    
    if (!deletedBook) {
      throw new Error('Libro no encontrado en tu biblioteca');
    }
    
    logger.info(`Libro eliminado exitosamente`);
    
    return {
      success: true,
      message: 'Libro eliminado de tu biblioteca'
    };
    
  } catch (error: any) {
    logger.error(`Error eliminando libro:`, error.message);
    throw new Error(`Error al eliminar libro: ${error.message}`);
  }
};