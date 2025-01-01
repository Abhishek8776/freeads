import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://13.201.137.144:8000/',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;