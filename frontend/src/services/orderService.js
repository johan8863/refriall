import { orderAPIEnvs } from '@/settings/env'
import apiBase from './baseService'

const urlOrder = orderAPIEnvs.orderUrl

export const orderService = {
  listOrder: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlOrder}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchOrders: (searchTerm, page = 1) =>
    apiBase.get(`${urlOrder}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  detailOrder: (id) => apiBase.get(`${urlOrder}/${id}/order-detail/`),
  detailOrderUpdate: (id) => apiBase.get(`${urlOrder}/${id}/`),
  postOrder: (order) => apiBase.post(`${urlOrder}/`, order),
  putOrder: (order) => apiBase.put(`${urlOrder}/${order.id}/`, order),
  deleteOrder: (id) => apiBase.delete(`${urlOrder}/${id}/`),
  getOrdersFromCustomerNotMatched: (currencyId, providerId, customerId) =>
    apiBase.get(
      `${urlOrder}/orders-from-currency-customer-free-bill/${currencyId}/${providerId}/${customerId}/`
    ),
  getOrdersByIds: (ordersIds) => apiBase.post(`${urlOrder}/get-orders-by-ids/`, { ordersIds })
}
