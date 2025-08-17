import mongoose from 'mongoose';

/**
 * @Everto Farias
 * @description: Establece conexión a MongoDB usando URI de variables de entorno con validación
 * @return: Promise<void> - Conecta a base de datos o termina proceso si falla
 */
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

/**
 * @Everto Farias
 * @description: Desconecta de MongoDB y registra confirmación
 * @return: Promise<void> - Cierra conexión a base de datos limpiamente
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log(' MongoDB desconectado');
};
/**
 * @Everto Farias
 * @description: Verifica si la conexión a MongoDB está activa
 * @return: boolean - true si readyState es 1 (conectado)
 */
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * @Everto Farias
 * @description: Obtiene información detallada del estado de conexión a MongoDB
 * @return: Object - Estado, nombre y host de la base de datos actual
 */
export const getDatabaseInfo = () => {
  return {
    status: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    name: mongoose.connection.name,
    host: mongoose.connection.host
  };
};