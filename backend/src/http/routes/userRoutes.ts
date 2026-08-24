import { Hono } from 'hono'
import { prisma } from '../../infrastructure/prisma/prismaClient.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js'

export const userRoutes = new Hono()

userRoutes.use('*', authMiddleware)
userRoutes.use('*', adminMiddleware)

userRoutes.get('/', async (c) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return c.json(users)
})