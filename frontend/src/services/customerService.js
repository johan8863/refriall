import { customerAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlCustomer = customerAPIEnvs.customerUrl

export const customerService = {
  listCustomer: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlCustomer}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchCustomers: (searchTerm, page = 1) =>
    apiBase.get(`${urlCustomer}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  listCustomerOrdersNoBill: (currency, provider) =>
    apiBase.get(`${urlCustomer}/customer-order-currency-provider-no-bill/${currency}/${provider}/`),
  detailCustomer: (id) => apiBase.get(`${urlCustomer}/${id}/`),
  postCustomer: (customer) => apiBase.post(`${urlCustomer}/`, customer),
  putCustomer: (customer) => apiBase.put(`${urlCustomer}/${customer.id}/`, customer),
  deleteCustomer: (customer) => apiBase.delete(`${urlCustomer}/${customer}/`)
}
