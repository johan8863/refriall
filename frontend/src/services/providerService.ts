import type { AxiosResponse } from 'axios'
import { providerAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type {
  Provider,
  ProviderChangePassword,
  ProviderChangeSelfPassword
} from '@/views/providers/types'
import type { PaginatedResponse } from '@/types/shared'

const urlProvider = providerAPIEnvs.providerUrl

export const providerService = {
  /**
   * Get paginated list of providers
   */
  listProvider: (page: number = 1): Promise<AxiosResponse<PaginatedResponse<Provider>>> => {
    return apiBase.get(`${urlProvider}/list-pagination/`, { params: { page } })
  },

  /**
   * Search providers by term with pagination
   */
  searchProviders: (
    search: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Provider>>> => {
    return apiBase.get(`${urlProvider}/list-pagination/`, { params: { search, page } })
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
