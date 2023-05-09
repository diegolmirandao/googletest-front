import axios from 'axios';
import config from '.';

export default axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});