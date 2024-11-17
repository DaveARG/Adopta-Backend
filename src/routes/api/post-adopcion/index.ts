import { Hono } from 'hono'
import db from '@/db.js'
import db_without_softdelete from '@/db-without-softdelete.js'
import {
    validatePartialPostAdopcionSchema,
    validatePostAdopcionSchema,
} from './validate-post-adopcion.js'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const app = new Hono()

app.post('/', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const body = await c.req.parseBody()
    const result = validatePostAdopcionSchema(body)
    if (result.error) return c.json(result.error, 400)

    const { foto, ubicacion, celulares, ...data } = result.data

    try {
        const post = await db.postAdopcion.create({
            data: {
                ...data,
                ubicacion: ubicacion ? JSON.parse(ubicacion) : null,
                celulares: celulares ? JSON.parse(celulares) : null,
                foto: '-',
                userId,
            },
        })

        const arrayBuffer = await foto.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        const newNameFile = `postAdopcion-${post.id}${path.extname(foto.name)}`

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
        const fotoPath = 'public/img/' + newNameFile

        try {
            await fs.writeFile(fotoPrincipal, buffer)

            const postUpdated = await db.postAdopcion.update({
                where: {
                    id: post.id,
                },
                data: {
                    foto: fotoPath,
                },
            })

            return c.json(postUpdated)
        } catch (e) {
            db_without_softdelete.postAdopcion.delete({
                where: {
                    id: post.id,
                },
            })
            console.error(e)
            return c.json(e as {}, 417)
        }
    } catch (e) {
        console.error(e)
        return c.json(e as {}, 417)
    }
})

app.patch('/like/:id', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const id = c.req.param('id')
    if (!id) return c.json({ message: 'Parámetro id requerido' }, 404)

    const postPrev = await db.postAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!postPrev) return c.json({ message: 'Post no encontrado' }, 404)

    const likePrev = await db.like.findFirst({
        where: {
            userId,
            modelType: 'postAdopcion',
            modelId: Number(id),
        },
    })

    let res
    if (likePrev) {
        res = await db.like.delete({
            where: {
                id: likePrev.id,
            },
        })
        return c.json(res)
    }

    res = await db.like.create({
        data: {
            userId,
            modelType: 'postAdopcion',
            modelId: Number(id),
        },
    })
    return c.json(res)
})

app.patch('/comment/:id', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const { comment }: { comment?: string } = await c.req.json()
    if (!comment) return c.json({ message: 'Comment requerido' }, 404)

    const id = c.req.param('id')
    if (!id) return c.json({ message: 'Parámetro id requerido' }, 404)

    const postPrev = await db.postAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!postPrev) return c.json({ message: 'Post no encontrado' }, 404)

    const res = await db.comment.create({
        data: {
            userId,
            modelType: 'postAdopcion',
            modelId: Number(id),
            comment,
        },
    })
    return c.json(res)
})

app.patch('/shared/:id', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const id = c.req.param('id')
    if (!id) return c.json({ message: 'Parámetro id requerido' }, 404)

    const postPrev = await db.postAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!postPrev) return c.json({ message: 'Post no encontrado' }, 404)

    const res = await db.shared.create({
        data: {
            userId,
            modelType: 'postAdopcion',
            modelId: Number(id),
        },
    })
    return c.json(res)
})

app.patch('/pet/:id', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const id = c.req.param('id')
    if (!id) return c.json({ message: 'Parámetro id requerido' }, 404)

    const petPrev = await db.petPostAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!petPrev) return c.json({ message: 'PetPost no encontrado' }, 404)

    const res = await db.petPostAdopcion.update({
        where: {
            id: petPrev.id,
        },
        data: {
            disponible: false,
        },
    })

    let postPrev = await db.postAdopcion.findUnique({
        where: {
            id: petPrev.postAdopcionId,
        },
        include: {
            petPostsAdopcion: true,
        },
    })

    const petsDisponibles = postPrev!.petPostsAdopcion.reduce((acc, pet) => {
        if (pet.disponible) return (acc += 1)
        return acc
    }, 0)

    let post
    console.log('🚀 ~ petsDisponibles ~ petsDisponibles:', petsDisponibles)
    if (petsDisponibles === 0)
        post = await db.postAdopcion.update({
            where: {
                id: petPrev.postAdopcionId,
            },
            data: {
                disponible: false,
            },
        })

    return c.json({ pet: res, post })
})

app.put('/:id', async c => {
    const payload = c.get('jwtPayload')
    const userId = 1 //payload.id

    const id = c.req.param('id')
    if (!id) return c.json({ message: 'Parámetro id requerido' }, 404)

    const body = await c.req.parseBody()
    const result = validatePartialPostAdopcionSchema(body)
    if (result.error) return c.json(result.error, 400)

    const { foto, ubicacion, celulares, ...data } = result.data

    const postPrev = await db.postAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!postPrev) return c.json({ message: 'Post no encontrado' }, 404)

    let fotoPath = undefined
    if (foto) {
        try {
            const arrayBuffer = await foto.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)

            const newNameFile = `postAdopcion-${postPrev.id}${path.extname(
                foto.name
            )}`

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
            fotoPath = 'public/img/' + newNameFile

            await fs.writeFile(fotoPrincipal, buffer)
        } catch (e) {
            console.error(e)
            return c.json(e as {}, 417)
        }
    }

    const post = await db.postAdopcion.update({
        where: {
            id: Number(id),
        },
        data: {
            ...data,
            ubicacion: ubicacion ? JSON.parse(ubicacion) : undefined,
            celulares: celulares ? JSON.parse(celulares) : undefined,
            foto: fotoPath,
            userId,
        },
    })

    return c.json(post)
})

app.delete('/:id', async c => {
    const id = c.req.param('id')

    const postPrev = await db.postAdopcion.findUnique({
        where: {
            id: Number(id),
        },
    })
    if (!postPrev) return c.json({ message: 'Post no encontrado' }, 404)

    const post = await db.postAdopcion.delete({
        where: {
            id: Number(id),
        },
    })
    return c.json(post)
})

export default app
