import axios, { AxiosError, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/customer/login';
      }
    }
    
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    apiClient.post('/auth/register', data),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
  
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
}

// Products API
export const productsApi = {
  getAll: (params?: any) =>
    apiClient.get('/products', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: string, data: any) =>
    apiClient.patch(`/products/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
}

// Orders API
export const ordersApi = {
  getAll: (params?: any) =>
    apiClient.get('/orders', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  create: (data: any) =>
    apiClient.post('/orders', data),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }),
}

// RFQ API
export const rfqApi = {
  getAll: (params?: any) =>
    apiClient.get('/rfq', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/rfq/${id}`),
  
  create: (data: any) =>
    apiClient.post('/rfq', data),
  
  submitQuotation: (rfqId: string, data: any) =>
    apiClient.post(`/rfq/${rfqId}/quotations`, data),
}
