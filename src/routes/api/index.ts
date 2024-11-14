import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'

const app = new Hono()

// app.use('/*', (c, next) => {
//     const jwtMiddleware = jwt({
//         secret: env<{ JWT_SECRET: string }>(c).JWT_SECRET,
//     })
//     return jwtMiddleware(c, next)
// })

app.get('/page', c => {
    const payload = c.get('jwtPayload')
    return c.json(payload) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})

export default app
