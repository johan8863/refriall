import type { PaginatedResponse } from '../../../types/shared'

/**
 * Customer type options from Django model
 */
export type CustomerType = 'es' | 'pr'

/**
 * Customer dependency model
 */
export interface CustomerDependency {
  id: number
  customer: number
  name: string
  address: string
  province: string
  township: string
}

/**
 * Customer model - matches Django Customer model
 */
export interface Customer {
  id: number
  customer_type: CustomerType
  name: string
  address: string
  province: string
  township: string
  code: string
  client_nit: string | null
  bank_account_header: string
  bank_account: string
}

/**
 * Customer with dependencies - used in detail view (CustomerDetailSerializer)
 */
export interface CustomerDetail extends Customer {
  get_dependencies: CustomerDependency[]
}

/**
 * Data for creating a new customer (without id)
 */
export type CustomerCreate = Omit<Customer, 'id'>

/**
 * Data for updating an existing customer
 */
export type CustomerUpdate = Customer

/**
 * Paginated response from the API
 */
export type CustomerListResponse = PaginatedResponse<Customer>

/**
 * Form errors for customer form validation
 */
export type CustomerFormErrors = {
  customer_type?: string[]
  name?: string[]
  address?: string[]
  province?: string[]
  township?: string[]
  code?: string[]
  client_nit?: string[]
  bank_account_header?: string[]
  bank_account?: string[]
}

/**
 * Customer type labels for display
 */
export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  es: 'ESTATAL',
  pr: 'PARTICULAR'
}

/**
 * Customer type options for select
 */
export const CUSTOMER_TYPE_OPTIONS: Array<{ value: CustomerType; label: string }> = [
  { value: 'es', label: 'ESTATAL' },
  { value: 'pr', label: 'PARTICULAR' }
]
