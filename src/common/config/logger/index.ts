import { AsyncLocalStorage } from 'async_hooks'
import * as cp from 'child_process'
import { ChildProcess } from 'child_process'
import { HttpHeaders } from '../../enums'
import { NextFunction, Request } from 'express'
import Pino from 'pino'
import { v4 } from 'uuid'
import { LocalStorage } from 'types'

const localStorage = new AsyncLocalStorage<LocalStorage.Data>()

const fieldsToRedact = []

const localConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname,rid,v',
      translateTime: 'SYS:standard',
      errorLikeObjectKeys: ['err', 'error']
    }
  },
  redact: {
    paths: fieldsToRedact,
    remove: true
  }
}

const pinoLogger = Pino(localConfig)

/**
 * Traps the get method of the target, replaces the logger with the logger in the store,
 * and reflects the functions of the logger to the one stored in async local storage
 *
 * @returns proxyObject
 */
function proxyHandler(): unknown {
  return {
    get(target, property, receiver) {
      const targetInStore = localStorage.getStore()?.logger || target
      return Reflect.get(targetInStore, property, receiver)
    }
  }
}

/**
 * Top-level middleware which creates a new child logger with rid, the ID of the request,
 * and stores it in the async local storage of the server
 */
function createContext(req: Request, res: Response, next: NextFunction): void {
  const rid = req.header(HttpHeaders.requestId) ?? v4()
  req.headers[HttpHeaders.requestId.toLowerCase()] = rid

  const logger = pinoLogger.child({ rid }) as unknown as cp.ChildProcess
  const requestInfo = req.requestInfo
  const store = {
    logger,
    requestInfo
  }
  localStorage.run(store, () => {
    return next()
  })
}

function getValueFromContext(key: string): ChildProcess {
  const store = localStorage.getStore()
  return store?.[key]
}

/**
 * Each log should happen on the specified child logger and not on the parent.
 * Thus, we create a proxy that hides the implementation.
 */
const logger = new Proxy(pinoLogger, proxyHandler())

export { createContext, getValueFromContext, logger }
