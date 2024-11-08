import { Application } from 'express'
// import { initMongoDB } from './common/config/mongodb'
import initOpenApi from './common/config/openapi'
import { createApp } from './app'
import { config } from './common/config'
import { logger } from './common/config/logger'

function start(app: Application): void {
  const { port } = config.server
  const server = app.listen(port, process.env.IP, () => {
    const message = `Express server listening on ${port}`
    logger.info({
      key: 'starting server',
      message
    })
  })
  server.setTimeout(30000)
  logger.info({
    key: 'Worker process started',
    message: `The process is ${process.pid}`
  })
}

export async function startServer(): Promise<void> {
  // await initMongoDB()
  const app = createApp()

  await initOpenApi(app)

  await start(app)
}

process.on('unhandledRejection', (error) => {
  logger.error({
    msg: 'UNHANDLED_PROMISE_REJECTION',
    error
  })
  process.exit(1)
})
;(async () => {
  await startServer()
})()
