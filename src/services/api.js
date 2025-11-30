// src/lib/api.js  ← CREATE THIS FILE EXACTLY
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://srs-backend-7ch1.onrender.com/api',
  timeout: 15000,
});

// THIS IS THE KEY — ADD TOKEN TO EVERY REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GLOBAL 401 HANDLER — Auto logout if token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;