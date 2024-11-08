import convict from 'convict'
import convictWithValidators from 'convict-format-with-validator'
import dotenv from 'dotenv'

dotenv.config()
convict.addFormats(convictWithValidators)

const configDefinition = {
  server: {
    port: {
      doc: 'The server port',
      format: 'port',
      default: 8080,
      env: 'PORT'
    }
  },
  mongodb: {
    uri: {
      doc: 'The server mongo uri',
      format: 'String',
      env: 'MONGO_URI',
      default: 'mongoURI',
      nullable: false
    },
    connectionTimeout: {
      doc: 'The mongodb collection timeout',
      format: Number,
      default: 30000,
      env: 'MONGO_CONNECTION_TIMEOUT'
    },
    connections: {
      doc: 'The mongodb number of connections',
      format: Number,
      default: 5,
      env: 'MONGO_CONNECTIONS'
    }
  },
  api: {
    basePath: {
      doc: 'The api base url (after the initial url part)',
      format: String,
      env: 'API_BASE_PATH',
      default: '/api'
    },
    baseUrl: {
      doc: 'The api base url',
      format: String,
      env: 'API_BASE_URL',
      default: 'http://localhost:8080'
    }
  }
}

const configToValidate = convict(configDefinition)
// Perform validation
configToValidate.validate({ allowed: 'strict' })
const config = configToValidate.getProperties()

export { config }
