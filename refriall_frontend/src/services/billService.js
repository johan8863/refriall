import { billsAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlBillListPagination = billsAPIEnvs.billListPaginationUrl;
const urlBillDetail = billsAPIEnvs.billDetailUrl;
const urlBillDetailUpdate = billsAPIEnvs.billDetailUpdateUrl;
const urlBillPost = billsAPIEnvs.billPostUrl;

export const listBillsPagination = (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get(urlBillListPagination, { params });
};

export const searchBills = (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return apiBase.get(urlBillListPagination, { params });
};

export const detailBill = (id) => {
    return apiBase.get(`${urlBillDetail}/${id}/`);
};

export const detailBillUpdate = (id) => {
    return apiBase.get(`${urlBillDetailUpdate}/${id}/`);
};

export const postBill = (bill) => {
    return apiBase.post(`${urlBillPost}/`, bill);
};

export const putBill = (bill) => {
    return apiBase.put(`${urlBillPost}/${bill.id}/`, bill);
};

export const deleteBill = (id) => {
    apiBase.delete(`${urlBillPost}/${id}/`);
};