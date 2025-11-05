import apiClient from './api-client';

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
  
  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),
};

// Products API
export const productsApi = {
  getAll: (params?: any) =>
    apiClient.get('/products', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/products/${id}/status`, { status }),
  
  updateStock: (id: string, stock: number) =>
    apiClient.patch(`/products/${id}/stock`, { stock }),
  
  getFeatured: () =>
    apiClient.get('/products/featured'),
  
  search: (query: string, params?: any) =>
    apiClient.get('/products/search', { params: { ...params, search: query } }),
};

// Categories API
export const categoriesApi = {
  getAll: () =>
    apiClient.get('/categories'),
  
  getById: (id: string) =>
    apiClient.get(`/categories/${id}`),
  
  create: (data: any) =>
    apiClient.post('/categories', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/categories/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};

// Brands API
export const brandsApi = {
  getAll: () =>
    apiClient.get('/brands'),
  
  create: (data: any) =>
    apiClient.post('/brands', data),
  
  delete: (id: string) =>
    apiClient.delete(`/brands/${id}`),
};

// Cart API
export const cartApi = {
  get: () =>
    apiClient.get('/cart'),
  
  add: (productId: string, quantity: number, variantId?: string) =>
    apiClient.post('/cart', { productId, quantity, variantId }),
  
  update: (id: string, quantity: number) =>
    apiClient.patch(`/cart/${id}`, { quantity }),
  
  remove: (id: string) =>
    apiClient.delete(`/cart/${id}`),
  
  clear: () =>
    apiClient.delete('/cart'),
};

// Wishlist API
export const wishlistApi = {
  get: () =>
    apiClient.get('/wishlist'),
  
  add: (productId: string) =>
    apiClient.post('/wishlist', { productId }),
  
  remove: (id: string) =>
    apiClient.delete(`/wishlist/${id}`),
  
  moveToCart: (id: string) =>
    apiClient.post(`/wishlist/${id}/move-to-cart`),
};

// Orders API
export const ordersApi = {
  create: (data: any) =>
    apiClient.post('/orders', data),
  
  getAll: (params?: any) =>
    apiClient.get('/orders', { params }),
  
  getMyOrders: (params?: any) =>
    apiClient.get('/orders/my-orders', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  getByOrderNumber: (orderNumber: string) =>
    apiClient.get(`/orders/number/${orderNumber}`),
  
  updateStatus: (id: string, data: any) =>
    apiClient.patch(`/orders/${id}/status`, data),
  
  cancel: (id: string) =>
    apiClient.patch(`/orders/${id}/cancel`),
  
  getStats: () =>
    apiClient.get('/orders/stats'),
};

// RFQ API
export const rfqApi = {
  create: (data: any) =>
    apiClient.post('/rfq', data),
  
  getAll: (params?: any) =>
    apiClient.get('/rfq', { params }),
  
  getMyRfqs: (params?: any) =>
    apiClient.get('/rfq/my-rfqs', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/rfq/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/rfq/${id}/status`, { status }),
  
  getQuotations: (rfqId: string) =>
    apiClient.get(`/rfq/${rfqId}/quotations`),
  
  submitQuotation: (data: any) =>
    apiClient.post('/rfq/quotations', data),
  
  getMyQuotations: () =>
    apiClient.get('/rfq/quotations/my-quotations'),
  
  acceptQuotation: (id: string) =>
    apiClient.patch(`/rfq/quotations/${id}/accept`),
};

// Payment API
export const paymentApi = {
  initiate: (data: any) =>
    apiClient.post('/payment/initiate', data),
  
  verify: (id: string, data: any) =>
    apiClient.post(`/payment/${id}/verify`, data),
  
  getHistory: (params?: any) =>
    apiClient.get('/payment/history', { params }),
  
  getMyPayments: (params?: any) =>
    apiClient.get('/payment/my-payments', { params }),
  
  getWalletBalance: () =>
    apiClient.get('/payment/wallet/balance'),
  
  getWalletTransactions: () =>
    apiClient.get('/payment/wallet/transactions'),
};

// Upload API
export const uploadApi = {
  single: (file: File, entityType?: string, entityId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    
    return apiClient.post(`/upload/single?${params.toString()}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  multiple: (files: File[], entityType?: string, entityId?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    
    return apiClient.post(`/upload/multiple?${params.toString()}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getByEntity: (entityType: string, entityId: string) =>
    apiClient.get(`/upload/entity/${entityType}/${entityId}`),
  
  getMyUploads: () =>
    apiClient.get('/upload/my-uploads'),
  
  delete: (id: string) =>
    apiClient.delete(`/upload/${id}`),
};

// CMS API
export const cmsApi = {
  // Banners
  getBanners: () =>
    apiClient.get('/cms/banners'),
  
  getActiveBanners: (placement?: string) =>
    apiClient.get('/cms/banners/active', { params: { placement } }),
  
  createBanner: (data: any) =>
    apiClient.post('/cms/banners', data),
  
  updateBanner: (id: string, data: any) =>
    apiClient.put(`/cms/banners/${id}`, data),
  
  deleteBanner: (id: string) =>
    apiClient.delete(`/cms/banners/${id}`),
  
  // FAQs
  getFaqs: () =>
    apiClient.get('/cms/faqs'),
  
  getActiveFaqs: (category?: string) =>
    apiClient.get('/cms/faqs/active', { params: { category } }),
  
  createFaq: (data: any) =>
    apiClient.post('/cms/faqs', data),
  
  updateFaq: (id: string, data: any) =>
    apiClient.put(`/cms/faqs/${id}`, data),
  
  deleteFaq: (id: string) =>
    apiClient.delete(`/cms/faqs/${id}`),
  
  // Pages
  getPages: () =>
    apiClient.get('/cms/pages'),
  
  getPageBySlug: (slug: string) =>
    apiClient.get(`/cms/pages/${slug}`),
  
  createPage: (data: any) =>
    apiClient.post('/cms/pages', data),
  
  updatePage: (id: string, data: any) =>
    apiClient.put(`/cms/pages/${id}`, data),
  
  deletePage: (id: string) =>
    apiClient.delete(`/cms/pages/${id}`),
};
