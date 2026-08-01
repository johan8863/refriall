import { itemAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlItem = itemAPIEnvs.itemUrl

export const itemService = {
  listItem: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlItem}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchItems: (searchTerm, page = 1) =>
    apiBase.get(`${urlItem}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  listItemsForSelect: (searchTerm = null) => {
    const params = {}

    if (searchTerm) {
      params.search = searchTerm
    }

    return apiBase.get(urlItem, { params })
  },
  getItem: (id) => apiBase.get(`${urlItem}/${id}/`),
  detailItem: (id) => apiBase.get(`${urlItem}/${id}/`),
  postItem: (item) => apiBase.post(`${urlItem}/`, item),
  putItem: (item) => apiBase.put(`${urlItem}/${item.id}/`, item),
  deleteItem: (id) => apiBase.delete(`${urlItem}/${id}/`)
}
