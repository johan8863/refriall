import apiBase from "./base.service";

const urlCustomerDependency = '/hr/dependencies';

export const listCustomerDependecy = async () => {
    try {
        return await apiBase.get(`${urlCustomerDependency}/`);
    } catch (error) {
        console.log(error);
    }
}

export const detailCustomerDependecy = async (id) => {
    try {
        return await apiBase.get(`${urlCustomerDependency}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export const putCustomerDependcy = async (id) => {
    try {
        return await apiBase.put(`${urlCustomerDependency}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export const postCustomerDependency = async (customerDependecy) => {
    try {
        return await apiBase.post(`${urlCustomerDependency}/`, customerDependecy);
    } catch (error) {
        console.log(error);
    }
}

export const deleteCustomerDependency = async (id) => {
    try {
        await apiBase.delete(`${urlCustomerDependency}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}