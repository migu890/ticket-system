import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { loginSchema } from '@ticket-system/shared'
import {
  login,
  logout,
  getUserBySession
} from '../../application/services/authService.js'

export const authRoutes = new Hono()

authRoutes.post('/login', async (c) => {
  const body = await c.req.json()

  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(
      {
        message: 'Ungültige Eingabedaten'
      },
      400
    )
  }

  try {
    const result = await login(
      parsed.data.email,
      parsed.data.password
    )

const isProduction =
  process.env.NODE_ENV === 'production'

setCookie(c, 'session', result.token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction
    ? 'None'
    : 'Lax',
  path: '/',
  maxAge: 60 * 60 * 8
})

    return c.json(result.user)
  } catch (error) {
    return c.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Login fehlgeschlagen'
      },
      401
    )
  }
})

authRoutes.post('/logout', async (c) => {
  const token = getCookie(c, 'session')

  if (token) {
    await logout(token)
  }

  deleteCookie(c, 'session', {
    path: '/'
  })

  return c.json({
    message: 'Logout erfolgreich'
  })
})

authRoutes.get('/me', async (c) => {
  const token = getCookie(c, 'session')

  if (!token) {
    return c.json(
      {
        message: 'Nicht authentifiziert'
      },
      401
    )
  }

  try {
    const user = await getUserBySession(token)

    return c.json(user)
  } catch {
    return c.json(
      {
        message: 'Nicht authentifiziert'
      },
      401
    )
  }
})