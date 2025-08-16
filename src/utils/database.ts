import mongoose from 'mongoose';


export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB conectado:', mongoose.connection.name);

  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};


export const disconnectFromDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB desconectado');
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};


export const getDatabaseInfo = () => {
  return {
    status: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    name: mongoose.connection.name,
    host: mongoose.connection.host
  };
};