import { Hono } from 'hono'
import { cors } from 'hono/cors'

import {
  authRoutes
} from './http/routes/authRoutes.js'

import {
  ticketRoutes
} from './http/routes/ticketRoutes.js'

import {
  userRoutes
} from './http/routes/userRoutes.js'

export const app = new Hono()

const frontendUrl =
  process.env.FRONTEND_URL ??
  'http://localhost:5173'

app.use(
  '*',
  cors({
    origin: frontendUrl,
    credentials: true
  })
)

app.get('/health', (c) => {
  return c.json({
    status: 'ok'
  })
})

app.route(
  '/api/auth',
  authRoutes
)

app.route(
  '/api/tickets',
  ticketRoutes
)

app.route(
  '/api/users',
  userRoutes
)

app.onError(
  (error, c) => {
    console.error(error)

    return c.json(
      {
        message:
          'Interner Serverfehler'
      },
      500
    )
  }
)