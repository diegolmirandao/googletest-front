import requestParamConfig from "src/config/requestParam"

const useRequestParam = (configName: string) => {
    return requestParamConfig[configName]
}

export default useRequestParam