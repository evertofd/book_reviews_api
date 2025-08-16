import SavedBook from '../../models/SavedBook.model';


export const saveBookToLibrary = async (bookData: any, userId: string) => {
  const savedBook = new SavedBook({
    ...bookData,
    userId
  });
  
  const result = await savedBook.save();
  return (result as any).toPublicJSON();
};


export const getUserBooks = async (
  userId: string, 
  limit = 20, 
  offset = 0,
  search?: string,
  sortBy?: string,
  excludeNoReview?: boolean
) => {
  const filters: any = { userId };

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i'); 
    filters.$or = [
      { title: searchRegex },
      { author: searchRegex }
    ];
  }
  
  if (excludeNoReview) {
    filters.review = { $ne: '' };
  }
  
  let sortOptions: any = { createdAt: -1 }; 
  
  if (sortBy) {
    switch (sortBy) {
      case 'rating-asc':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'rating-desc':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'title-asc':
        sortOptions = { title: 1 };
        break;
      case 'title-desc':
        sortOptions = { title: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  }
  
  const books = await SavedBook.find(filters)
    .sort(sortOptions)
    .limit(limit)
    .skip(offset);
    
  return books.map(book => (book as any).toPublicJSON());
};


export const getUserLibraryStats = async (userId: string) => {
  const totalBooks = await SavedBook.countDocuments({ userId });
  const booksWithReview = await SavedBook.countDocuments({ 
    userId, 
    review: { $ne: '' } 
  });
  
  const ratingStats = await SavedBook.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        maxRating: { $max: '$rating' },
        minRating: { $min: '$rating' }
      }
    }
  ]);
  
  return {
    totalBooks,
    booksWithReview,
    booksWithoutReview: totalBooks - booksWithReview,
    averageRating: ratingStats[0]?.avgRating || 0,
    highestRating: ratingStats[0]?.maxRating || 0,
    lowestRating: ratingStats[0]?.minRating || 0
  };
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


export const getBookCover = async (bookId: string) => {
  const book = await SavedBook.findById(bookId).select('coverBase64 title');
  return book ? { coverBase64: book.coverBase64, title: book.title } : null;
};