import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://quiz-be-rouge.vercel.app/';
};

const api = axios.create({
  baseURL: getBaseURL(),
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