import { customerAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlCustomer = customerAPIEnvs.customerUrl;
const urlCustomerListPagination = customerAPIEnvs.customerListPaginationUrl;
const urlCustomerDetail = customerAPIEnvs.customerDetailUrl;
const urlCustomerOrderNoBill = customerAPIEnvs.customerOrderNoBillUrl;

export const listCustomer = (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get(urlCustomerListPagination, { params });
};

export const listAllCustomers = () => {
    return apiBase.get(`${urlCustomer}/`);
};

export const searchCustomers = (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return apiBase.get(urlCustomerListPagination, { params });
};

export const listCustomerOrdersNoBill = (currency, provider) => apiBase.get(`${urlCustomerOrderNoBill}/${currency}/${provider}/`)

export const detailCustomer = (customer) => {
    return apiBase.get(`${urlCustomerDetail}/${customer}/`);
};

export const postCustomer = (customer) => {
    return apiBase.post(`${urlCustomer}/`, customer);
};

export const putCustomer = (customer) => {
    return apiBase.put(`${urlCustomer}/${customer.id}/`, customer);
};

export const deleteCustomer = (customer) => {
    apiBase.delete(`${urlCustomer}/${customer}/`);
};