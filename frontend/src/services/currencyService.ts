import { currenciesAPIEnvs } from '../settings/env'
import apiBase from './baseService'
import type { Currency } from '../views/currencies/types'
import type { PaginatedResponse } from '../types/shared'

const url = currenciesAPIEnvs.currenciesUrl

export const currencyService = {
  /**
   * Get all currencies (no pagination)
   * @returns Promise with all currencies
   */
  listCurrencies: (): Promise<Currency[]> => apiBase.get(`${url}/`),

  /**
   * Get paginated list of currencies with optional search
   * @param currentPage - Page number (optional)
   * @param searchTerm - Search term (optional)
   * @returns Promise with paginated response
   */
  listCurrencyPagination: (
    currentPage: number | null = null,
    searchTerm: string | null = null
  ): Promise<PaginatedResponse<Currency>> => {
    const params: Record<string, string | number> = {
      ...(currentPage && { page: currentPage }),
      ...(searchTerm && { search: searchTerm })
    }
    return apiBase.get(`${url}/list-pagination/`, { params })
  },
  /**
   * Search currencies by term with pagination
   * @param searchTerm - Search term
   * @param page - Page number (default: 1)
   * @returns Promise with paginated response
   */
  searchCurrency: (searchTerm: string, page: number = 1): Promise<PaginatedResponse<Currency>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${url}/list-pagination/`, { params })
  },

  /**
   * Get a single currency by ID
   * @param id - Currency ID
   * @returns Promise with currency data
   */
  detailCurrency: (id: number): Promise<Currency> => {
    return apiBase.get(`${url}/${id}/`)
  },

  /**
   * Create a new currency
   * @param currency - Currency data (without id)
   * @returns Promise with created currency
   */
  postCurrency: (currency: Omit<Currency, 'id'>): Promise<Currency> => {
    return apiBase.post(`${url}/`, currency)
  },

  /**
   * Update an existing currency
   * @param currency - Currency data (with id)
   * @returns Promise with updated currency
   */
  putCurrency: (currency: Currency): Promise<Currency> => {
    return apiBase.put(`${url}/${currency.id}/`, currency)
  },

  /**
   * Delete a currency by ID
   * @param id - Currency ID
   * @returns Promise void
   */
  deleteCurrency: (id: number): Promise<void> => {
    return apiBase.delete(`${url}/${id}/`)
  }
}
