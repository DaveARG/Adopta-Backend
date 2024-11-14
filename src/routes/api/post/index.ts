import { Hono } from 'hono'
import db from '@/db.js'
import { validatePostAdopcionSchema } from './validations/validate-post-adopcion.js'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import crypto from 'node:crypto'

const app = new Hono()

app.post('/', async c => {
    const payload = c.get('jwtPayload')

    const body = await c.req.parseBody()
    const result = validatePostAdopcionSchema(body)
    if (result.error) return c.json(result.error, 400)

    const { foto, ubicacion, celulares, ...data } = result.data

    const arrayBuffer = await foto.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const newNameFile = `${crypto.randomUUID()}${path.extname(foto.name)}`

    const fotoPrincipal = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'public',
        'img',
        newNameFile
    )

    try {
        await fs.writeFile(fotoPrincipal, buffer)
    } catch (e) {
        console.error(e)
        return c.json(e as {}, 417)
    }

    const userId = 1 //payload.id
    const post = await db.postAdopcion.create({
        data: {
            ...data,
            ubicacion: ubicacion ? JSON.parse(ubicacion) : null,
            celulares: celulares ? JSON.parse(celulares) : null,
            fotoPrincipal: 'public/img/' + newNameFile,
            userId,
        },
    })
    console.log('🚀 ~ post:', post)
    return c.json(post)
})

export default app
