import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/database.types';


const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    validate: {
      validator: function(password: string) {
        // Al menos 6 caracteres, 1 mayúscula y 1 carácter especial
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
        return passwordRegex.test(password);
      },
      message: 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula y 1 carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)'
    },
    select: false 
  },
  
  alias: {
    type: String,
    required: [true, 'El alias es requerido'],
    trim: true,
    minlength: [3, 'El alias debe tener al menos 3 caracteres'],
    maxlength: [20, 'El alias no puede tener más de 20 caracteres'],
    match: [
      /^[a-zA-Z0-9_]+$/,
      'El alias solo puede contener letras, números y guiones bajos'
    ]
  }
}, {
  timestamps: true, 
  collection: 'users'
});


//UserSchema.index({ email: 1 }); 
UserSchema.index({ alias: 1 }); 


UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});


UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparando contraseñas:', error);
    return false;
  }
};


UserSchema.methods.toPublicJSON = function(): {
  _id: string;
  email: string;
  alias: string;
  createdAt: Date;
  updatedAt: Date;
} {
  const user = this.toObject();
  delete user.password;
  user._id = user._id.toString();
  return user;
};

UserSchema.statics.findByEmailWithPassword = function(email: string) {
  return this.findOne({ email }).select('+password');
};


UserSchema.statics.isAliasAvailable = async function(alias: string, excludeUserId?: string) {
  const query: any = { alias };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  
  const existingUser = await this.findOne(query);
  return !existingUser;
};


UserSchema.virtual('savedBooksCount', {
  ref: 'SavedBook',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });


export const User = model<IUser>('User', UserSchema);

export default User;