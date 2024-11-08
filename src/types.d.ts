export type HttpContentType =
  | 'application/json'
  | 'application/xml'
  | 'text/plain'
  | 'text/html'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/octet-stream'

declare namespace LocalStorage {
  type Data = {
    logger: import('child_process').ChildProcess
    requestInfo: RequestInfo
  }
}

declare namespace ApiResponse {
  type Response<T> = {
    status: import('./common/enums').HttpStatus
    data?: T
    fileName?: string
    contentType?: HttpContentType
    headers?: object
    stream?: unknown
  }
}

type StringNumberOrArray = string | number | string[] | number[]

type IdQuery = {
  _id: Record<string, unknown>
}

type PaginationResponse<T = unknown> = {
  pageSize?: number
  pageNumber?: number
  totalCount: number
  totalPages: number
  data: T[]
}

type PaginationRequest = {
  pageSize?: number
  pageNumber?: number
}
