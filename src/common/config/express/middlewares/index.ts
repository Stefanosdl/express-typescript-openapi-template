import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import { NextFunction, Request, Response } from 'express'

import { createContext } from '../../logger'
import logRequest from './log-request'

function requestInfoMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.requestInfo = req.requestInfo || {}
  next()
}

export const middlewares = [
  compression(),
  bodyParser.json({ limit: '50mb' }),
  bodyParser.urlencoded({ limit: '50mb', extended: true }),
  requestInfoMiddleware,
  createContext,
  logRequest,
  helmet()
]
