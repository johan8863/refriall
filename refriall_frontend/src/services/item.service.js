import apiBase from "./base.service";

const urlItem = '/stock/items'
const urlItemListPagination = '/stock/items/list/pagination'

export const listItem = async (currentPage=null) => {
    try {
        if (currentPage) {
            return await apiBase.get(`${urlItemListPagination}/?page=${currentPage}`);
        } else {
            return await apiBase.get(`${urlItem}/?page=${currentPage}`);
        }
    } catch (error) {
        console.log(error);
    }
};

export const detailItem = async (id) => {
    try {
        return await apiBase.get(`${urlItem}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postItem = async (item) => {
    try {
        return await apiBase.post(`${urlItem}/`, item);
    } catch (error) {
        console.log(error);
    }
};

export const putItem = async (item) => {
    try {
        return await apiBase.put(`${urlItem}/${item.id}/`, item);
    } catch (error) {
        console.log(error);
    }
};

export const deleteItem = async (id) => {
    try {
        await apiBase.delete(`${urlItem}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};