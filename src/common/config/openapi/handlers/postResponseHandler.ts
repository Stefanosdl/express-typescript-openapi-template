import { HttpStatus } from '../../../../common/enums'
import { logger } from '../../logger'

// eslint-disable-next-line consistent-return
function postResponseHandler(c: OpenApiBackend.OpenApiContext, req, res): void {
  if (res.headersSent) {
    return
  }
  // @ts-ignore
  const { dataResponse, operation } = c
  const { status, data, headers } = dataResponse
  if (headers) {
    Object.keys(headers).forEach((header) => res.set(header, headers[header]))
  }

  if (status !== HttpStatus.NO_CONTENT && data) {
    const valid = c.api.validateResponse(data, operation)
    if (valid.errors) {
      logger.error({ key: 'OPEN_API_EXPECTATION_FAILED', errors: valid.errors, response: data })
    }
  }
  if (!res.headersSent) {
    return res.status(status).json(data)
  }
}

export default postResponseHandler
