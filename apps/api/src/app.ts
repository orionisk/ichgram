import configureOpenAPI from '@api/lib/configure-open-api'
import { registerRoutes } from './modules/registerRoutes'
import { app } from './wsApp'

const wsApp = registerRoutes(app)
configureOpenAPI(wsApp)

export { wsApp as app }
