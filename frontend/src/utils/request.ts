import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      message.error('Session expired. Please login again.');
    } else {
      const errorMessage = (error.response?.data as any)?.message || error.message;
      message.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
