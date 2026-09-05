import { authAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type { AxiosResponse } from 'axios'

/**
 * Credentials for login
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Response from token pair endpoint
 */
export interface TokenPairResponse {
  access: string
  refresh: string
}

/**
 * Request for token refresh
 */
export interface RefreshTokenRequest {
  refresh: string
}

/**
 * Authentication API service
 */
export const authAPI = {
  /**
   * Get token pair (access + refresh)
   * @param credentials - Username and password
   * @returns Promise with token pair
   */
  tokenPair: (credentials: LoginCredentials): Promise<AxiosResponse<TokenPairResponse>> => {
    return apiBase.post<TokenPairResponse>(authAPIEnvs.tokenPairUrl, credentials)
  },

  /**
   * Refresh access token using refresh token
   * @param refresh - Refresh token
   * @returns Promise with new token pair
   */
  tokenRefresh: (refresh: RefreshTokenRequest): Promise<AxiosResponse<TokenPairResponse>> => {
    return apiBase.post<TokenPairResponse>(authAPIEnvs.refreshTokenUrl, refresh)
  }
}
