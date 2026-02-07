import { currenciesAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const url = currenciesAPIEnvs.currenciesUrl;

export const listCurrencies = () => apiBase.get(`${url}/`);

export const detailCurrency = (id) => apiBase.get(`${url}/${id}/`);

export const postCurrency = (currency) => apiBase.post(`${url}/`, currency);

export const putCurrency = (currency) => apiBase.put(`${url}/${currency.id}/`, currency);

export const deleteCurrency = (id) => apiBase.delete(`${url}/${id}/`);