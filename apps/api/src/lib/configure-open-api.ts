import type { AppOpenAPI } from './types'

import { apiReference } from '@scalar/hono-api-reference'
import packageJSON from '../../package.json' with { type: 'json' }
import env from '../env'

export default function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  })

  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Ichgram API',
    },
    security: [{ Bearer: [] }],
  })

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      spec: {
        url: `${env.BASE_PATH}/doc`,
      },
    }),
  )
}
