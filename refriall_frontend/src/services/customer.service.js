import apiBase from "./base.service";

const urlCustomer = '/hr/customers'
const urlCustomerListPagination = '/hr/customers/list/pagination'
const urlCustomerDetail = '/hr/customers/detail'
const urlCustomerOrderNoBill = '/hr/customers/orders/nobill'

export const listCustomer = async (currentPage=null) => {
    if (currentPage) {
        return await apiBase.get(`${urlCustomerListPagination}/?page=${currentPage}`);
    } else {
        return await apiBase.get(`${urlCustomer}/`);
    }
};

export const listCustomerOrdersNoBill = async (currency) => await apiBase.get(`${urlCustomerOrderNoBill}/${currency}/`)

export const detailCustomer = async (customer) => {
    return await apiBase.get(`${urlCustomerDetail}/${customer}/`);
};

export const postCustomer = async (customer) => {
    return await apiBase.post(`${urlCustomer}/`, customer);
};

export const putCustomer = async (customer) => {
    return await apiBase.put(`${urlCustomer}/${customer.id}/`, customer);
};

export const deleteCustomer = async (customer) => {
    await apiBase.delete(`${urlCustomer}/${customer}/`);
};