import apiBase from "./base.service";

const urlOrderList = '/finance/orders/list'

export const listOrder = async () => {
    try {
        return await apiBase.get(`${urlOrderList}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailOrder = async (id) => {
    try {
        return await apiBase.get(`${urlOrderList}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postOrder = async (order) => {
    try {
        return await apiBase.post(`${urlOrderList}/`, order);
    } catch (error) {
        console.log(error);
    }
};

export const putOrder = async (order) => {
    try {
        return await apiBase.put(`${urlOrderList}/${order.id}/`, order);
    } catch (error) {
        console.log(error);
    }
};

export const deleteOrder = async (id) => {
    try {
        await apiBase.delete(`${urlOrderList}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};