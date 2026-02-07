import { kitAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlKit = kitAPIEnvs.kitUrl;
const urlKitListPagination = kitAPIEnvs.kitListPaginationUrl;

export const getAllKits = () => apiBase.get(`${urlKit}/`)

export const listKit = (currentPage=null, searchTerm = null) => {
    const params = {}
    
    if (currentPage) {
        params.page = currentPage;
    }
    
    if (searchTerm) {
        params.search = searchTerm;
    }
    
    return apiBase.get(urlKitListPagination, { params });
};

export const searchKits = (searchTerm, page = 1) => {
    const params = { search: searchTerm };
    if (page > 1) {
        params.page = page;
    }
    return apiBase.get(urlKitListPagination, { params });
};

export const detatilKit = (id) => {
    return apiBase.get(`${urlKit}/${id}/`);
};

export const postKit = (kit) => {
    return apiBase.post(`${urlKit}/`, kit);
};

export const putKit = (kit) => {
    return apiBase.put(`${urlKit}/${kit.id}/`, kit);
};

export const deleteKit = (id) => {
    apiBase.delete(`${urlKit}/${id}/`);
};