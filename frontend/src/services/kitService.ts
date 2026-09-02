import { kitAPIEnvs } from '../settings/env'
import apiBase from './baseService'
import type { Kit } from '../views/kits/types'
import type { PaginatedResponse } from '../types/shared'

const urlKit = kitAPIEnvs.kitUrl

export const kitService = {
  /*
   * Paginated list kit service with optional search term
   * @params currentPage - page number
   * @params searchTerm - search term
   * @returns Promise with a paginated response
   */
  listKit: (page: number = 1, search: string = ''): Promise<PaginatedResponse<Kit>> => {
    const params: Record<string, string | number> = {
      ...(page && { page }),
      ...(search && { search })
    }
    return apiBase.get(`${urlKit}/list-pagination/`, { params })
  },
  /*
   * Searches kits based on the searchTerm param
   * @param searchTerm - search term
   * @param page - page number(optional, default = 1)
   */
  searchKits: (searchTerm: string, page: number = 1): Promise<PaginatedResponse<Kit>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlKit}/list-pagination/`, { params })
  },
  /*
   * Gets all kits(no pagination)
   * @returns Promise with the whole kits list
   */
  getAllKits: (): Promise<Kit[]> => apiBase.get(`${urlKit}/`),
  /*
   * Gets a Kit by id
   * @params id - Kit id
   * @returns Promise with Kit data
   */
  detailKit: (id: number): Promise<Kit> => apiBase.get(`${urlKit}/${id}/`),
  /*
   * Creates a Kit from kit param
   * @param kit - Kit data
   * @returns Promise with Kit created data
   */
  postKit: (kit: Omit<Kit, 'id'>): Promise<Kit> => apiBase.post(`${urlKit}/`, kit),
  /*
   * Updates a Kit from kit param
   * @param kit - Kit data
   * @returns Promise with Kit updated data
   */
  putKit: (kit: Kit): Promise<Kit> => apiBase.put(`${urlKit}/${kit.id}/`, kit),
  /*
   * Deletes a Kit by its id
   * @params id - Kit id
   * @returns Promise void
   */
  deleteKit: (id: number): Promise<void> => apiBase.delete(`${urlKit}/${id}/`)
}
