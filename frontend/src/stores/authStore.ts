// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { authAPI } from '@/services/authAPI'
import type { LoginCredentials } from '@/services/authAPI'

const ACCESS_KEY = 'refriall_auth_access_token'
const REFRESH_KEY = 'refriall_auth_refresh_token'

interface JwtPayload {
  exp: number
  [key: string]: any
}

/**
 * Returns true if the JWT has a valid (non-expired) exp claim.
 * Returns false for malformed tokens or tokens without exp.
 */
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false
  try {
    const { exp } = jwtDecode<JwtPayload>(token)
    return typeof exp === 'number' && exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const useAuthStore = defineStore('authStore', () => {
  // ============================================================
  // STATE
  // ============================================================

  const isLoadingAuth: Ref<boolean> = ref(false)
  const isAuthenticated: Ref<boolean> = ref(false)

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Authenticate user with credentials.
   * @throws {Error} If authentication fails
   */
  const authenticate = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoadingAuth.value = true

      const { data } = await authAPI.tokenPair(credentials)
      const { access, refresh } = data

      localStorage.setItem(ACCESS_KEY, access)
      localStorage.setItem(REFRESH_KEY, refresh)

      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
      throw error
    } finally {
      isLoadingAuth.value = false
    }
  }

  /**
   * Hydrate auth state from localStorage.
   * Must be called on app startup (main.ts) AND at the top of the
   * router guard, because the store lives in memory and is lost on
   * every full page reload (F5, cy.visit, new tab).
   *
   * Uses the refresh token as the source of truth (same condition the
   * router guard evaluates) and validates its exp claim.
   */
  const initAuth = (): void => {
    const refresh = localStorage.getItem(REFRESH_KEY)
    isAuthenticated.value = isTokenValid(refresh)
  }

  /**
   * Clear auth state and tokens.
   */
  const logout = (): void => {
    isAuthenticated.value = false
    isLoadingAuth.value = false
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    isAuthenticated,
    isLoadingAuth,
    initAuth,
    authenticate,
    logout
  }
})
