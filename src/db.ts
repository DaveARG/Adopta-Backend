import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'
const prisma = new PrismaClient()
const extendedPrisma = prisma.$extends(
    createSoftDeleteExtension({
        models: {
            User: true,
            PostAdopcion: true,
            PostSeBusca: true,
        },
        defaultConfig: {
            field: 'deletedAt',
            createValue: deleted => {
                if (deleted) return new Date()
                return null
            },
        },
    })
)
export default extendedPrisma
