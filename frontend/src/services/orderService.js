import { orderAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlOrder = orderAPIEnvs.orderUrl;

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
    detailOrder: (id) => apiBase.get(`${urlOrder}/${id}/order-detail/`),
    detailOrderUpdate: (id) => apiBase.get(`${urlOrder}/${id}/`),
    postOrder: (order) => apiBase.post(`${urlOrder}/`, order),
    putOrder: (order) => apiBase.put(`${urlOrder}/${order.id}/`, order),
    deleteOrder: (id) => apiBase.delete(`${urlOrder}/${id}/`),
    getOrdersFromCustomerNotMatched: (
        currencyId, 
        providerId, 
        customerId
    ) => apiBase.get(
        `${urlOrder}/orders-from-currency-customer-free-bill/${currencyId}/${providerId}/${customerId}/`
    ),
    getOrdersByIds: (ordersIds) => apiBase.post(`${urlOrder}/get-orders-by-ids/`, { ordersIds })
}








