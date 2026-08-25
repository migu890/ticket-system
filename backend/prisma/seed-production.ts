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

const main = async () => {
  const adminPassword = await argon2.hash(
    'Admin123!'
  )

  const userPassword = await argon2.hash(
    'User123!'
  )

  await prisma.user.upsert({
    where: {
      email: 'admin@example.com'
    },
    update: {
      name: 'Administrator',
      passwordHash: adminPassword,
      role: 'ADMIN'
    },
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  })

  await prisma.user.upsert({
    where: {
      email: 'alice@example.com'
    },
    update: {
      name: 'Alice Müller',
      passwordHash: userPassword,
      role: 'USER'
    },
    create: {
      name: 'Alice Müller',
      email: 'alice@example.com',
      passwordHash: userPassword,
      role: 'USER'
    }
  })

  await prisma.user.upsert({
    where: {
      email: 'bob@example.com'
    },
    update: {
      name: 'Bob Meier',
      passwordHash: userPassword,
      role: 'USER'
    },
    create: {
      name: 'Bob Meier',
      email: 'bob@example.com',
      passwordHash: userPassword,
      role: 'USER'
    }
  })

  console.log('Production-User erfolgreich erstellt')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })