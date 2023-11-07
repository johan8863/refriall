import apiBase from "./base.service";

const urlOrder = '/finance/orders'

export const listOrder = async () => {
    try {
        return await apiBase.get(`${urlOrder}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailOrder = async (id) => {
    try {
        return await apiBase.get(`${urlOrder}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postOrder = async (order) => {
    try {
        return await apiBase.post(`${urlOrder}/`, order);
    } catch (error) {
        console.log(error);
    }
};

export const putOrder = async (id) => {
    try {
        return await apiBase.put(`${urlOrder}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const deleteOrder = async (id) => {
    try {
        await apiBase.delete(`${urlOrder}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};