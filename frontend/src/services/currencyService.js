import { currenciesAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const url = currenciesAPIEnvs.currenciesUrl

export const currencyService = {
  listCurrencies: () => apiBase.get(`${url}/`),
  listCurrencyPagination: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${url}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchCurrency: (searchTerm, page = 1) =>
    apiBase.get(`${url}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  detailCurrency: (id) => apiBase.get(`${url}/${id}/`),
  postCurrency: (currency) => apiBase.post(`${url}/`, currency),
  putCurrency: (currency) => apiBase.put(`${url}/${currency.id}/`, currency),
  deleteCurrency: (id) => apiBase.delete(`${url}/${id}/`)
}
