import express, { Application } from 'express'

import mongoose from 'mongoose'
import { middlewares } from './common/config/express/middlewares/'

mongoose.set('strictQuery', false)

export function createApp(): Application {
  const app = express()

  middlewares.forEach((m) => app.use(m))
  return app
}
