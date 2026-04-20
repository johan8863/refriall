import { orderAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlOrderListPagination = orderAPIEnvs.orderListPaginationUrl;
const urlOrderDetail = orderAPIEnvs.orderDetailUrl;
const urlOrderPost = orderAPIEnvs.orderPostUrl;
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
        
        return apiBase.get(urlOrderListPagination, { params });
    },
    searchOrders: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(urlOrderListPagination, { params });
    },
    detailOrder: (id) => apiBase.get(`${urlOrderDetail}/${id}/`),
    detailOrderUpdate: (id) => apiBase.get(`${urlOrderPost}/${id}/`),
    postOrder: (order) => apiBase.post(`${urlOrderPost}/`, order),
    putOrder: (order) => apiBase.put(`${urlOrderPost}/${order.id}/`, order),
    deleteOrder: (id) => apiBase.delete(`${urlOrderPost}/${id}/`),
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








