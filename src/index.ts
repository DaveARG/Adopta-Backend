import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import path from 'path'
import { fileURLToPath } from 'url'
import registerRoutes from '@/plugins/register-routes.js'

const app = new Hono()

process.loadEnvFile()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

registerRoutes(app, path.join(__dirname, 'routes'))

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port,
})
