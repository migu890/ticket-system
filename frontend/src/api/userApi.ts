import type { UserDTO } from '@ticket-system/shared'
import { apiRequest } from './apiClient'

export const getUsers = () => {
  return apiRequest<UserDTO[]>(
    '/users'
  )
}