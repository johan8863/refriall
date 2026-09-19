/**
 * Environment configuration for API endpoints
 * All values are read from import.meta.env (Vite environment variables)
 *
 * @see {@link https://vitejs.dev/guide/env-and-mode.html}
 */

/**
 * All Vite environment variables
 */
export const allEnvs = import.meta.env

/**
 * Bills API environment configuration
 */
export const billsAPIEnvs = {
  billUrl: allEnvs.VITE_BILL_URL
} as const

/**
 * Currencies API environment configuration
 */
export const currenciesAPIEnvs = {
  currenciesUrl: allEnvs.VITE_CURRENCIES_URL
} as const

/**
 * Customer API environment configuration
 */
export const customerAPIEnvs = {
  customerUrl: allEnvs.VITE_CUSTOMER_URL
} as const

/**
 * Customer dependency API environment configuration
 */
export const customerDependencyAPIEnvs = {
  customerDependencyUrl: allEnvs.VITE_CUSTOMER_DEPENDENCY_URL
} as const

/**
 * Item API environment configuration
 */
export const itemAPIEnvs = {
  itemUrl: allEnvs.VITE_ITEM_URL
} as const

/**
 * Kit API environment configuration
 */
export const kitAPIEnvs = {
  kitUrl: allEnvs.VITE_KIT_URL
} as const

/**
 * Order API environment configuration
 */
export const orderAPIEnvs = {
  orderUrl: allEnvs.VITE_ORDER_URL
} as const

/**
 * Provider API environment configuration
 */
export const providerAPIEnvs = {
  providerUrl: allEnvs.VITE_PROVIDER_URL
} as const

/**
 * Auth API environment configuration
 */
export const authAPIEnvs = {
  tokenPairUrl: allEnvs.VITE_TOKEN_PAIR_URL,
  refreshTokenUrl: allEnvs.VITE_REFRESH_TOKEN_URL
} as const
