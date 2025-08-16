import { Schema, model } from 'mongoose';
import { ISavedBook } from '../types/database.types';

const SavedBookSchema = new Schema<ISavedBook>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID es requerido'],
    ref: 'User'
  },
  
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
  },
  
  author: {
    type: String,
    required: [true, 'El autor es requerido'],
    trim: true,
    maxlength: [100, 'El autor no puede tener más de 100 caracteres']
  },
  
  publishYear: {
    type: String,
    required: [true, 'El año de publicación es requerido'],
    trim: true
  },
  
  coverBase64: {
    type: String,
    required: false,
    default: null
  },
  
  review: {
    type: String,
    required: [true, 'El review es requerido'],
    trim: true,
    minlength: [1, 'El review debe tener al menos 1 caracter'],
    maxlength: [500, 'El review no puede tener más de 500 caracteres']
  },
  
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
    validate: {
      validator: Number.isInteger,
      message: 'La calificación debe ser un número entero'
    }
  },
  
  openLibraryId: {
    type: String,
    required: false,
    trim: true
  },
  
  isbn: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true, 
  collection: 'saved_books'
});


SavedBookSchema.index({ userId: 1 }); 
SavedBookSchema.index({ userId: 1, title: 1, author: 1 }); 
SavedBookSchema.index({ createdAt: -1 }); 


SavedBookSchema.statics.findByUserId = function(userId: string, limit = 20, offset = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset);
};


SavedBookSchema.statics.existsForUser = async function(userId: string, title: string, author: string) {
  const book = await this.findOne({ 
    userId, 
    title: { $regex: new RegExp(`^${title}$`, 'i') }, 
    author: { $regex: new RegExp(`^${author}$`, 'i') } 
  });
  return !!book;
};


SavedBookSchema.statics.findByIdAndUser = function(bookId: string, userId: string) {
  return this.findOne({ _id: bookId, userId });
};

SavedBookSchema.methods.toPublicJSON = function() {
  const book = this.toObject();
  book._id = book._id.toString();
  book.userId = book.userId.toString();
  return book;
};


SavedBookSchema.virtual('coverSizeKB').get(function() {
  if (!this.coverBase64) return 0;
  
  const base64Length = this.coverBase64.length;
  const sizeInBytes = (base64Length * 3) / 4;
  return Math.round(sizeInBytes / 1024);
});


SavedBookSchema.set('toJSON', { virtuals: true });
SavedBookSchema.set('toObject', { virtuals: true });


export const SavedBook = model<ISavedBook>('SavedBook', SavedBookSchema);

export default SavedBook;