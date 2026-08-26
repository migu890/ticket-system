import 'dotenv/config'
import argon2 from 'argon2'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL ist nicht definiert')
}

const adapter = new PrismaPg({
  connectionString
})

const prisma = new PrismaClient({
  adapter
})

const createUserIfMissing = async (
  name: string,
  email: string,
  password: string,
  role: 'USER' | 'ADMIN'
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    console.log(
      `Benutzer ${email} existiert bereits`
    )

    return
  }

  const passwordHash = await argon2.hash(
    password
  )

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role
    }
  })

  console.log(
    `Benutzer ${email} wurde erstellt`
  )
}

const main = async () => {
  await createUserIfMissing(
    'Administrator',
    'admin@example.com',
    'Admin123!',
    'ADMIN'
  )

  await createUserIfMissing(
    'Alice Müller',
    'alice@example.com',
    'User123!',
    'USER'
  )

  await createUserIfMissing(
    'Bob Meier',
    'bob@example.com',
    'User123!',
    'USER'
  )

  console.log(
    'Production-Seed erfolgreich abgeschlossen'
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })