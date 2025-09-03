import apiBase from "./base.service";

const urlBillListPagination = '/finance/bills/list/pagination';
const urlBillDetail = '/finance/bills/detail';
const urlBillDetailUpdate = '/finance/bills/detail/update';
const urlBillPost = '/finance/bills_write';

export const listBillsPagination = async (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return await apiBase.get(urlBillListPagination, { params });
};

export const searchBills = async (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return await apiBase.get(urlBillListPagination, { params });
};

export const detailBill = async (id) => {
    return await apiBase.get(`${urlBillDetail}/${id}/`);
};

export const detailBillUpdate = async (id) => {
    return await apiBase.get(`${urlBillDetailUpdate}/${id}/`);
};

export const postBill = async (bill) => {
    return await apiBase.post(`${urlBillPost}/`, bill);
};

export const putBill = async (bill) => {
    return await apiBase.put(`${urlBillPost}/${bill.id}/`, bill);
};

export const deleteBill = async (id) => {
    await apiBase.delete(`${urlBillPost}/${id}/`);
};