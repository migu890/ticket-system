import { computed, ref } from 'vue'
import type {
  AuthenticatedUserDTO,
  LoginDTO
} from '@ticket-system/shared'

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest
} from '../api/authApi'

const user = ref<AuthenticatedUserDTO | null>(null)

export const useAuth = () => {
  const isAuthenticated = computed(
    () => user.value !== null
  )

  const isAdmin = computed(
    () => user.value?.role === 'ADMIN'
  )

  const login = async (
    credentials: LoginDTO
  ) => {
    user.value =
      await loginRequest(credentials)
  }

  const logout = async () => {
    await logoutRequest()
    user.value = null
  }

  const loadUser = async () => {
    try {
      user.value =
        await getCurrentUser()
    } catch {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loadUser
  }
}