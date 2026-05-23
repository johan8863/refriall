import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const REFRESH_URL = import.meta.env.VITE_REFRESH_TOKEN_URL

const clearStateAndStorage = async () => {
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

const apiBase = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiBase.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('refriall_auth_access_token')
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      if (!originalRequest._retry) {
        try {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem('refriall_auth_refresh_token')
          if (!refreshToken) {
            throw new Error('No refreshtoken available')
          }

          if (originalRequest.url.includes(REFRESH_URL)) {
            // clear state and storage
            await clearStateAndStorage()
            return Promise.reject(error)
          }

          const { data } = await apiBase.post(REFRESH_URL, { refresh: refreshToken })
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

export default apiBase
