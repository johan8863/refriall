import apiBase from "./base.service";

const urlCustomer = '/hr/customers'

export const listCustomer = async () => {
    try {
        return await apiBase.get(`${urlCustomer}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailCustomer = async (id) => {
    try {
        return await apiBase.get(`${urlCustomer}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postCustomer = async (customer) => {
    try {
        return await apiBase.post(`${urlCustomer}/`, customer);
    } catch (error) {
        console.log(error);
    }
};

export const putCustomer = async (id) => {
    try {
        return await apiBase.put(`${urlCustomer}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const deleteCustomer = async (id) => {
    try {
        await apiBase.delete(`${urlCustomer}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};