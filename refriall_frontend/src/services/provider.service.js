import apiBase from "./base.service";

const urlProvider = '/hr/providers'
const urlProviderListPagination = '/hr/providers/list/pagination'

export const listProvider = async (currentPage) => {
    return await apiBase.get(`${urlProviderListPagination}/?page=${currentPage}`);
};

export const listAllProviders = async () => {
    return await apiBase.get(`${urlProvider}/`);
};

export const detailProvider = async (id) => {
    return await apiBase.get(`${urlProvider}/${id}/`);
};

export const postProvider = async (provider) => {
    return await apiBase.post(`${urlProvider}/`, provider);
};

export const putProvider = async (provider) => {
    return await apiBase.put(`${urlProvider}/${provider.id}/`, provider);
};

export const deleteProvider = async (id) => {
    await apiBase.delete(`${urlProvider}/${id}/`);
};