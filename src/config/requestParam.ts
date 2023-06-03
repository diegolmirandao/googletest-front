type RequestParam = {
    initialQty: number
    pageSize: number
    batchQty: number
    requestQtyPerMinute: number
}

type RequestParamConfig = Record<string, RequestParam>

const requestParamConfig: RequestParamConfig = {
    users: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    customers: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    products: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    sales: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    accountsReceivable: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    customerPayments: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    purchases: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    accountsPayable: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    },
    supplierPayments: {
        initialQty: 1000,
        pageSize: 20,
        batchQty: 1000,
        requestQtyPerMinute: 5
    }
}

export default requestParamConfig