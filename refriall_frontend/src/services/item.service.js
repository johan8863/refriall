import apiBase from "./base.service";

const urlItem = '/stock/items'

export const listItem = async () => {
    return await apiBase.get(`${urlItem}/`);
};

export const detailItem = async (id) => {
    return await apiBase.get(`${urlItem}/${id}/`);
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