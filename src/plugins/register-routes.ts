import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export default async function registerRoutes(
    app: Hono,
    dir: string,
    basePath = ''
) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            await registerRoutes(app, fullPath, `${basePath}/${file}`)
        } else if (file === 'index.ts') {
            console.log(`🚀 ~ Registering route: ${basePath}`)
            const routeModule = await import(pathToFileURL(fullPath).href)
            if (routeModule.default instanceof Hono) {
                app.route(basePath, routeModule.default)
            }
        }
    }
}
