import apiBase from "./base.service";

const urlProvider = '/hr/providers'

export const listProvider = async () => {
    try {
        return await apiBase.get(`${urlProvider}/`);
    } catch (error) {
        console.log(error);
    }
};

export const detailProvider = async (id) => {
    try {
        return await apiBase.get(`${urlProvider}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};

export const postProvider = async (provider) => {
    try {
        return await apiBase.post(`${urlProvider}/`, provider);
    } catch (error) {
        console.log(error);
    }
};

export const putProvider = async (provider) => {
    try {
        return await apiBase.put(`${urlProvider}/${provider.id}/`, provider);
    } catch (error) {
        console.log(error);
    }
};

export const deleteProvider = async (id) => {
    try {
        await apiBase.delete(`${urlProvider}/${id}/`);
    } catch (error) {
        console.log(error);
    }
};