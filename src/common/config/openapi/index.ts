import { OpenAPIBackend } from 'openapi-backend'

import { Application } from 'express'
import openApiEndpoints from '../../../api/routes'
import Error from '../../errors/errorCodes'
import { logger } from '../logger'
import errorHandler from './handlers/errorHandler'
import postResponseHandler from './handlers/postResponseHandler'
import responseHandler from './handlers/responseHandler'
import validationFailHandler from './handlers/validationFailHandler'

export default async function initOpenApi(app: Application, endpoints?: unknown): Promise<void> {
  const handlers = Object.keys((endpoints || {}) && openApiEndpoints)
  const map = handlers.reduce((acc, handler) => {
    acc[`${handler}`] = errorHandler(responseHandler(openApiEndpoints[handler].handler))
    return acc
  }, {})

  const api = new OpenAPIBackend({
    definition: `${__dirname}/../../../api/specification.yaml`,
    handlers: map
  })
  api.register('validationFail', validationFailHandler)
  api.register('postResponseHandler', postResponseHandler)
  await api.init()

  const operations = api.getOperations()
  operations
    .filter((operation) => !operation.tags?.includes('wip'))
    .forEach((operation) => {
      const { operationId, method, path } = operation
      const expressPath = path.replace(/{/g, ':').replace(/}/g, '')
      const endpoint = openApiEndpoints[operationId]
      app[method](expressPath, ...endpoint.preOperationMiddlewares, async (req, res) => {
        try {
          req.requestInfo.operationId = operationId
          await api.handleRequest(req, req, res)
        } catch (error) {
          logger.error({
            message: 'Generic uncaught error.',
            err: error
          })
          if (!res.headersSent) {
            res.status(500).json(Error.GENERIC__ERROR)
          }
        }
      })
    })
}
