import { orderAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlOrderList = orderAPIEnvs.orderListUrl;
const urlOrderListPagination = orderAPIEnvs.orderListPaginationUrl;
const urlOrderDetail = orderAPIEnvs.orderDetailUrl;
const urlOrderPost = orderAPIEnvs.orderPostUrl;
const urlFromCustomerNotMatched = orderAPIEnvs.orderFromCustomerNotMatchedUrl;
const urlFromCustomer = orderAPIEnvs.orderFromCustomerUrl;
const urlNotMatched = orderAPIEnvs.orderNotMatchedUrl;

export const listOrder = (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get(urlOrderListPagination, { params });
};

export const searchOrders = (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return apiBase.get(urlOrderListPagination, { params });
};

export const detailOrder = (id) => {
    return apiBase.get(`${urlOrderDetail}/${id}/`);
};

export const detailOrderUpdate = (id) => {
    return apiBase.get(`${urlOrderPost}/${id}/`);
};

export const postOrder = (order) => {
    return apiBase.post(`${urlOrderPost}/`, order);
};

export const putOrder = (order) => {
    return apiBase.put(`${urlOrderPost}/${order.id}/`, order);
};

export const deleteOrder = (id) => {
    apiBase.delete(`${urlOrderPost}/${id}/`);
};

export const getOrdersFromCustomerNotMatched = (currencyId, providerId, customerId) => {
    // consumes the endpoints that retrieves all order given a Customer ID and matched attr = false
    return apiBase.get(`${urlFromCustomerNotMatched}/${currencyId}/${providerId}/${customerId}/`);
};

export const getOrdersFromCustomer = (id) => {
    // consumes the endpoints that retrieves all order given a Customer ID
    return apiBase.get(`${urlFromCustomer}/${id}/`);
};

export const getOrdersNotMatched = () => {
    return apiBase.get(`${urlNotMatched}`);
};