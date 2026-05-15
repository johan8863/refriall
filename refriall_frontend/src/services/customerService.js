import { customerAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlCustomer = customerAPIEnvs.customerUrl;
// const urlCustomerListPagination = customerAPIEnvs.customerListPaginationUrl;
const urlCustomerDetail = customerAPIEnvs.customerDetailUrl;
const urlCustomerOrderNoBill = customerAPIEnvs.customerOrderNoBillUrl;

export const customerService = {
    listCustomer: (currentPage = null, searchTerm = null) => {
        const params = {};
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(`${urlCustomer}/customers-list-pagination/`, { params });
    },
    listAllCustomers: () => apiBase.get(`${urlCustomer}/`),
    searchCustomers: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(`${urlCustomer}/customers-list-pagination/`, { params });
    },
    listCustomerOrdersNoBill: (currency, provider) => apiBase.get(`${urlCustomerOrderNoBill}/${currency}/${provider}/`),
    detailCustomer: (id) => apiBase.get(`${urlCustomer}/${id}/`),
    postCustomer: (customer) => apiBase.post(`${urlCustomer}/`, customer),
    putCustomer: (customer) => apiBase.put(`${urlCustomer}/${customer.id}/`, customer),
    deleteCustomer: (customer) => apiBase.delete(`${urlCustomer}/${customer}/`),
}
