import apiBase from "./base.service";

const url = '/finance/currencies_write'

export const listCurrencies = async () => await apiBase.get(`${url}/`)