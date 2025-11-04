import request from '@/utils/request';

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    request.post('/auth/login', data),
  
  register: (data: any) =>
    request.post('/auth/register', data),
  
  getProfile: () =>
    request.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) =>
    request.get('/products', { params }),
  
  getById: (id: string) =>
    request.get(`/products/${id}`),
  
  create: (data: any) =>
    request.post('/products', data),
  
  update: (id: string, data: any) =>
    request.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    request.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () =>
    request.get('/cart'),
  
  add: (data: { productId: string; quantity: number; variantId?: string }) =>
    request.post('/cart', data),
  
  update: (id: string, quantity: number) =>
    request.patch(`/cart/${id}`, { quantity }),
  
  remove: (id: string) =>
    request.delete(`/cart/${id}`),
  
  clear: () =>
    request.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (data: any) =>
    request.post('/orders', data),
  
  getMyOrders: (params?: any) =>
    request.get('/orders/my-orders', { params }),
  
  getById: (id: string) =>
    request.get(`/orders/${id}`),
  
  cancel: (id: string) =>
    request.patch(`/orders/${id}/cancel`),
};

// Payment API
export const paymentAPI = {
  initiate: (data: any) =>
    request.post('/payment/initiate', data),
  
  verify: (id: string, data: any) =>
    request.post(`/payment/${id}/verify`, data),
  
  getWalletBalance: () =>
    request.get('/payment/wallet/balance'),
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  payment: paymentAPI,
};
