import { kitAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlKit = kitAPIEnvs.kitUrl

export const kitService = {
  listKit: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlKit}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchKits: (searchTerm, page = 1) =>
    apiBase.get(`${urlKit}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  detailKit: (id) => apiBase.get(`${urlKit}/${id}/`),
  postKit: (kit) => apiBase.post(`${urlKit}/`, kit),
  putKit: (kit) => apiBase.put(`${urlKit}/${kit.id}/`, kit),
  deleteKit: (id) => apiBase.delete(`${urlKit}/${id}/`)
}
