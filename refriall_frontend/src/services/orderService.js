import { orderAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlOrderDetail = orderAPIEnvs.orderDetailUrl;
const urlOrder = orderAPIEnvs.orderUrl;
const urlFromCustomerNotMatched = orderAPIEnvs.orderFromCustomerNotMatchedUrl;
const urlFromCustomer = orderAPIEnvs.orderFromCustomerUrl;
const urlNotMatched = orderAPIEnvs.orderNotMatchedUrl;

export const orderService = {
    listOrder: (currentPage = null, searchTerm = null) => {
        const params = {};
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(`${urlOrder}/orders-list-pagination/`, { params });
    },
    searchOrders: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(`${urlOrder}/orders-list-pagination/`, { params });
    },
    detailOrder: (id) => apiBase.get(`${urlOrderDetail}/${id}/`),
    detailOrderUpdate: (id) => apiBase.get(`${urlOrder}/${id}/`),
    postOrder: (order) => apiBase.post(`${urlOrder}/`, order),
    putOrder: (order) => apiBase.put(`${urlOrder}/${order.id}/`, order),
    deleteOrder: (id) => apiBase.delete(`${urlOrder}/${id}/`),
    getOrdersFromCustomerNotMatched: (
        currencyId, 
        providerId, 
        customerId
    ) => apiBase.get(
        `${urlFromCustomerNotMatched}/${currencyId}/${providerId}/${customerId}/`
    ),
    getOrdersFromCustomer: (id) => apiBase.get(`${urlFromCustomer}/${id}/`),
    getOrdersNotMatched: () => apiBase.get(`${urlNotMatched}`),
}








