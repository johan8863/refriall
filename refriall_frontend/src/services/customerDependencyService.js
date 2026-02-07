import apiBase from "./base.service";

const urlCustomerDependency = '/hr/dependencies';

export const customerDependecyService = {
    searchCustomerDependencies: (customerId, searchTerm) => {
        const params = { search: searchTerm };
        return apiBase.get(`${urlCustomerDependency}/?customer=${customerId}`, { params });
    },
    listCustomerDependecy: () => apiBase.get(`${urlCustomerDependency}/`),
    detailCustomerDependecy: (id) => apiBase.get(`${urlCustomerDependency}/${id}/`),
    putCustomerDependcy: (customerDependecy) => apiBase.put(`${urlCustomerDependency}/${customerDependecy.id}/`, customerDependecy),
    postCustomerDependency: (customerDependecy) => apiBase.post(`${urlCustomerDependency}/`, customerDependecy),
    deleteCustomerDependency: (id) => apiBase.delete(`${urlCustomerDependency}/${id}/`)
}
