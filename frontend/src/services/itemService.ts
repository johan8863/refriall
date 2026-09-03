import { itemAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type { Item, ItemCreate } from '@/views/items/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from 'axios'

const urlItem = itemAPIEnvs.itemUrl

export const itemService = {
  /**
   * Get paginated list of items with optional search
   * @param currentPage - Page number (optional)
   * @param searchTerm - Search term (optional)
   * @returns Promise with paginated response
   */
  listItem: (
    currentPage: number | null = null,
    searchTerm: string | null = null
  ): Promise<AxiosResponse<PaginatedResponse<Item>>> => {
    const params: Record<string, string | number> = {}
    if (currentPage) params.page = currentPage
    if (searchTerm) params.search = searchTerm
    return apiBase.get(`${urlItem}/list-pagination/`, { params })
  },

  /**
   * Search items by term with pagination
   * @param searchTerm - Search term
   * @param page - Page number (default: 1)
   * @returns Promise with paginated response
   */
  searchItems: (
    searchTerm: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<Item>>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlItem}/list-pagination/`, { params })
  },

  /**
   * Get items for select dropdown (no pagination)
   * @param searchTerm - Optional search term
   * @returns Promise with items list
   */
  listItemsForSelect: (searchTerm: string | null = null): Promise<AxiosResponse<Item[]>> => {
    const params: Record<string, string> = {}
    if (searchTerm) params.search = searchTerm
    return apiBase.get(urlItem, { params })
  },

  /**
   * Get a single item by ID
   * @param id - Item ID
   * @returns Promise with item data
   */
  detailItem: (id: number): Promise<AxiosResponse<Item>> => {
    return apiBase.get(`${urlItem}/${id}/`)
  },

  /**
   * Create a new item
   * @param item - Item data (without id)
   * @returns Promise with created item
   */
  postItem: (item: ItemCreate): Promise<AxiosResponse<Item>> => {
    return apiBase.post(`${urlItem}/`, item)
  },

  /**
   * Update an existing item
   * @param item - Item data (with id)
   * @returns Promise with updated item
   */
  putItem: (item: Item): Promise<AxiosResponse<Item>> => {
    return apiBase.put(`${urlItem}/${item.id}/`, item)
  },

  /**
   * Delete an item by ID
   * @param id - Item ID
   * @returns Promise void
   */
  deleteItem: (id: number): Promise<AxiosResponse<void>> => {
    return apiBase.delete(`${urlItem}/${id}/`)
  }
}

// Export types for convenience
export type { Item, ItemCreate }
