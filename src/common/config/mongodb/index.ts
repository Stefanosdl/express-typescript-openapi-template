import mongoose from 'mongoose'
import { config } from '../index'

import { logger } from '../logger'

const options = {
  connectTimeoutMS: config.mongodb.connectionTimeout || 10000
}

function setDatabaseListeners(): void {
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose default connection is open')
  })

  // When there is an error on INITIAL connection
  mongoose.connection.on('error', (error) => {
    logger.info({ message: 'MongoDB connection error', error: error.message })
    process.exit(1)
  })

  mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB connection disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection re-established')
  })

  mongoose.connection.on('reconnectFailed', () => {
    logger.info('Failed to reconnect to mongo, crashing...')
    process.exit(1)
  })
}

/**
 * Top level middleware which creates a new child logger with rid, the Id of the request
 * and stores it in the async local storage of the server
 *
 */
async function initMongoDB(connectionPoolSize: number = config.mongodb.connections): Promise<void> {
  const uri = `${config.mongodb.uri}&maxPoolSize=${connectionPoolSize}`
  await mongoose.connect(uri, options)
  setDatabaseListeners()
}

export { initMongoDB }
