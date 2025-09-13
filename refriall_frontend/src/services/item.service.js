import apiBase from "./base.service";

const urlItem = '/stock/items'
const urlItemListPagination = '/stock/items/list/pagination'

export const listItem = async (currentPage = null, searchTerm = null) => {
    const params = {};
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return await apiBase.get(urlItemListPagination, { params });
};

export const listItemsForSelect = async (searchTerm = null) => {
    const params = {};
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return await apiBase.get('/stock/items/list/select/', { params });
};

export const searchItems = async (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return await apiBase.get(urlItemListPagination, { params });
};

export const getItem = async(id) => {
    return await apiBase.get(`${urlItem}/${id}/`);
};

export const detailItem = async (id) => {
    return await apiBase.get(`${urlItem}/detail/${id}/`);
};

export const postItem = async (item) => {
    return await apiBase.post(`${urlItem}/`, item);
};

export const putItem = async (item) => {
    return await apiBase.put(`${urlItem}/${item.id}/`, item);
};

export const deleteItem = async (id) => {
    return await apiBase.delete(`${urlItem}/${id}/`);
};