import SavedBook from '../../models/SavedBook.model';


export const saveBookToLibrary = async (bookData: any, userId: string) => {
  const savedBook = new SavedBook({
    ...bookData,
    userId
  });
  
  const result = await savedBook.save();
  return (result as any).toPublicJSON();
};


export const getUserBooks = async (userId: string, limit = 20, offset = 0) => {
  const books = await SavedBook.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset);
    
  return books.map(book => (book as any).toPublicJSON());
};


export const getBookById = async (bookId: string, userId: string) => {
  const book = await SavedBook.findOne({ _id: bookId, userId });
  return book ? (book as any).toPublicJSON() : null;
};


export const updateBookReview = async (bookId: string, userId: string, review: string, rating: number) => {
  const updatedBook = await SavedBook.findOneAndUpdate(
    { _id: bookId, userId },
    { review, rating, updatedAt: new Date() },
    { new: true }
  );
  
  return updatedBook ? (updatedBook as any).toPublicJSON() : null;
};


export const deleteBookFromLibrary = async (bookId: string, userId: string) => {
  const deletedBook = await SavedBook.findOneAndDelete({ _id: bookId, userId });
  return deletedBook ? (deletedBook as any).toPublicJSON() : null;
};


export const checkIfBookExists = async (title: string, author: string, userId: string) => {
  const book = await SavedBook.findOne({ 
    userId, 
    title: { $regex: new RegExp(`^${title}$`, 'i') }, 
    author: { $regex: new RegExp(`^${author}$`, 'i') } 
  });
  return !!book;
};