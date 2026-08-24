import type {
  AuthenticatedUserDTO,
  LoginDTO
} from '@ticket-system/shared'

import { apiRequest } from './apiClient'

export const login = (
  credentials: LoginDTO
) => {
  return apiRequest<AuthenticatedUserDTO>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials)
    }
  )
}

export const logout = () => {
  return apiRequest<void>(
    '/auth/logout',
    {
      method: 'POST'
    }
  )
}

export const getCurrentUser = () => {
  return apiRequest<AuthenticatedUserDTO>(
    '/auth/me'
  )
}