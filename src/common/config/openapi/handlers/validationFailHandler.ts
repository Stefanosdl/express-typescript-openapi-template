import { Request, Response } from 'express'
import { logger } from '../../logger'
import { HttpStatus } from '../../../enums'

export default function validationFailHandler(c: OpenApiBackend.OpenApiContext, req: Request, res: Response): Response {
  logger.error({ key: 'BAD_REQUEST_RECEIVED', errors: c.validation.errors, body: req.body, query: req.query })
  const response = { status: HttpStatus.BAD_REQUEST, err: c.validation.errors }
  return res.status(HttpStatus.BAD_REQUEST).json(response)
}
