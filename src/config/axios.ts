import axios from 'axios';
import config from '.';

export default axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  headers: {
    'X-Tenant': '34601135-5969-4f09-8597-ec7af8eaabfc'
  }
});