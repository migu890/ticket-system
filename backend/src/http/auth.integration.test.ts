import {
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'

import { app } from '../app.js'

import {
  prisma
} from '../infrastructure/prisma/prismaClient.js'

import argon2 from 'argon2'

describe(
  'Auth Integration Tests',
  () => {
    beforeEach(
      async () => {
        await prisma.session.deleteMany()
        await prisma.ticket.deleteMany()
        await prisma.user.deleteMany()

        const passwordHash =
          await argon2.hash(
            'Test123!'
          )

        await prisma.user.create({
          data: {
            name: 'Test User',
            email:
              'test@example.com',
            passwordHash,
            role: 'USER'
          }
        })
      }
    )

    it(
      'meldet einen Benutzer erfolgreich an',
      async () => {
        const response =
          await app.request(
            '/api/auth/login',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json'
              },
              body: JSON.stringify({
                email:
                  'test@example.com',
                password:
                  'Test123!'
              })
            }
          )

        expect(
          response.status
        ).toBe(200)

        const body =
          await response.json()

        expect(body).toMatchObject({
          name: 'Test User',
          email:
            'test@example.com',
          role: 'USER'
        })
      }
    )

    it(
      'lehnt ein falsches Passwort ab',
      async () => {
        const response =
          await app.request(
            '/api/auth/login',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json'
              },
              body: JSON.stringify({
                email:
                  'test@example.com',
                password:
                  'Falsch123!'
              })
            }
          )

        expect(
          response.status
        ).toBe(401)
      }
    )
  }
)