import apiBase from "./base.service";

const urlOrderList = '/finance/orders/list'
const urlOrderListPagination = '/finance/orders/list/pagination'
const urlOrderDetail = '/finance/orders/detail'
const urlOrderPost = '/finance/orders_write'
const urlFromCustomerNotMatched = '/finance/orders/fromcustomernotmatched'
const urlFromCustomer = '/finance/orders/fromcustomer'
const urlNotMatched = '/finance/orders/notmatched'

export const listOrder = async (currentPage=null) => {
    try {
        if (currentPage) {
            return await apiBase.get(`${urlOrderListPagination}/?page=${currentPage}`);
        } else {
            return await apiBase.get(`${urlOrderList}/`);
        }
    } catch (error) {
        console.log(error);
    }
};

export const detailOrder = async (id) => {
    try {
        return await apiBase.get(`${urlOrderDetail}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailOrderUpdate = async (id) => {
    try {
        return await apiBase.get(`${urlOrderPost}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postOrder = async (order) => {
    try {
        return await apiBase.post(`${urlOrderPost}/`, order);
    } catch (error) {
        console.log(error);
    }
};

export const putOrder = async (order) => {
    try {
        return await apiBase.put(`${urlOrderPost}/${order.id}/`, order);
    } catch (error) {
        console.log(error);
    }
};

export const deleteOrder = async (id) => {
    try {
        await apiBase.delete(`${urlOrderPost}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const getOrdersFromCustomerNotMatched = async (id) => {
    // consumes the endpoints that retrieves all order given a Customer ID and matched attr = false
    try {
        return await apiBase.get(`${urlFromCustomerNotMatched}/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersFromCustomer = async (id) => {
    // consumes the endpoints that retrieves all order given a Customer ID
    try {
        return await apiBase.get(`${urlFromCustomer}/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersNotMatched = async () => {
    try {
        return await apiBase.get(`${urlNotMatched}`);
    } catch (error) {
        console.log(error);
    }
}