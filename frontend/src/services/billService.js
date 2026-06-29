import { billsAPIEnvs } from '../settings/env'
import apiBase from './baseService'

const urlBill = billsAPIEnvs.billUrl

export const billService = {
  listBillsPagination: (currentPage = null, searchTerm = null) => {
    const params = {}

    if (currentPage) {
      params.page = currentPage
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    return apiBase.get(`${urlBill}/bill-list-pagination/`, { params })
  },
  searchBills: (searchTerm, page = 1) => {
    const params = { search: searchTerm }
    if (page > 1) {
      params.page = page
    }
    return apiBase.get(`${urlBill}/bill-list-pagination/`, { params })
  },
  detailBill: (id) => apiBase.get(`${urlBill}/${id}/`),
  getForUpdate: (id) => apiBase.get(`${urlBill}/${id}/get-for-update/`),
  postBill: (bill) => apiBase.post(`${urlBill}/`, bill),
  putBill: (bill) => apiBase.put(`${urlBill}/${bill.id}/`, bill),
  deleteBill: (id) => apiBase.delete(`${urlBill}/${id}/`)
}
