import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { sign } from 'hono/jwt'
import bcrypt from 'bcrypt'
import db from '@/db.js'
import { validateLoginSchema } from './validate-login.js'

const app = new Hono()

app.post('/login', async c => {
    const body = await c.req.json()
    const result = validateLoginSchema(body)
    if (result.error) return c.json(result.error, 400)

    const data = result.data

    const user = await db.user.findUnique({
        where: {
            phone: data.phone,
        },
    })

    if (!user)
        return c.json({ message: 'Usario o Contraseña incorrectos' }, 404)

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid)
        return c.json({ message: 'Usario o Contraseña incorrectos' }, 404)

    const payload = {
        id: user.id,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }
    const token = await sign(payload, env<{ JWT_SECRET: string }>(c).JWT_SECRET)

    return c.json({ token })
})

export default app
