// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { authAPI } from '@/services/authAPI'
import type { LoginCredentials } from '@/services/authAPI'

/**
 * Authentication store using Pinia
 */
export const useAuthStore = defineStore('authStore', () => {
  // ============================================================
  // STATE
  // ============================================================

  /** Whether authentication is in progress */
  const isLoadingAuth: Ref<boolean> = ref(false)

  /** Whether user is authenticated */
  const isAuthenticated: Ref<boolean> = ref(false)

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Authenticate user with credentials
   * @param credentials - Username and password
   * @throws {Error} If authentication fails
   */
  const authenticate = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoadingAuth.value = true

      const { data } = await authAPI.tokenPair(credentials)
      const { access, refresh } = data

      // Store tokens
      localStorage.setItem('refriall_auth_access_token', access)
      localStorage.setItem('refriall_auth_refresh_token', refresh)

      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false

      // Clear tokens on failure
      localStorage.removeItem('refriall_auth_access_token')
      localStorage.removeItem('refriall_auth_refresh_token')

      throw error
    } finally {
      isLoadingAuth.value = false
    }
  }

  /**
   * Reset authentication state and clear tokens
   */
  const $reset = (): void => {
    isAuthenticated.value = false
    isLoadingAuth.value = false
    localStorage.removeItem('refriall_auth_access_token')
    localStorage.removeItem('refriall_auth_refresh_token')
  }

  /**
   * Initialize authentication state from localStorage
   * Should be called on app startup
   */
  const initAuth = (): void => {
    const access = localStorage.getItem('refriall_auth_access_token')
    isAuthenticated.value = !!access
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // State
    isAuthenticated,
    isLoadingAuth,

    // Actions
    initAuth,
    authenticate,
    $reset
  }
})
