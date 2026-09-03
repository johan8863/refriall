import { customerAPIEnvs } from '../settings/env'
import apiBase from './baseService'
import type { Customer, CustomerCreate, CustomerDetail } from '../views/customers/types'
import type { PaginatedResponse } from '../types/shared'
import type { AxiosResponse } from 'axios'

const urlCustomer = customerAPIEnvs.customerUrl

export const customerService = {
  /**
   * Get paginated list of customers with optional search
   * @param currentPage - Page number (optional)
   * @param searchTerm - Search term (optional)
   * @returns Promise with paginated response
   */
  listCustomer: (
    currentPage: number | null = null,
    searchTerm: string | null = null
  ): Promise<AxiosResponse<PaginatedResponse<Customer>>> => {
    const params: Record<string, string | number> = {}
    if (currentPage) params.page = currentPage
    if (searchTerm) params.search = searchTerm
    return apiBase.get(`${urlCustomer}/list-pagination/`, { params })
  },

  /**
   * Search customers by term with pagination
   * @param searchTerm - Search term
   * @param page - Page number (default: 1)
   * @returns Promise with paginated response
   */
  searchCustomers: (
    searchTerm: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Customer>>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlCustomer}/list-pagination/`, { params })
  },

  /**
   * Get all customers (no pagination)
   * @returns Promise with all customers
   */
  listAllCustomers: (): Promise<AxiosResponse<Customer[]>> => {
    return apiBase.get(`${urlCustomer}/`)
  },

  /**
   * Get customers with free orders for a specific currency and provider
   * @param currency - Currency ID
   * @param provider - Provider ID
   * @returns Promise with customers list
   */
  listCustomerOrdersNoBill: (
    currency: number,
    provider: number
  ): Promise<AxiosResponse<Customer[]>> => {
    return apiBase.get(
      `${urlCustomer}/customer-order-currency-provider-no-bill/${currency}/${provider}/`
    )
  },

  /**
   * Get a single customer by ID (includes dependencies)
   * @param id - Customer ID
   * @returns Promise with customer detail data
   */
  detailCustomer: (id: number): Promise<AxiosResponse<CustomerDetail>> => {
    return apiBase.get(`${urlCustomer}/${id}/`)
  },

  /**
   * Create a new customer
   * @param customer - Customer data (without id)
   * @returns Promise with created customer
   */
  postCustomer: (customer: CustomerCreate): Promise<AxiosResponse<Customer>> => {
    return apiBase.post(`${urlCustomer}/`, customer)
  },

  /**
   * Update an existing customer
   * @param customer - Customer data (with id)
   * @returns Promise with updated customer
   */
  putCustomer: (customer: Customer): Promise<AxiosResponse<Customer>> => {
    return apiBase.put(`${urlCustomer}/${customer.id}/`, customer)
  },

  /**
   * Delete a customer by ID
   * @param id - Customer ID
   * @returns Promise void
   */
  deleteCustomer: (id: number): Promise<AxiosResponse<void>> => {
    return apiBase.delete(`${urlCustomer}/${id}/`)
  }
}

// Export types for convenience
export type { Customer, CustomerCreate, CustomerDetail }
