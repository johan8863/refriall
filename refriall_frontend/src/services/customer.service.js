import apiBase from "./base.service";

const urlCustomer = '/hr/customers'

export const listCustomer = async () => {
    try {
        return await apiBase.get(`${urlCustomer}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailCustomer = async (customer) => {
    try {
        return await apiBase.get(`${urlCustomer}/${customer}/`);
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

export const putCustomer = async (customer) => {
    try {
        return await apiBase.put(`${urlCustomer}/${customer.id}/`, customer);
    } catch (error) {
        console.log(error);
    }
};

export const deleteCustomer = async (customer) => {
    try {
        await apiBase.delete(`${urlCustomer}/${customer}/`);
    } catch (error) {
        console.log(error);
    }
};