import { defineStore } from "pinia";
import { ref } from "vue";
import { authAPI } from "../services/authAPI";

export const useAuthStore = defineStore('authStore', () => {
    const isLoadingAuth = ref(false)
    const isAuthenticated = ref(false)

    const login = async (credentials) => {
        try {
            // auth loading state
            isLoadingAuth.value = true
            // getting data
            const { data } = await authAPI.tokenPair(credentials)
            const { access, refresh } = data
            // storing tokens
            localStorage.setItem('refriall_auth_access_token', access)
            localStorage.setItem('refriall_auth_refresh_token', refresh)
            // authentication state
            isAuthenticated.value = true
        } catch (error) {
            // authemtication state
            isAuthenticated.value = false
            // tokens cleaning
            localStorage.removeItem('refriall_auth_access_token')
            localStorage.removeItem('refriall_auth_refresh_token')
            // re throw error for reusing in components
            throw error
        } finally {
            isLoadingAuth.value = false
        }
    }

    const logout = () => {
        localStorage.removeItem('refriall_auth_access_token')
        localStorage.removeItem('refriall_auth_refresh_token')
    }

    const initAuth = () => {
        const access = localStorage.getItem('refriall_auth_access_token')
        isAuthenticated.value = !!access
    }

    return {
        isAuthenticated,
        isLoadingAuth,
        initAuth,
        login
    }
})