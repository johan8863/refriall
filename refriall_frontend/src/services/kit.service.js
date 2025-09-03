import apiBase from "./base.service";

const urlKit ='/stock/kits';
const urlKitListPagination ='/stock/kits/list/pagination';

export const listKit = async (currentPage=null, searchTerm = null) => {
    const params = {}
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return await apiBase.get(urlKitListPagination, { params });
};

export const searchKits = async (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return await apiBase.get(urlKitListPagination, { params });
};

export const detatilKit = async (id) => {
    return await apiBase.get(`${urlKit}/${id}/`);
};

export const postKit = async (kit) => {
    return await apiBase.post(`${urlKit}/`, kit);
};

export const putKit = async (kit) => {
    return await apiBase.put(`${urlKit}/${kit.id}/`, kit);
};

export const deleteKit = async (id) => {
    await apiBase.delete(`${urlKit}/${id}/`);
};