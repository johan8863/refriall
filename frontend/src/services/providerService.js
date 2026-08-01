import { providerAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlProvider = providerAPIEnvs.providerUrl

export const providerService = {
  listProvider: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlProvider}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchProviders: (searchTerm, page = 1) =>
    apiBase.get(`${urlProvider}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  listAllProviders: () => apiBase.get(`${urlProvider}/`),
  listProviderCurrencyOrderNoBill: (currency) =>
    apiBase.get(`${urlProvider}/get-provider-order-currency-no-bill/${currency}/`),
  detailProvider: (id) => apiBase.get(`${urlProvider}/${id}/`),
  postProvider: (provider) => apiBase.post(`${urlProvider}/`, provider),
  putProvider: (provider) => apiBase.put(`${urlProvider}/${provider.id}/`, provider),
  deleteProvider: (id) => apiBase.delete(`${urlProvider}/${id}/`),
  changeSelfPassword: (credentials) => apiBase.post(`${urlProvider}/change-password/`, credentials),
  changePassword: (id, credentials) =>
    apiBase.post(`${urlProvider}/${id}/admin-reset-password/`, credentials)
}
