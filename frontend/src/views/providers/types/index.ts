import type { PaginatedResponse } from '@/types/shared'

/**
 * Provider model - matches Django Provider model
 */
export interface Provider {
  id?: number
  username: string
  first_name: string
  last_name: string
  tcp_code: string
  license_number: string
  personal_id: string
  bank_account_header: string
  bank_account: string
  address: string
  activity: string
  // Password fields are only used in forms, not in the API response
  password?: string
  confirm_password?: string
}

/**
 * Data for creating a new provider (without id)
 */
export type ProviderCreate = Omit<Provider, 'id'>

/**
 * Data for changing password (admin)
 */
export interface ProviderChangePassword {
  confirm_new_password: string
  new_password: string
}

/**
 * Data for changing password (self)
 */
export interface ProviderChangeSelfPassword {
  current_password: string
  new_password: string
  confirm_new_password: string
}

/**
 * Form errors for provider form validation
 */
export type ProviderFormErrors = {
  username?: string[]
  first_name?: string[]
  last_name?: string[]
  tcp_code?: string[]
  bank_account_header?: string[]
  bank_account?: string[]
  address?: string[]
  activity?: string[]
  license_number?: string[]
  password?: string[]
  confirm_password?: string[]
  personal_id?: string[]
  non_field_errors?: string[]
  network?: string
}

/**
 * Form errors for password change
 */
export type PasswordChangeErrors = {
  current_password?: string[]
  new_password?: string[]
  confirm_new_password?: string[]
  non_field_errors?: string[]
  network?: string
}
