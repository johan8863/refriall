import { billsAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlBill = billsAPIEnvs.billUrl

export const billService = {
  listBillsPagination: (currentPage = null, searchTerm = null) =>
    apiBase.get(`${urlBill}/list-pagination/`, {
      params: {
        ...(currentPage && { page: currentPage }),
        ...(searchTerm && { search: searchTerm })
      }
    }),
  searchBills: (searchTerm, page = 1) =>
    apiBase.get(`${urlBill}/list-pagination/`, {
      params: {
        search: searchTerm,
        ...(page > 1 && { page })
      }
    }),
  detailBill: (id) => apiBase.get(`${urlBill}/${id}/`),
  getForUpdate: (id) => apiBase.get(`${urlBill}/${id}/get-for-update/`),
  getForDelete: (id) => apiBase.get(`${urlBill}/${id}/get-for-delete/`),
  postBill: (bill) => apiBase.post(`${urlBill}/`, bill),
  putBill: (bill) => apiBase.put(`${urlBill}/${bill.id}/`, bill),
  deleteBill: (id) => apiBase.delete(`${urlBill}/${id}/`)
}
