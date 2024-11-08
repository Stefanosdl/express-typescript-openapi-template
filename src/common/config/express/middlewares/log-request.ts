import { NextFunction, Request, Response } from 'express'
import { logger } from '../../logger'

export default function logRequest(req: Request, res: Response, next: NextFunction): void {
  logger.info(`Request ${req.method} ${req.path}.`)
  return next()
}
