export const allEnvs = import.meta.env

export const billsAPIEnvs = {
    billListPaginationUrl: allEnvs.VITE_BILL_LIST_PAGINATION_URL,
    billDetailUrl: allEnvs.VITE_BILL_DETAIL_URL,
    billDetailUpdateUrl: allEnvs.VITE_BILL_DETAIL_UPDATE_URL,
    billPostUrl: allEnvs.VITE_BILLPOST_URL,
}

export const currenciesAPIEnvs = {
    currenciesUrl: allEnvs.VITE_CURRENCIES_URL
}

export const customerAPIEnvs = {
    customerUrl: allEnvs.VITE_CUSTOMER_URL,
    customerListPaginationUrl: allEnvs.VITE_CUSTOMER_LIST_PAGINATION_URL,
    customerDetailUrl: allEnvs.VITE_CUSTOMER_DETAIL_URL,
    customerOrderNoBillUrl: allEnvs.VITE_CUSTOMER_ORDER_NO_BILL_URL,
}

export const customerDependencyAPIEnvs = {
    customerDependencyUrl: allEnvs.VITE_CUSTOMER_DEPENDENCY_URL
}

export const itemAPIEnvs = {
    itemUrl: allEnvs.VITE_ITEM_URL,
    itemListPaginationUrl: allEnvs.VITE_ITEM_LIST_PAGINATION_URL,
}

export const kitAPIEnvs = {
    kitUrl: allEnvs.VITE_KIT_URL,
    kitListPaginationUrl: allEnvs.VITE_KIT_LIST_PAGINATION_URL,
}

export const orderAPIEnvs = {
    orderListUrl: allEnvs.VITE_ORDER_LIST_URL,
    orderListPaginationUrl: allEnvs.VITE_ORDER_LIST_PAGINATION_URL,
    orderDetailUrl: allEnvs.VITE_ORDER_DETAIL_URL,
    orderPostUrl: allEnvs.VITE_ORDER_POST_URL,
    orderFromCustomerNotMatchedUrl: allEnvs.VITE_ORDER_FROM_CUSTOMER_NOT_MATCHED_URL,
    orderFromCustomerUrl: allEnvs.VITE_ORDER_FROM_CUSTOMER_URL,
    orderNotMatchedUrl: allEnvs.VITE_ORDER_NOT_MATCHED_URL,
}

export const providerAPIEnvs = {
    providerUrl: allEnvs.VITE_PROVIDER_URL,
    providerListPaginationUrl: allEnvs.VITE_PROVIDER_LIST_PAGINATION_URL,
    providerCurrencyOrderNoBillUrl: allEnvs.VITE_PROVIDER_CURRENCY_ORDER_NO_BILL_URL,
}