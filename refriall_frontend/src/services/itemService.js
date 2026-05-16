import { itemAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlItem = itemAPIEnvs.itemUrl;

export const itemService = {
    listItem: (currentPage = null, searchTerm = null) => {
        const params = {};
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(`${urlItem}/item-list-pagination/`, { params });
    },
    listItemsForSelect: (searchTerm = null) => {
        const params = {};
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(urlItem, { params });
    },
    searchItems: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(`${urlItem}/item-list-pagination/`, { params });
    },
    getItem: (id) => apiBase.get(`${urlItem}/${id}/`),
    detailItem: (id) => apiBase.get(`${urlItem}/detail/${id}/`),
    postItem: (item) => apiBase.post(`${urlItem}/`, item),
    putItem: (item) => apiBase.put(`${urlItem}/${item.id}/`, item),
    deleteItem: (id) => apiBase.delete(`${urlItem}/${id}/`),
}
