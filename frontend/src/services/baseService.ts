import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError
} from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const REFRESH_URL = import.meta.env.VITE_REFRESH_TOKEN_URL as string

/**
 * Response structure for refresh token endpoint
 */
interface RefreshTokenResponse {
  access: string
  refresh?: string
}

/**
 * Extended request config with retry flag
 */
interface RequesConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * Clears authentication state and redirects to login
 */
const clearStateAndStorage = async (): Promise<void> => {
  const { useAuthStore } = await import('../stores/authStore')
  const authStore = useAuthStore()
  authStore.isAuthenticated = false
  localStorage.removeItem('refriall_auth_access_token')
  localStorage.removeItem('refriall_auth_refresh_token')

  if (window.location.pathname !== '/login') {
    const currentPath = window.location.pathname
    window.location.href = `/login?redirect=${currentPath}`
  }
}

/**
 * Axios instance
 */
const apiBase = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiBase.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const access = localStorage.getItem('refriall_auth_access_token')
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
)

apiBase.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as RequesConfigWithRetry

    // Handle 401 errors, and not on login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Prevent infinite retry loops
      if (!originalRequest._retry) {
        try {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem('refriall_auth_refresh_token')
          if (!refreshToken) {
            throw new Error('No refreshtoken available')
          }

          // If the original request was the refresh itself, we can't recover
          if (originalRequest.url.includes(REFRESH_URL)) {
            // clear state and storage
            await clearStateAndStorage()
            return Promise.reject(error)
          }

          const { data } = await apiBase.post<RefreshTokenResponse>(REFRESH_URL, {
            refresh: refreshToken
          })
          const { access } = data

          localStorage.setItem('refriall_auth_access_token', access)

          originalRequest.headers.Authorization = `Bearer ${access}`

          return apiBase(originalRequest)
        } catch (refreshError) {
          // clear state and storage
          await clearStateAndStorage()
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Type-safe HTTP client
 *
 * @example
 * ```typescript
 * // GET request
 * const customers = await apiBase.get<Customer[]>('/hr/customers/')
 * // customers is typed as Customer[]
 *
 * // POST request
 * const newCustomer = await apiBase.post<Customer>('/hr/customers/', { name: 'Test' })
 * // newCustomer is typed as Customer
 * ```
 */
export default apiBase

/**
 * Export types for convenience
 */
export type { AxiosRequestConfig, AxiosResponse, AxiosError, RefreshTokenResponse }
