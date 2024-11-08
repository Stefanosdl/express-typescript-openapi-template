declare namespace OpenApiBackend {
  type OpenApiContext = import('openapi-backend').Context
  type OpenApiContextFile = OpenApiContext & { request: { file: Express.Multer.File } }
  type SpecificationDocument = import('openapi-backend').Document
  type OpenApiBackendRequest = import('openapi-backend').Request
  type OpenApiBackendLib = import('openapi-backend').openApiBackendLib
}
