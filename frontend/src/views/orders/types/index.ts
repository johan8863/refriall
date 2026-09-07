import type { PaginatedResponse } from '@/types/shared'
import type { Customer, CustomerDependency } from '@/views/customers/types'
import type { Provider } from '@/views/providers/types'
import type { Kit } from '@/views/kits/types'
import type { Currency } from '@/views/currencies/types'
import type { Item } from '@/services/itemService'

/**
 * Order support type options
 */
export type SupportType = 'i' | 't'

/**
 * Item time - represents an item in an order with quantity
 */
export interface ItemTime {
  id?: number
  item: number | Item
  order?: number | Order
  times: number
}

/**
 * Item time for order (uses ItemOrder)
 */
export interface ItemTimeOrder {
  id?: number
  item: number | Item
  order?: number | Order
  times: number
}

/**
 * Order model - matches Django Order model
 */
export interface Order {
  id?: number
  bill: number | null
  customer: number | Customer | null
  customer_depedency: number | CustomerDependency | null
  symptom: string
  flaw: string
  repair_description: string
  folio: string
  check_diagnosis: boolean
  repain: boolean
  install: boolean
  maintenance: boolean
  support: SupportType
  kit: number | Kit
  kit_brand: string
  kit_model: string
  kit_serial: string
  job_description: string | null
  itemtime_set: ItemTime[]
  provider: number | Provider
  provider_signature_date: string
  customer_signature_date: string
  currency: number | Currency
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
 * Order with nested relations - used in detail view
 */
export interface OrderDetail extends Omit<
  Order,
  'customer' | 'customer_dependency' | 'kit' | 'provider' | 'currency'
> {
  customer: Customer
  customer_dependency: CustomerDependency
  kit: Kit
  provider: Provider
  currency: Currency
  itemtime_set: ItemTime[]
  itemtimeorder_set: ItemTimeOrder[]
  get_total_amount: number
  get_total_amount_revision: number
  get_total_amount_prod: number
  get_total_amount_concept: number
  get_total_amount_repair: number
  get_total_amount_maintenace: number
  get_total_amount_install: number
  get_total_amount_unmounting: number
  get_order_support: string
}

/**
 * Order for list view (simplified)
 */
export interface OrderList {
  id: number
  customer: Customer | null
  customer_dependency: CustomerDependency | null
  folio: string
  get_total_amount: number
}

/**
 * Data for creating a new order (without id and read-only fields)
 */
export type OrderCreate = Omit<
  Order,
  | 'id'
  | 'bill'
  | 'get_total_amount'
  | 'get_total_amount_revision'
  | 'get_total_amount_prod'
  | 'get_total_amount_concept'
  | 'get_total_amount_repair'
  | 'get_total_amount_maintenace'
  | 'get_total_amount_install'
  | 'get_total_amount_unmounting'
  | 'get_order_support'
>

/**
 * Data for updating an existing order
 */
export type OrderUpdate = OrderCreate & { id: number }

/**
 * Paginated response from the API
 */
export type OrderListPaginated = PaginatedResponse<OrderList>

/**
 * Form errors for order form validation
 */
export type OrderFormErrors = {
  customer?: string[]
  customer_dependency?: string[]
  symptom?: string[]
  flaw?: string[]
  repair_description?: string[]
  folio?: string[]
  check_diagnosis?: string[]
  repair?: string[]
  install?: string[]
  maintenance?: string[]
  support?: string[]
  kit?: string[]
  kit_brand?: string[]
  kit_model?: string[]
  kit_serial?: string[]
  job_description?: string[]
  itemtime_set?: string[]
  provider?: string[]
  provider_signature_date?: string[]
  customer_signature_date?: string[]
  currency?: string[]
  non_field_errors?: string[]
}

/**
 * Support type labels
 */
export const SUPPORT_LABELS: Record<SupportType, string> = {
  i: 'In situ',
  t: 'Taller'
}

/**
 * Support type options for select
 */
export const SUPPORT_OPTIONS: Array<{ value: SupportType; label: string }> = [
  { value: 't', label: 'Taller' },
  { value: 'i', label: 'In Situ' }
]

/**
 * Order validation helpers
 */
export const OrderValidation = {
  customerOrDependency: (customer: number | null, dependency: number | null): boolean => {
    if (!customer && !dependency) return true // Valid: at least one should be selected (handled by other rule)
    if (customer && dependency) return false // Invalid: both selected
    return true // Valid: exactly one selected
  },
  atLeastOneCustomerOrDependency: (customer: number | null, dependency: number | null): boolean => {
    return !!customer || !!dependency
  },
  atLeastOneModality: (modalities: {
    check_diagnosis: boolean
    repair: boolean
    install: boolean
    maintenance: boolean
  }): boolean => {
    return (
      modalities.check_diagnosis ||
      modalities.repair ||
      modalities.install ||
      modalities.maintenance
    )
  },
  minimalItems: (items: any[]): boolean => {
    return items.length > 0
  }
}
