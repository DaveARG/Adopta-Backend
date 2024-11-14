import { z } from '@hono/zod-openapi'
const objectSchema = z
    .object({
        title: z.string().openapi({
            example: 'Se da en adopción 5 cachorritos',
        }),
        foto: z
            .instanceof(File)
            .refine(
                file =>
                    file.type === 'image/jpeg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/jpg' ||
                    file.type === 'image/webp',
                {
                    message: 'El archivo debe ser una imagen',
                }
            )
            .openapi({
                example: {
                    name: 'imagen.jpg',
                    size: 102400,
                    type: 'image/jpeg',
                } as File,
            }),
        // userId: z.coerce.number().positive().openapi({
        //     example: 1,
        // }),
        celulares: z
            .string()
            .refine(
                val => {
                    let isArray = false
                    try {
                        isArray = Array.isArray(JSON.parse(val))
                    } catch {
                        isArray = false
                    }
                    return isArray
                },
                {
                    message: 'Los celulares deben ser un array',
                }
            )
            .openapi({
                example: JSON.stringify(['+51123456789', '+51987654321']),
            }),
        email: z.string().email().openapi({
            example: 'prueba@example.com',
        }),
        direccion: z.string().openapi({
            example: 'Calle 123',
        }),
        ubicacion: z
            .string()
            .refine(
                val => {
                    let isObject = false
                    try {
                        isObject = typeof JSON.parse(val) === 'object'
                    } catch {
                        isObject = false
                    }
                    return isObject
                },
                {
                    message: 'La ubicacion debe ser un objeto',
                }
            )
            .optional()
            .openapi({
                example: JSON.stringify({
                    lon: -74.5,
                    lat: 4.5,
                }),
            }),
    })
    .openapi('PostAdopcion')

export function validatePostAdopcionSchema(object: unknown) {
    return objectSchema.safeParse(object)
}
