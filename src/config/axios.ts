import axios from 'axios';
import config from '.';

export default axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  headers: {
    'X-Tenant': '03c995c4-82a1-41bb-8efd-a5dbcc0e26aa'
  }
});