import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function userSeeder() {
    const hash = await bcrypt.hash('123', 10)
    await prisma.user.createMany({
        data: [
            {
                phone: '123',
                password: hash,
                name: 'Arturo',
                lastName: 'Rodas',
            },
        ],
    })
}
