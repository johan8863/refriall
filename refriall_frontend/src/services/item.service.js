import { itemAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlItem = itemAPIEnvs.itemUrl;
const urlItemListPagination = itemAPIEnvs.itemListPaginationUrl;

export const listItem = (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get(urlItemListPagination, { params });
};

export const listItemsForSelect = (searchTerm = null) => {
    const params = {};
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get('/stock/items/list/select/', { params });
};

export const searchItems = (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return apiBase.get(urlItemListPagination, { params });
};

export const getItem = (id) => {
    return apiBase.get(`${urlItem}/${id}/`);
};

export const detailItem = (id) => {
    return apiBase.get(`${urlItem}/detail/${id}/`);
};

export const postItem = (item) => {
    return apiBase.post(`${urlItem}/`, item);
};

export const putItem = (item) => {
    return apiBase.put(`${urlItem}/${item.id}/`, item);
};

export const deleteItem = (id) => {
    return apiBase.delete(`${urlItem}/${id}/`);
};