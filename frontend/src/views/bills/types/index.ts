// views/bills/types/index.ts
import type { PaginatedResponse } from '@/types/shared'
import type { Customer } from '@/views/customers/types'
import type { Provider } from '@/views/providers/types'
import type { Currency } from '@/views/currencies/types'
import type { Order, OrderDetail } from '@/views/orders/types'

/**
 * Order folio reference (used in get_orders_folio)
 */
export interface OrderFolio {
  folio: string
}

/**
 * Bill model - matches Django Bill model
 */
export interface Bill {
  id: number
  customer: number | null
  currency: number | null
  folio: string
  provider: number | null
  provider_signature_date: string
  customer_signature_date: string | null
  orders: number[]
  check_number: string | null
  charge_aprove: string | null
  charge_check: string | null
  customer_charge: string | null
  customer_name: string | null
  customer_personal_id: string | null
  checked_by: string | null
  aproved_by: string | null
}

/**
 * Bill with nested relations - used in detail view (BillSerializerForReadOnly)
 */
export interface BillDetail {
  id: number
  customer: Customer | null
  currency: Currency
  folio: string
  orders: Order[] | null
  provider: Provider | null
  provider_signature_date: string
  customer_signature_date: string | null
  get_orders: OrderDetail[]
  get_orders_folio: OrderFolio[]
  get_total_amount: number
  get_total_amount_revision: number
  get_total_amount_prod: number
  get_total_amount_concept: number
  get_total_amount_repair: number
  get_total_amount_maintenace: number
  get_total_amount_install: number
  get_total_amount_unmounting: number
  check_number: string | null
  charge_aprove: string | null
  charge_check: string | null
  customer_charge: string | null
  customer_name: string | null
  customer_personal_id: string | null
  checked_by: string | null
  aproved_by: string | null
}

/**
 * Bill for list view (simplified - BillSerializerReadListView)
 */
export interface BillListItem {
  id: number
  customer: Customer
  folio: string
  get_total_amount: number
  provider_signature_date: string
}

/**
 * Bill for delete view (minimal data)
 */
export interface BillForDelete {
  id: number
  folio: string
}

/**
 * Data for creating a new bill
 */
export type BillCreate = Omit<
  Bill,
  | 'id'
  | 'get_orders'
  | 'get_orders_folio'
  | 'get_total_amount'
  | 'get_total_amount_revision'
  | 'get_total_amount_prod'
  | 'get_total_amount_concept'
  | 'get_total_amount_repair'
  | 'get_total_amount_maintenace'
  | 'get_total_amount_install'
  | 'get_total_amount_unmounting'
>

/**
 * Data for updating an existing bill
 */
export type BillUpdate = BillCreate & { id: number }

/**
 * Paginated response from the API
 */
export type BillListResponse = PaginatedResponse<BillListItem>

/**
 * Form errors for bill form validation
 */
export type BillFormErrors = {
  customer?: string[]
  currency?: string[]
  folio?: string[]
  provider?: string[]
  provider_signature_date?: string[]
  customer_signature_date?: string[]
  orders?: string[]
  non_field_errors?: string[]
}
