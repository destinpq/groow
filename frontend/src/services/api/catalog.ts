import api from './client';

// Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  order?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  website?: string;
}

// Categories API Service
export const categoriesAPI = {
  // Get all categories (with hierarchy)
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories', {
      params: { includeInactive },
    });
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create category
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  // Update category
  update: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Toggle active status
  toggleActive: async (id: string): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}/toggle-active`);
    return response.data;
  },

  // Get category tree (hierarchical structure)
  getTree: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories/tree');
    return response.data;
  },

  // Reorder categories
  reorder: async (categoryId: string, newOrder: number): Promise<void> => {
    await api.patch(`/categories/${categoryId}/reorder`, { order: newOrder });
  },
};

// Brands API Service
export const brandsAPI = {
  // Get all brands
  getAll: async (includeInactive = false): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/brands', {
      params: { includeInactive },
    });
    return response.data;
  },

  // Get brand by ID
  getById: async (id: string): Promise<Brand> => {
    const response = await api.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  // Get brand by slug
  getBySlug: async (slug: string): Promise<Brand> => {
    const response = await api.get<Brand>(`/brands/slug/${slug}`);
    return response.data;
  },

  // Create brand
  create: async (data: CreateBrandData): Promise<Brand> => {
    const response = await api.post<Brand>('/brands', data);
    return response.data;
  },

  // Update brand
  update: async (id: string, data: Partial<CreateBrandData>): Promise<Brand> => {
    const response = await api.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },

  // Delete brand
  delete: async (id: string): Promise<void> => {
    await api.delete(`/brands/${id}`);
  },

  // Toggle active status
  toggleActive: async (id: string): Promise<Brand> => {
    const response = await api.patch<Brand>(`/brands/${id}/toggle-active`);
    return response.data;
  },

  // Get popular brands
  getPopular: async (limit = 10): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/brands/popular', {
      params: { limit },
    });
    return response.data;
  },
};

export default { categoriesAPI, brandsAPI };
