import { z } from '@hono/zod-openapi'
const objectSchema = z
    .object({
        phone: z.string().openapi({
            example: '+51123456789',
        }),
        password: z.string().openapi({
            example: 'passwordSeguro',
        }),
    })
    .openapi('Login')

export function validateLoginSchema(object: unknown) {
    return objectSchema.safeParse(object)
}
