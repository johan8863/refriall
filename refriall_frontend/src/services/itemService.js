import { itemAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlItem = itemAPIEnvs.itemUrl;
const urlItemListPagination = itemAPIEnvs.itemListPaginationUrl;

export const itemService = {
    listItem: (currentPage = null, searchTerm = null) => {
        const params = {};
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(urlItemListPagination, { params });
    },
    listItemsForSelect: (searchTerm = null) => {
        const params = {};
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get('/stock/items/list/select/', { params });
    },
    searchItems: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(urlItemListPagination, { params });
    },
    getItem: (id) => apiBase.get(`${urlItem}/${id}/`),
    detailItem: (id) => apiBase.get(`${urlItem}/detail/${id}/`),
    postItem: (item) => apiBase.post(`${urlItem}/`, item),
    putItem: (item) => apiBase.put(`${urlItem}/${item.id}/`, item),
    deleteItem: (id) => apiBase.delete(`${urlItem}/${id}/`),
}
