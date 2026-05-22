export const allEnvs = import.meta.env

export const billsAPIEnvs = {
    // billListPaginationUrl: allEnvs.VITE_BILL_LIST_PAGINATION_URL,
    billDetailUrl: allEnvs.VITE_BILL_DETAIL_URL,
    billDetailUpdateUrl: allEnvs.VITE_BILL_DETAIL_UPDATE_URL,
    billUrl: allEnvs.VITE_BILL_URL,
}

export const currenciesAPIEnvs = {
    currenciesUrl: allEnvs.VITE_CURRENCIES_URL
}

export const customerAPIEnvs = {
    customerUrl: allEnvs.VITE_CUSTOMER_URL,
}

export const customerDependencyAPIEnvs = {
    customerDependencyUrl: allEnvs.VITE_CUSTOMER_DEPENDENCY_URL
}

export const itemAPIEnvs = {
    itemUrl: allEnvs.VITE_ITEM_URL,
}

export const kitAPIEnvs = {
    kitUrl: allEnvs.VITE_KIT_URL,
}

export const orderAPIEnvs = {
    orderUrl: allEnvs.VITE_ORDER_URL,
}

export const providerAPIEnvs = {
    providerUrl: allEnvs.VITE_PROVIDER_URL,
}

export const authAPIEnvs = {
    tokenPairUrl: allEnvs.VITE_TOKEN_PAIR_URL,
    refreshTokenUrl: allEnvs.VITE_REFRESH_TOKEN_URL,
}
