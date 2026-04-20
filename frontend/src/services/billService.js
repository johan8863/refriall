import { billsAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlBillListPagination = billsAPIEnvs.billListPaginationUrl;
const urlBillDetail = billsAPIEnvs.billDetailUrl;
const urlBillDetailUpdate = billsAPIEnvs.billDetailUpdateUrl;
const urlBillPost = billsAPIEnvs.billPostUrl;

export const billService = {
    listBillsPagination: (currentPage = null, searchTerm = null) => {
        const params = {};
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(urlBillListPagination, { params });
    },
    searchBills: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(urlBillListPagination, { params });
    },
    detailBill: (id) => apiBase.get(`${urlBillDetail}/${id}/`),
    detailBillUpdate: (id) => apiBase.get(`${urlBillDetailUpdate}/${id}/`),
    postBill: (bill) => apiBase.post(`${urlBillPost}/`, bill),    
    putBill: (bill) => apiBase.put(`${urlBillPost}/${bill.id}/`, bill),
    deleteBill: (id) => apiBase.delete(`${urlBillPost}/${id}/`)
}
