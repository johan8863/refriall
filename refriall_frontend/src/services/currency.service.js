import apiBase from "./base.service";

const url = '/finance/currencies_write'

export const listCurrencies = async () => await apiBase.get(`${url}/`)

export const detailCurrency = async (id) => await apiBase.get(`${url}/${id}/`)