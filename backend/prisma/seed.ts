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

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@example.com'
    },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  })

  const alice = await prisma.user.upsert({
    where: {
      email: 'alice@example.com'
    },
    update: {},
    create: {
      name: 'Alice Müller',
      email: 'alice@example.com',
      passwordHash: userPassword,
      role: 'USER'
    }
  })

  const bob = await prisma.user.upsert({
    where: {
      email: 'bob@example.com'
    },
    update: {},
    create: {
      name: 'Bob Meier',
      email: 'bob@example.com',
      passwordHash: userPassword,
      role: 'USER'
    }
  })

  const existingTickets =
    await prisma.ticket.count()

  if (existingTickets === 0) {
    await prisma.ticket.createMany({
      data: [
        {
          title: 'Monitor funktioniert nicht',
          description:
            'Der zweite Monitor wird nicht erkannt.',
          priority: 'MEDIUM',
          status: 'OPEN',
          createdById: alice.id
        },
        {
          title: 'Passwort zurücksetzen',
          description:
            'Anmeldung am Firmenkonto ist nicht möglich.',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          createdById: bob.id,
          assignedToId: admin.id
        },
        {
          title: 'Software installieren',
          description:
            'Visual Studio Code wird benötigt.',
          priority: 'LOW',
          status: 'OPEN',
          createdById: alice.id
        }
      ]
    })
  }

  console.log('Seed erfolgreich erstellt')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })