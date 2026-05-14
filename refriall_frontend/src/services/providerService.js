import { providerAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

const urlProvider = providerAPIEnvs.providerUrl;

export const providerService = {
    listProvider: (currentPage) => apiBase.get(`${urlProvider}/get-providers-paginated/?page=${currentPage}`),
    listAllProviders: () => apiBase.get(`${urlProvider}/`),
    listProviderCurrencyOrderNoBill: (currency) => apiBase.get(`${urlProvider}/get-provider-order-currency-no-bill/${currency}/`),
    detailProvider: (id) => apiBase.get(`${urlProvider}/${id}/`),
    postProvider: (provider) => apiBase.post(`${urlProvider}/`, provider),
    putProvider: (provider) => apiBase.put(`${urlProvider}/${provider.id}/`, provider),
    deleteProvider: (id) => apiBase.delete(`${urlProvider}/${id}/`),
}
