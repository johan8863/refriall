import type { PaginatedResponse } from '../../../types/shared'

/**
 * Currency interface - matches Django Currency model
 * @example
 * ```typescript
 * const currency: Currency = {
 *   id: 1,
 *   name: "USD",
 *   description: "USD Dollar"
 * }
 * ```
 */
export interface Currency {
  /** Primary key */
  id?: number
  /** Currency code (e.g., USD, CAD, EUR) - max 4 characters */
  name: string
  /** Currency description - max 22 characters */
  description: string
}
