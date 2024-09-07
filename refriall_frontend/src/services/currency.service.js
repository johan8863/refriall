import apiBase from "./base.service";

const url = '/finance/currencies_write'

export const listCurrencies = async () => await apiBase.get(`${url}/`)

export const detailCurrency = async (id) => await apiBase.get(`${url}/${id}/`)

export const postCurrency = async (currency) => await apiBase.post(`${url}/`, currency)

export const putCurrency = async (currency) => await apiBase.put(`${url}/${currency.id}/`, currency)