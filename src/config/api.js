import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;