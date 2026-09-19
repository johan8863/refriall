// services/billService.ts
import { billsAPIEnvs } from '@/settings/env'
import apiBase from './baseService'
import type {
  Bill,
  BillCreate,
  BillDetail,
  BillForDelete,
  BillListItem,
  BillUpdate
} from '@/views/bills/types'
import type { PaginatedResponse } from '@/types/shared'
import type { AxiosResponse } from 'axios'

const urlBill = billsAPIEnvs.billUrl

export const billService = {
  /**
   * Get paginated list of bills with optional search
   */
  listBillsPagination: (
    currentPage: number | null = null,
    searchTerm: string | null = null
  ): Promise<AxiosResponse<PaginatedResponse<BillListItem>>> => {
    const params: Record<string, string | number> = {}
    if (currentPage) params.page = currentPage
    if (searchTerm) params.search = searchTerm
    return apiBase.get(`${urlBill}/list-pagination/`, { params })
  },

  /**
   * Search bills by term with pagination
   */
  searchBills: (
    searchTerm: string,
    page: number = 1
  ): Promise<AxiosResponse<PaginatedResponse<BillListItem>>> => {
    const params: Record<string, string | number> = {
      search: searchTerm,
      ...(page > 1 && { page })
    }
    return apiBase.get(`${urlBill}/list-pagination/`, { params })
  },

  /**
   * Get bill detail with all nested relations
   */
  detailBill: (id: number): Promise<AxiosResponse<BillDetail>> => {
    return apiBase.get(`${urlBill}/${id}/`)
  },

  /**
   * Get bill data for update form
   */
  getForUpdate: (id: number): Promise<AxiosResponse<Bill>> => {
    return apiBase.get(`${urlBill}/${id}/get-for-update/`)
  },

  /**
   * Get bill data for delete view
   */
  getForDelete: (id: number): Promise<AxiosResponse<BillForDelete>> => {
    return apiBase.get(`${urlBill}/${id}/get-for-delete/`)
  },

  /**
   * Create a new bill
   */
  postBill: (bill: BillCreate): Promise<AxiosResponse<Bill>> => {
    return apiBase.post(`${urlBill}/`, bill)
  },

  /**
   * Update an existing bill
   */
  putBill: (bill: BillUpdate): Promise<AxiosResponse<Bill>> => {
    return apiBase.put(`${urlBill}/${bill.id}/`, bill)
  },

  /**
   * Delete a bill by ID
   */
  deleteBill: (id: number): Promise<AxiosResponse<void>> => {
    return apiBase.delete(`${urlBill}/${id}/`)
  }
}

// Export types for convenience
export type { Bill, BillCreate, BillDetail, BillForDelete, BillListItem }
