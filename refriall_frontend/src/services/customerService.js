import { customerAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlCustomer = customerAPIEnvs.customerUrl;
const urlCustomerListPagination = customerAPIEnvs.customerListPaginationUrl;
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
        
        return apiBase.get(urlCustomerListPagination, { params });
    },
    listAllCustomers: () => apiBase.get(`${urlCustomer}/`),
    searchCustomers: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(urlCustomerListPagination, { params });
    },
    listCustomerOrdersNoBill: (currency, provider) => apiBase.get(`${urlCustomerOrderNoBill}/${currency}/${provider}/`),
    detailCustomer: (customer) => apiBase.get(`${urlCustomerDetail}/${customer}/`),
    postCustomer: (customer) => apiBase.post(`${urlCustomer}/`, customer),
    putCustomer: (customer) => apiBase.put(`${urlCustomer}/${customer.id}/`, customer),
    deleteCustomer: (customer) => apiBase.delete(`${urlCustomer}/${customer}/`),
}
