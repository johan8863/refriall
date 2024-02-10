import apiBase from "./base.service";

const urlOrderList = '/finance/orders/list'
const urlOrderDetail = '/finance/orders/detail'
const urlOrderPost = '/finance/orders_write'
const urlFromClient = '/finance/orders/fromclient'

export const listOrder = async () => {
    return await apiBase.get(`${urlOrderList}/`);
};

export const detailOrder = async (id) => {
    return await apiBase.get(`${urlOrderDetail}/${id}/`);
};

export const detailOrderUpdate = async (id) => {
    return await apiBase.get(`${urlOrderPost}/${id}/`);
};

export const postOrder = async (order) => {
    return await apiBase.post(`${urlOrderPost}/`, order);
};

export const putOrder = async (order) => {
    return await apiBase.put(`${urlOrderPost}/${order.id}/`, order);
};

export const deleteOrder = async (id) => {
    await apiBase.delete(`${urlOrderPost}/${id}/`);
};

export const getOrdersFromClient = async (id) => {
    return await apiBase.get(`${urlFromClient}/${id}`);
}