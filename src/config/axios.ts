import { StoreType } from './../redux';
import axios from 'axios';
import config from '.';

let store: StoreType;

export const injectStore = (_store: StoreType) => {
  store = _store
}

const axiosInstance =  axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (store.getState().tenantReducer.tenantId) {
    config.headers['X-Tenant'] = store.getState().tenantReducer.tenantId; 
  }
  
  return config;
}, error => {
  return Promise.reject(error)
});

export default axiosInstance;