import { currenciesAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type { Currency } from '@/views/currencies/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from 'axios'

const url = currenciesAPIEnvs.currenciesUrl

export const currencyService = {
  /**
   * Get all currencies (no pagination)
   * @returns Promise with all currencies
   */
  listCurrencies: (): Promise<AxiosResponse<Currency[]>> => apiBase.get(`${url}/`),

  /**
   * Get paginated list of currencies
   * @param page - Page number (optional)
   * @returns Promise with paginated response
   */
  listCurrencyPagination: (
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Currency>>> => {
    return apiBase.get(`${url}/list-pagination/`, { params: { page } })
  },
  /**
   * Search currencies by term with pagination
   * @param search - Search term
   * @param page - Page number (default: 1)
   * @returns Promise with paginated response
   */
  searchCurrency: (
    search: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Currency>>> => {
    return apiBase.get(`${url}/list-pagination/`, { params: { search, page } })
  },

  /**
   * Get a single currency by ID
   * @param id - Currency ID
   * @returns Promise with currency data
   */
  detailCurrency: (id: number): Promise<AxiosResponse<Currency>> => apiBase.get(`${url}/${id}/`),

  /**
   * Create a new currency
   * @param currency - Currency data (without id)
   * @returns Promise with created currency
   */
  postCurrency: (currency: Omit<Currency, 'id'>): Promise<AxiosResponse<Currency>> =>
    apiBase.post(`${url}/`, currency),

  /**
   * Update an existing currency
   * @param currency - Currency data (with id)
   * @returns Promise with updated currency
   */
  putCurrency: (currency: Currency): Promise<AxiosResponse<Currency>> =>
    apiBase.put(`${url}/${currency.id}/`, currency),

  /**
   * Delete a currency by ID
   * @param id - Currency ID
   * @returns Promise void
   */
  deleteCurrency: (id: number): Promise<void> => apiBase.delete(`${url}/${id}/`)
}
