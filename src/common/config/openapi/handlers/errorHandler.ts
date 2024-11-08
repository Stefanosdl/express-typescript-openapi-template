import { Request, Response } from 'express'
import cloneDeep from 'lodash/cloneDeep'
import ResourceNotFoundError from '../../../errors/ResourceNotFoundError'
import ValidationError from '../../../errors/ValidationError'
import Errors from '../../../errors/errorCodes'
import { logger } from '../../logger'
import { HttpStatus } from '../../../enums'

function errorHandler(fn) {
  return async (c: OpenApiBackend.OpenApiContext, req: Request, res: Response) => {
    return fn(c, req, res).catch((error) => {
      const { params } = error
      const errorCode = error.errorCode || Errors.GENERIC__ERROR
      const responseCodeWithParams = params ? Object.assign(errorCode, { params }) : errorCode

      let status = HttpStatus.INTERNAL_ERROR
      let logLevel = 'error'
      if (error.errors) {
        const response = cloneDeep({ errors: error.errors })
        status = HttpStatus.UNPROCESSABLE_ENTITY
        logger.warn({
          message: `Request ${req.method} ${req.path} failed.`,
          query: JSON.stringify(req.query),
          code: errorCode.code,
          body: JSON.stringify(req.body),
          status,
          err: error,
          params
        })
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response)
      }

      // Create http status code and log level by custom error type
      if (error instanceof ValidationError) {
        status = HttpStatus.UNPROCESSABLE_ENTITY
        logLevel = 'warn'
      } else if (error instanceof ResourceNotFoundError) {
        status = HttpStatus.NOT_FOUND
        logLevel = 'warn'
      }

      if (!responseCodeWithParams.statusCode) responseCodeWithParams.statusCode = status

      // Log the failure.
      logger[`${logLevel}`]({
        message: `Request ${req.method} ${req.path} failed.`,
        query: JSON.stringify(req.query),
        code: errorCode.code,
        body: JSON.stringify(req.body),
        status,
        err: error,
        params
      })
      // And respond.
      return res.status(responseCodeWithParams.statusCode).json(responseCodeWithParams)
    })
  }
}

export default errorHandler
