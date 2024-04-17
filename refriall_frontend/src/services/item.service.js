import apiBase from "./base.service";

const urlItem = '/stock/items'
const urlItemListPagination = '/stock/items/list/pagination'
const urlItemDetail = '/stock/items/detail'

export const listItem = async (currentPage=null) => {
    if (currentPage) {
        return await apiBase.get(`${urlItemListPagination}/?page=${currentPage}`);
    } else {
        return await apiBase.get(`${urlItem}/`);
    }
};

export const getItem = async(id) => {
    return await apiBase.get(`${urlItem}/${id}/`)
}

export const detailItem = async (id) => {
    return await apiBase.get(`${urlItemDetail}/${id}/`);
};

export const postItem = async (item) => {
    return await apiBase.post(`${urlItem}/`, item);
};

export const putItem = async (item) => {
    return await apiBase.put(`${urlItem}/${item.id}/`, item);
};

export const deleteItem = async (id) => {
    await apiBase.delete(`${urlItem}/${id}/`);
};