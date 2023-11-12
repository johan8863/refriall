import apiBase from "./base.service";

const urlKit ='/stock/kits';

export const listKit = async () => {
    return await apiBase.get(`${urlKit}/`);
};

export const detatilKit = async (id) => {
    return await apiBase.get(`${urlKit}/${id}/`);
}

export const postKit = async (kit) => {
    return await apiBase.post(`${urlKit}/`, kit);
};

export const putKit = async (kit) => {
    return await apiBase.put(`${urlKit}/${kit.id}/`, kit);
};

export const deleteKit = async (id) => {
    await apiBase.delete(`${urlKit}/${id}/`);
};