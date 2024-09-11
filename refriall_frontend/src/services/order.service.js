import apiBase from "./base.service";

const urlOrderList = '/finance/orders/list'
const urlOrderListPagination = '/finance/orders/list/pagination'
const urlOrderDetail = '/finance/orders/detail'
const urlOrderPost = '/finance/orders_write'
const urlFromCustomerNotMatched = '/finance/orders/fromcustomernotmatched'
const urlFromCustomer = '/finance/orders/fromcustomer'
const urlNotMatched = '/finance/orders/notmatched'

export const listOrder = async (currentPage=null) => {
    if (currentPage) {
        return await apiBase.get(`${urlOrderListPagination}/?page=${currentPage}`);
    } else {
        return await apiBase.get(`${urlOrderList}/`);
    }
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

export const getOrdersFromCustomerNotMatched = async (id, currency) => {
    // consumes the endpoints that retrieves all order given a Customer ID and matched attr = false
    return await apiBase.get(`${urlFromCustomerNotMatched}/${id}/${currency}/`);
};

export const getOrdersFromCustomer = async (id) => {
    // consumes the endpoints that retrieves all order given a Customer ID
    return await apiBase.get(`${urlFromCustomer}/${id}/`);
};

export const getOrdersNotMatched = async () => {
    return await apiBase.get(`${urlNotMatched}`);
};