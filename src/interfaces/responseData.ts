type ResponseDataError = {
    [s: string]: string[]  
}

export default interface IResponseData {
    message: string
    errors?: ResponseDataError
}