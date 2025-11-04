import api from './client';

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  images: string[];
  categoryId: string;
  brandId: string;
  vendorId: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  categoryId: string;
  brandId: string;
  images?: string[];
  specifications?: Record<string, any>;
  tags?: string[];
}

// Product API Service
export const productAPI = {
  // Get all products with filters
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Create product (vendor/admin)
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  // Update product
  update: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Toggle product active status
  toggleActive: async (id: string): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/toggle-active`);
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit = 10): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get related products
  getRelated: async (productId: string, limit = 10): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Search products
  search: async (query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get vendor products
  getVendorProducts: async (vendorId: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>(`/vendors/${vendorId}/products`, {
      params: filters,
    });
    return response.data;
  },

  // Bulk import products (CSV)
  bulkImport: async (file: File): Promise<{ success: number; failed: number; errors: string[] }> => {
    const response = await api.upload<{ success: number; failed: number; errors: string[] }>(
      '/products/bulk-import',
      file
    );
    return response.data;
  },

  // Bulk export products (CSV)
  bulkExport: async (filters?: ProductFilters): Promise<void> => {
    await api.download('/products/bulk-export', 'products.csv');
  },
};

export default productAPI;
