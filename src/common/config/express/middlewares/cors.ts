import cors from 'cors'
import { HttpHeaders } from '../../../enums'

const corsOptions = {
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Secret',
    'Authorization',
    'AppId',
    'buildversion',
    'App-Version',
    'App-Build-Number',
    ...Object.values(HttpHeaders)
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}

export default cors(corsOptions)
