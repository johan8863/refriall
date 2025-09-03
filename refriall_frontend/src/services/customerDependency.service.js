import apiBase from "./base.service";

const urlCustomerDependency = '/hr/dependencies';

export const searchCustomerDependencies = async (customerId, searchTerm) => {
    const params = { search: searchTerm };
    return await apiBase.get(`${urlCustomerDependency}/?customer=${customerId}`, { params });
};

export const listCustomerDependecy = async () => {
    return await apiBase.get(`${urlCustomerDependency}/`);
};

export const detailCustomerDependecy = async (id) => {
    return await apiBase.get(`${urlCustomerDependency}/${id}/`);
};

export const putCustomerDependcy = async (customerDependecy) => {
    return await apiBase.put(`${urlCustomerDependency}/${customerDependecy.id}/`, customerDependecy);
}

export const postCustomerDependency = async (customerDependecy) => {
    return await apiBase.post(`${urlCustomerDependency}/`, customerDependecy);
}

export const deleteCustomerDependency = async (id) => {
    await apiBase.delete(`${urlCustomerDependency}/${id}/`);
}