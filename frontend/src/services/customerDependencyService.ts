import apiBase from './baseService'
import type {
  CustomerDependency,
  CustomerDependencyCreate,
  CustomerDependencyDetail
} from '@/views/customerDependencies/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from 'axios'

const urlCustomerDependency = '/hr/dependencies'

export const customerDependencyService = {
  /**
   * Search customer dependencies by customer ID and search term
   * @param customerId - Customer ID
   * @param searchTerm - Search term
   * @returns Promise with dependencies list
   */
  searchCustomerDependencies: (
    customerId: number,
    searchTerm: string
  ): Promise<AxiosResponse<CustomerDependency[]>> => {
    const params: Record<string, string | number> = { search: searchTerm }
    return apiBase.get(`${urlCustomerDependency}/?customer=${customerId}`, { params })
  },

  /**
   * Get all customer dependencies (no pagination)
   * @returns Promise with all dependencies
   */
  listCustomerDependency: (): Promise<AxiosResponse<CustomerDependency[]>> => {
    return apiBase.get(`${urlCustomerDependency}/`)
  },

  /**
   * Get paginated list of customer dependencies with optional search
   * @param page - Page number
   * @returns Promise with paginated response
   */
  listCustomerDependencyPagination: (
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<CustomerDependency>>> => {
    return apiBase.get(`${urlCustomerDependency}/list-pagination/`, { params: { page } })
  },

  /**
   * Search customer dependencies with pagination
   * @param search - Search term
   * @param page - Page number (default: 1)
   * @returns Promise with paginated response
   */
  searchCustomerDependency: (
    search: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<CustomerDependency>>> => {
    return apiBase.get(`${urlCustomerDependency}/list-pagination/`, { params: { search, page } })
  },

  /**
   * Get a single customer dependency by ID
   * @param id - Customer dependency ID
   * @returns Promise with dependency data
   */
  detailCustomerDependency: (id: number): Promise<AxiosResponse<CustomerDependencyDetail>> => {
    return apiBase.get(`${urlCustomerDependency}/${id}/`)
  },

  /**
   * Create a new customer dependency
   * @param dependency - Dependency data (without id)
   * @returns Promise with created dependency
   */
  postCustomerDependency: (
    dependency: CustomerDependencyCreate
  ): Promise<AxiosResponse<CustomerDependency>> => {
    return apiBase.post(`${urlCustomerDependency}/`, dependency)
  },

  /**
   * Update an existing customer dependency
   * @param dependency - Dependency data (with id)
   * @returns Promise with updated dependency
   */
  putCustomerDependency: (
    dependency: CustomerDependency
  ): Promise<AxiosResponse<CustomerDependency>> => {
    return apiBase.put(`${urlCustomerDependency}/${dependency.id}/`, dependency)
  },

  /**
   * Delete a customer dependency by ID
   * @param id - Customer dependency ID
   * @returns Promise void
   */
  deleteCustomerDependency: (id: number): Promise<AxiosResponse<void>> => {
    return apiBase.delete(`${urlCustomerDependency}/${id}/`)
  }
}

// Export types for convenience
export type { CustomerDependency, CustomerDependencyCreate }
