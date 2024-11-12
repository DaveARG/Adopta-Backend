import z from 'zod'
const objectSchema = z.object({
    phone: z.string(),
    password: z.string(),
})

export function validateLoginSchema(object: unknown) {
    return objectSchema.safeParse(object)
}

// export function validatePartialSchema(object: unknown) {
//     return objectSchema.partial().safeParse(object)
// }
