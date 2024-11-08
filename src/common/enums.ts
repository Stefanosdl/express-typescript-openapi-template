export enum HttpStatus {
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  NO_CONTENT = 204,
  OK = 200
}

export enum HttpHeaders {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
  requestId = 'X-Request-Id'
}
