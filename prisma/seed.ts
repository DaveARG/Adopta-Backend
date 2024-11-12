import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const prisma = new PrismaClient()

async function main() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const seedersPath = path.join(__dirname, 'seeders')

    const seederFiles = fs
        .readdirSync(seedersPath)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))

    for (const seederFile of seederFiles) {
        const seeder = await import(
            pathToFileURL(path.join(seedersPath, seederFile)).href
        )

        if (typeof seeder.default === 'function') {
            await seeder.default()
            console.log(`Executed: ${seederFile}`)
        } else if (typeof seeder[Object.keys(seeder)[0]] === 'function') {
            await seeder[Object.keys(seeder)[0]]()
            console.log(`Executed: ${seederFile}`)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
