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
    }
}

export default requestParamConfig