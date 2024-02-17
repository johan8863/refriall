import apiBase from "./base.service";

const urlBillList = '/finance/bills/list';
const urlBillDetail = '/finance/bills/detail';
const urlBillUpdate = '/finance/bills/update';
const urlBillPost = '/finance/bills_write';

export const listBills = async () => {
    return await apiBase.get(`${urlBillList}/`);
}

export const detailBill = async (id) => {
    return await apiBase.get(`${urlBillDetail}/${id}/`);
}

export const detailBillUpdate = async (id) => {
    return await apiBase.get(`${urlBillDetail}/${id}/`);
}

export const postBill = async (bill) => {
    return await apiBase.post(`${urlBillPost}/`, bill);
}

export const putBill = async (bill) => {
    return await apiBase.put(`${urlBillUpdate}/${bill.id}`, bill);
}

export const deleteBill = async (id) => {
    await apiBase.delete(`${urlBillPost}/${id}/`);
}