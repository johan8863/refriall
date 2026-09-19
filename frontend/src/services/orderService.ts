import { orderAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type { Order, OrderCreate, OrderDetail, OrderList } from '@/views/orders/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from './baseService'

const urlOrder = orderAPIEnvs.orderUrl

export const orderService = {
  /**
   * Get paginated list of orders with optional search
   */
  listOrder: (
    currentPage: number | null = null,
    searchTerm: string | null = null
  ): Promise<AxiosResponse<PaginatedResponse<OrderList>>> => {
    const params: Record<string, string | number> = {
      ...(currentPage && { page: currentPage }),
      ...(searchTerm && { search: searchTerm })
    }
    return apiBase.get(`${urlOrder}/list-pagination/`, { params })
  },
  /**
   * Search orders by term with pagination
   */
  searchOrders: (
    searchTerm: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<OrderList>>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlOrder}/list-pagination/`, { params })
  },
  /**
   * Get order detail with all nested relations
   */
  detailOrder: (id: number): Promise<AxiosResponse<OrderDetail>> =>
    apiBase.get(`${urlOrder}/${id}/order-detail/`),
  /**
   * Get order data for update form (simplified)
   */
  detailOrderUpdate: (id: number): Promise<AxiosResponse<Order>> =>
    apiBase.get(`${urlOrder}/${id}/`),
  /**
   * Create a new order
   */
  postOrder: (order: Order): Promise<AxiosResponse<Order>> => apiBase.post(`${urlOrder}/`, order),
  /**
   * Update an existing order
   */
  putOrder: (order: Order): Promise<AxiosResponse<Order>> =>
    apiBase.put(`${urlOrder}/${order.id}/`, order),
  /**
   * Delete an order by ID
   */
  deleteOrder: (id: number): Promise<AxiosResponse<void>> => apiBase.delete(`${urlOrder}/${id}/`),
  /**
   * Get free orders from a customer for a bill
   */
  getOrdersFromCustomerNotMatched: (
    currencyId: number,
    providerId: number,
    customerId: number
  ): Promise<AxiosResponse<OrderList[]>> =>
    apiBase.get(
      `${urlOrder}/orders-from-currency-customer-free-bill/${currencyId}/${providerId}/${customerId}/`
    ),
  getOrdersByIds: (ordersIds: number[]): Promise<AxiosResponse<OrderList[]>> =>
    apiBase.post(`${urlOrder}/get-orders-by-ids/`, { ordersIds })
}
