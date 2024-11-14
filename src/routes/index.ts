import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use('/public/*', serveStatic({ root: './' }))

export default app
