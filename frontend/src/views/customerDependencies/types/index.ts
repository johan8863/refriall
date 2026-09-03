import type { PaginatedResponse } from '@/types/shared'
import type { Customer } from '@/views/customers/types'

/**
 * Customer dependency model - matches Django CustomerDependency model
 */
export interface CustomerDependency {
  id: number
  customer: number | Customer
  name: string
  address: string
  province: string
  township: string
  // Read-only properties from the model
  get_bank_account_header?: string
  get_bank_account?: string
}

/**
 * Customer dependency with customer details
 */
export interface CustomerDependencyDetail extends CustomerDependency {
  customer: Customer
}

/**
 * Data for creating a new customer dependency (without id)
 */
export type CustomerDependencyCreate = Omit<CustomerDependency, 'id'>

/**
 * Data for updating an existing customer dependency
 */
export type CustomerDependencyUpdate = CustomerDependency

/**
 * Paginated response from the API
 */
export type CustomerDependencyListResponse = PaginatedResponse<CustomerDependency>

/**
 * Form errors for customer dependency form validation
 */
export type CustomerDependencyFormErrors = {
  customer?: string[]
  name?: string[]
  address?: string[]
  province?: string[]
  township?: string[]
}
