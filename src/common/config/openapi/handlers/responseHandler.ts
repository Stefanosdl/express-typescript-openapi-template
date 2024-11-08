export default function responseHandler(fn) {
  return async (c: OpenApiBackend.OpenApiContext, req: Request, res: Response) => {
    const dataResponse = await fn(c, req, res)
    Object.assign(c, { dataResponse })
  }
}
