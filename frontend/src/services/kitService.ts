import { kitAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type { Kit } from '@/views/kits/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from 'axios'

const urlKit = kitAPIEnvs.kitUrl

export const kitService = {
  /*
   * Paginated list kit service
   * @params page - page number
   * @returns Promise with a paginated response
   */
  listKit: (page: number = 1): Promise<AxiosResponse<PaginatedResponse<Kit>>> => {
    return apiBase.get(`${urlKit}/list-pagination/`, { params: { page } })
  },
  /*
   * Searches kits based on the search param
   * @param search - search term
   * @param page - page number(optional, default = 1)
   */
  searchKits: (
    search: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Kit>>> => {
    return apiBase.get(`${urlKit}/list-pagination/`, { params: { search, page } })
  },
  /*
   * Gets all kits(no pagination)
   * @returns Promise with the whole kits list
   */
  getAllKits: (): Promise<AxiosResponse<Kit[]>> => apiBase.get(`${urlKit}/`),
  /*
   * Gets a Kit by id
   * @params id - Kit id
   * @returns Promise with Kit data
   */
  detailKit: (id: number): Promise<AxiosResponse<Kit>> => apiBase.get(`${urlKit}/${id}/`),
  /*
   * Creates a Kit from kit param
   * @param kit - Kit data
   * @returns Promise with Kit created data
   */
  postKit: (kit: Omit<Kit, 'id'>): Promise<AxiosResponse<Kit>> => apiBase.post(`${urlKit}/`, kit),
  /*
   * Updates a Kit from kit param
   * @param kit - Kit data
   * @returns Promise with Kit updated data
   */
  putKit: (kit: Kit): Promise<AxiosResponse<Kit>> => apiBase.put(`${urlKit}/${kit.id}/`, kit),
  /*
   * Deletes a Kit by its id
   * @params id - Kit id
   * @returns Promise void
   */
  deleteKit: (id: number): Promise<void> => apiBase.delete(`${urlKit}/${id}/`)
}
