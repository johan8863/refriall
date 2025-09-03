import apiBase from "./base.service";

const urlCustomer = '/hr/customers'
const urlCustomerListPagination = '/hr/customers/list/pagination'
const urlCustomerDetail = '/hr/customers/detail'
const urlCustomerOrderNoBill = '/hr/customers/orders/nobill'

export const listCustomer = async (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return await apiBase.get(urlCustomerListPagination, { params });
};

export const searchCustomers = async (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return await apiBase.get(urlCustomerListPagination, { params });
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