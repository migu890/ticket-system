import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const authenticatedUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN'])
})

export type LoginDTO = z.infer<typeof loginSchema>

export type AuthenticatedUserDTO =
  z.infer<typeof authenticatedUserSchema>