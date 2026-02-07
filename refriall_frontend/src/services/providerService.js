import { providerAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlProvider = providerAPIEnvs.providerUrl;
const urlProviderListPagination = providerAPIEnvs.providerListPaginationUrl;
const urlProviderCurrencyOrderNoBill = providerAPIEnvs.providerCurrencyOrderNoBillUrl;

export const providerService = {
    listProvider: (currentPage) => apiBase.get(`${urlProviderListPagination}/?page=${currentPage}`),
    listAllProviders: () => apiBase.get(`${urlProvider}/`),
    listProviderCurrencyOrderNoBill: (currency) => apiBase.get(`${urlProviderCurrencyOrderNoBill}/${currency}/`),
    detailProvider: (id) => apiBase.get(`${urlProvider}/${id}/`),
    postProvider: (provider) => apiBase.post(`${urlProvider}/`, provider),
    putProvider: (provider) => apiBase.put(`${urlProvider}/${provider.id}/`, provider),
    deleteProvider: (id) => apiBase.delete(`${urlProvider}/${id}/`),
}
