import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { getUserBySession } from '../../application/services/authService.js'

export const authMiddleware = async (
  c: Context,
  next: Next
) => {
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

    c.set('user', user)

    await next()
  } catch {
    return c.json(
      {
        message: 'Nicht authentifiziert'
      },
      401
    )
  }
}