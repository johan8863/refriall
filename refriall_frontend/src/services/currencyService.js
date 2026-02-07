import { currenciesAPIEnvs } from "../settings/env";
import apiBase from "./base.service";

const url = currenciesAPIEnvs.currenciesUrl;

export const currencyService = {
    listCurrencies: () => apiBase.get(`${url}/`),
    detailCurrency: (id) => apiBase.get(`${url}/${id}/`),
    postCurrency: (currency) => apiBase.post(`${url}/`, currency),
    putCurrency: (currency) => apiBase.put(`${url}/${currency.id}/`, currency),
    deleteCurrency: (id) => apiBase.delete(`${url}/${id}/`),
}
