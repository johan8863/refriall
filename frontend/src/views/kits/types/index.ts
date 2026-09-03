import type { PaginatedResponse, FormErrors } from '@/types/shared'

/*
 * Kit model
 */
export interface Kit {
  id?: number
  name: string
}

/*
 * Errors for Kit form
 */
export type KitFormErrors = FormErrors<Kit>

/*
 * Kit interface to pass to detail menu component
 */
export interface KitDetailMenuProps {
  kit: Kit
  isLoading: boolean
}
