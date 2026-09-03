// views/items/types/index.ts
import type { PaginatedResponse } from '../../../types/shared'

/**
 * Item type options from Django model
 */
export type ItemType =
  | 'revision'
  | 'prod'
  | 'concept'
  | 'repair'
  | 'maintenace'
  | 'install'
  | 'unmounting'

/**
 * Measurement unit options from Django model
 */
export type Measurement = 'u' | 'm' | 'kg' | 'lts' | 'gl' | 'tr' | 'pqt'

/**
 * Item model - matches Django Item model
 */
export interface Item {
  id: number
  code: string
  name: string
  item_type: ItemType
  measurement: Measurement | null
  price: number
  // Read-only fields from serializer
  get_item_type: string
  get_measurement: string | null
}

/**
 * Data for creating a new item (without id)
 */
export type ItemCreate = Omit<Item, 'id' | 'get_item_type' | 'get_measurement'>

/**
 * Data for updating an existing item
 */
export type ItemUpdate = Item

/**
 * Paginated response from the API
 */
export type ItemListResponse = PaginatedResponse<Item>

/**
 * Form errors for item form validation
 */
export type ItemFormErrors = {
  code?: string[]
  name?: string[]
  item_type?: string[]
  measurement?: string[]
  price?: string[]
}

/**
 * Item type mapping for display
 */
export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  revision: 'Rev/Diag.',
  prod: 'Producto',
  concept: 'Concepto',
  repair: 'Reparación',
  maintenace: 'Mtto',
  install: 'Instal/Mont',
  unmounting: 'Desmontaje'
}

/**
 * Measurement unit mapping for display
 */
export const MEASUREMENT_LABELS: Record<Measurement, string> = {
  u: 'Uno',
  m: 'Mts',
  kg: 'Kg',
  lts: 'Lts',
  gl: 'Gl',
  tr: 'Tr',
  pqt: 'Pqt'
}

/**
 * Options for item type select
 */
export const ITEM_TYPE_OPTIONS: Array<{ value: ItemType; label: string }> = [
  { value: 'revision', label: 'Rev/Diag.' },
  { value: 'prod', label: 'Producto' },
  { value: 'concept', label: 'Concepto' },
  { value: 'repair', label: 'Reparación' },
  { value: 'maintenace', label: 'Mtto' },
  { value: 'install', label: 'Instal/Mont' },
  { value: 'unmounting', label: 'Desmontaje' }
]

/**
 * Options for measurement select
 */
export const MEASUREMENT_OPTIONS: Array<{ value: Measurement; label: string }> = [
  { value: 'u', label: 'Uno' },
  { value: 'm', label: 'Mts' },
  { value: 'kg', label: 'Kg' },
  { value: 'lts', label: 'Lts' },
  { value: 'gl', label: 'Gl' },
  { value: 'tr', label: 'Tr' },
  { value: 'pqt', label: 'Pqt' }
]
