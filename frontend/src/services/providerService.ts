import { providerAPIEnvs } from '@/settings/env'
import apiBase, { type AxiosResponse } from './baseService'
import type {
  Provider,
  ProviderChangePassword,
  ProviderChangeSelfPassword
} from '@/views/providers/types'
import type { PaginatedResponse } from '@/types/shared'

const urlProvider = providerAPIEnvs.providerUrl

export const providerService = {
  /**
   * Get paginated list of providers with optional search
   */
  listProvider: (
    page: number | null = null,
    search: string | null = null
  ): Promise<AxiosResponse<PaginatedResponse<Provider>>> => {
    const params: Record<string, string | number> = {
      ...(page && { page: page }),
      ...(search && { search: search })
    }
    return apiBase.get(`${urlProvider}/list-pagination/`, { params })
  },

  /**
   * Search providers by term with pagination
   */
  searchProviders: (
    searchTerm: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Provider>>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlProvider}/list-pagination/`, { params })
  },

  /**
   * Get all providers (no pagination)
   */
  listAllProviders: (): Promise<AxiosResponse<Provider[]>> => apiBase.get(`${urlProvider}/`),

  /**
   * Get providers with free orders for a specific currency
   */
  listProviderCurrencyOrderNoBill: (currency: number): Promise<AxiosResponse<Provider[]>> =>
    apiBase.get(`${urlProvider}/get-provider-order-currency-no-bill/${currency}/`),

  /**
   * Get a single provider by ID
   */
  detailProvider: (id: number): Promise<AxiosResponse<Provider>> =>
    apiBase.get(`${urlProvider}/${id}/`),

  /**
   * Create a new provider
   */
  postProvider: (provider: Omit<Provider, 'id'>): Promise<AxiosResponse<Provider>> =>
    apiBase.post(`${urlProvider}/`, provider),

  /**
   * Update an existing provider
   */
  putProvider: (provider: Provider): Promise<AxiosResponse<Provider>> =>
    apiBase.put(`${urlProvider}/${provider.id}/`, provider),

  /**
   * Delete a provider by ID
   */
  deleteProvider: (id: number): Promise<void> => apiBase.delete(`${urlProvider}/${id}/`),

  /**
   * Change password (self - authenticated user)
   */
  changeSelfPassword: (
    credentials: ProviderChangeSelfPassword
  ): Promise<AxiosResponse<{ detail: string }>> =>
    apiBase.post(`${urlProvider}/change-password/`, credentials),

  /**
   * Change password (admin - for any user)
   */
  changePassword: (
    id: number,
    credentials: ProviderChangePassword
  ): Promise<AxiosResponse<{ detail: string }>> =>
    apiBase.post(`${urlProvider}/${id}/admin-reset-password/`, credentials)
}
