import { Schema, model } from 'mongoose';
import { ISearchHistory } from '../types/database.types';


const SearchHistorySchema = new Schema<ISearchHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID es requerido'],
    ref: 'User'
  },
  
  query: {
    type: String,
    required: [true, 'La query de búsqueda es requerida'],
    trim: true,
    minlength: [1, 'La query debe tener al menos 1 caracter'],
    maxlength: [100, 'La query no puede tener más de 100 caracteres']
  }
}, {
  timestamps: true,
  collection: 'search_history'
});


SearchHistorySchema.index({ userId: 1, createdAt: -1 });
SearchHistorySchema.index({ userId: 1, query: 1 });


SearchHistorySchema.methods.toPublicJSON = function() {
  return {
    query: this.query,
    createdAt: this.createdAt
  };
};


export const SearchHistory = model<ISearchHistory>('SearchHistory', SearchHistorySchema);

export default SearchHistory;