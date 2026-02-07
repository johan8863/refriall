import { kitAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlKit = kitAPIEnvs.kitUrl;
const urlKitListPagination = kitAPIEnvs.kitListPaginationUrl;

export const kitService = {
    getAllKits: () => apiBase.get(`${urlKit}/`),
    listKit: (currentPage=null, searchTerm = null) => {
        const params = {}
        
        if (currentPage) {
            params.page = currentPage;
        }
        
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        return apiBase.get(urlKitListPagination, { params })
    },
    searchKits: (searchTerm, page = 1) => {
        const params = { search: searchTerm };
        if (page > 1) {
            params.page = page;
        }
        return apiBase.get(urlKitListPagination, { params });
    },
    detailKit: (id) => apiBase.get(`${urlKit}/${id}/`),
    postKit: (kit) => apiBase.post(`${urlKit}/`, kit),    
    putKit: (kit) => apiBase.put(`${urlKit}/${kit.id}/`, kit),
    deleteKit: (id) => apiBase.delete(`${urlKit}/${id}/`),
}
