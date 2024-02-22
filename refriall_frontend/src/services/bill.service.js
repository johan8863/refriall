import apiBase from "./base.service";

const urlBillListPagination = '/finance/bills/list/pagination';
const urlBillDetail = '/finance/bills/detail';
const urlBillDetailUpdate = '/finance/bills/detail/update';
// const urlBillUpdate = '/finance/bills/update';
const urlBillPost = '/finance/bills_write';

export const listBillsPagination = async (currentPage) => {
    try {
        return await apiBase.get(`${urlBillListPagination}/?page=${currentPage}`);
    } catch (error) {
        console.log(error);
    }
}

export const detailBill = async (id) => {
    try {
        return await apiBase.get(`${urlBillDetail}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export const detailBillUpdate = async (id) => {
    try {
        return await apiBase.get(`${urlBillDetailUpdate}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export const postBill = async (bill) => {
    try {
        return await apiBase.post(`${urlBillPost}/`, bill);
    } catch (error) {
        console.log(error);
    }
}

export const putBill = async (bill) => {
    try {
        return await apiBase.put(`${urlBillPost}/${bill.id}/`, bill);
    } catch (error) {
        console.log(error);
    }
}

export const deleteBill = async (id) => {
    try {
        await apiBase.delete(`${urlBillPost}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}