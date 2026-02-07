import { providerAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const urlProvider = providerAPIEnvs.providerUrl;
const urlProviderListPagination = providerAPIEnvs.providerListPaginationUrl;
const urlProviderCurrencyOrderNoBill = providerAPIEnvs.providerCurrencyOrderNoBillUrl;

export const listProvider = (currentPage) => {
    return apiBase.get(`${urlProviderListPagination}/?page=${currentPage}`);
};

export const listAllProviders = () => {
    return apiBase.get(`${urlProvider}/`);
};

export const listProviderCurrencyOrderNoBill = (currency) => {
    return apiBase.get(`${urlProviderCurrencyOrderNoBill}/${currency}/`)
};

export const detailProvider = (id) => {
    return apiBase.get(`${urlProvider}/${id}/`);
};

export const postProvider = (provider) => {
    return apiBase.post(`${urlProvider}/`, provider);
};

export const putProvider = (provider) => {
    return apiBase.put(`${urlProvider}/${provider.id}/`, provider);
};

export const deleteProvider = (id) => {
    apiBase.delete(`${urlProvider}/${id}/`);
};