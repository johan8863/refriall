import apiBase from './baseService'

const urlCustomerDependency = '/hr/dependencies'

export const customerDependecyService = {
  searchCustomerDependencies: (customerId, searchTerm) => {
    const params = { search: searchTerm }
    return apiBase.get(`${urlCustomerDependency}/?customer=${customerId}`, { params })
  },
  listCustomerDependecy: () => apiBase.get(`${urlCustomerDependency}/`),
  listCustomerDependecyPagination: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlCustomerDependency}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchCustomerDependecy: (searchTerm, page = 1) =>
    apiBase.get(`${urlCustomerDependency}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  detailCustomerDependecy: (id) => apiBase.get(`${urlCustomerDependency}/${id}/`),
  putCustomerDependcy: (customerDependecy) =>
    apiBase.put(`${urlCustomerDependency}/${customerDependecy.id}/`, customerDependecy),
  postCustomerDependency: (customerDependecy) =>
    apiBase.post(`${urlCustomerDependency}/`, customerDependecy),
  deleteCustomerDependency: (id) => apiBase.delete(`${urlCustomerDependency}/${id}/`)
}
