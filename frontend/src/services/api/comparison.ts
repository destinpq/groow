import api from './client';

// Types
export interface ComparisonList {
  id: string;
  userId: string;
  name: string;
  products: string[]; // Product IDs
  createdAt: string;
  updatedAt: string;
}

export interface ProductComparison {
  products: any[];
  specifications: {
    [key: string]: any[];
  };
  priceComparison: {
    productId: string;
    price: number;
    comparePrice?: number;
    discount?: number;
  }[];
}

export interface CreateComparisonListData {
  name: string;
  products: string[];
}

// Product Comparison API
export const comparisonAPI = {
  // Get all comparison lists
  getLists: async (): Promise<ComparisonList[]> => {
    const response = await api.get<ComparisonList[]>('/comparisons/lists');
    return response.data;
  },

  // Get comparison list by ID
  getListById: async (id: string): Promise<ComparisonList> => {
    const response = await api.get<ComparisonList>(`/comparisons/lists/${id}`);
    return response.data;
  },

  // Create comparison list
  createList: async (data: CreateComparisonListData): Promise<ComparisonList> => {
    const response = await api.post<ComparisonList>('/comparisons/lists', data);
    return response.data;
  },

  // Add product to comparison
  addProduct: async (listId: string, productId: string): Promise<ComparisonList> => {
    const response = await api.post<ComparisonList>(`/comparisons/lists/${listId}/products`, { productId });
    return response.data;
  },

  // Remove product from comparison
  removeProduct: async (listId: string, productId: string): Promise<ComparisonList> => {
    const response = await api.delete<ComparisonList>(`/comparisons/lists/${listId}/products/${productId}`);
    return response.data;
  },

  // Compare products
  compare: async (productIds: string[]): Promise<ProductComparison> => {
    const response = await api.post<ProductComparison>('/comparisons/compare', { productIds });
    return response.data;
  },

  // Delete comparison list
  deleteList: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/comparisons/lists/${id}`);
    return response.data;
  },
};

export default comparisonAPI;
