import { BrokerOptions, LogLevels } from 'moleculer';
import dotenv from 'dotenv';

dotenv.config();


const brokerConfig: BrokerOptions = {
  nodeID: process.env.NODE_ID || "book-reviews-api",
  logger: {
    type: "Console",
    options: {
      level: (process.env.LOG_LEVEL as LogLevels) || "info",
      colors: true,
      formatter: "full"
    }
  },

 transporter: process.env.TRANSPORTER || null,


  cacher: {
    type: "Memory",
    options: {
      ttl: 30 * 60 
    }
  },

  requestTimeout: 10 * 1000, 

  // Hooks del broker
   created(broker) {
    console.log("MolecularJS Broker inicializado");
    console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  },

  started(broker) {
    console.log("Todos los servicios iniciados");
    console.log(`Puerto: ${process.env.PORT || 3001}`);
  },

  stopped(broker) {
    console.log("Broker detenido");
  }
};

export = brokerConfig;