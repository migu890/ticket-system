import argon2 from 'argon2'
import { prisma } from '../../infrastructure/prisma/prismaClient.js'
import {
  createSessionToken,
  hashSessionToken
} from '../../infrastructure/security/tokenService.js'
import { AppError } from '../errors/AppError.js'

export const login = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    throw new AppError(401, 'E-Mail oder Passwort ist ungültig')
  }

  const passwordValid = await argon2.verify(
    user.passwordHash,
    password
  )

  if (!passwordValid) {
    throw new AppError(401, 'E-Mail oder Passwort ist ungültig')
  }

  const token = createSessionToken()
  const tokenHash = hashSessionToken(token)

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 8)

  await prisma.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt
    }
  })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

export const logout = async (
  token: string
): Promise<void> => {
  const tokenHash = hashSessionToken(token)

  await prisma.session.deleteMany({
    where: {
      tokenHash
    }
  })
}

export const getUserBySession = async (
  token: string
) => {
  const tokenHash = hashSessionToken(token)

  const session = await prisma.session.findUnique({
    where: {
      tokenHash
    },
    include: {
      user: true
    }
  })

  if (!session) {
    throw new AppError(401, 'Nicht authentifiziert')
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id
      }
    })

    throw new AppError(401, 'Session ist abgelaufen')
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role
  }
}