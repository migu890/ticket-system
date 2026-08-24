import type { Context, Next } from 'hono'
import type { AppBindings } from '../../types/app.js'

export const adminMiddleware = async (
  c: Context<AppBindings>,
  next: Next
) => {
  const user = c.get('user')

  if (user.role !== 'ADMIN') {
    return c.json(
      {
        message: 'Keine Berechtigung'
      },
      403
    )
  }

  await next()
}