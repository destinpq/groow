import api from './client';

// API Response wrapper types
export interface ShoppingListsAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedShoppingListsResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Note: Backend currently only has WishlistItem entity, not full ShoppingList
// This frontend service provides extended shopping list functionality

// Types
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isDefault: boolean;
  itemCount: number;
  totalValue: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  listId: string;
  productId: string;
  product?: any;
  quantity: number;
  notes?: string;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShoppingListData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddItemToListData {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Shopping Lists API
export const shoppingListsAPI = {
  // Get all lists
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ShoppingList>> => {
    const response = await api.get<PaginatedShoppingListsResponse<ShoppingList>>('/shopping-lists', { params });
    return {
      data: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      limit: params?.limit || 10,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // Get list by ID
  getById: async (id: string): Promise<ShoppingList> => {
    const response = await api.get<ShoppingListsAPIResponse<ShoppingList>>(`/shopping-lists/${id}`);
    return response?.data?.data || response?.data;
  },

  // Create list
  create: async (data: CreateShoppingListData): Promise<ShoppingList> => {
    const response = await api.post<ShoppingListsAPIResponse<ShoppingList>>('/shopping-lists', data);
    return response?.data?.data || response?.data;
  },

  // Update list
  update: async (id: string, data: Partial<CreateShoppingListData>): Promise<ShoppingList> => {
    const response = await api.put<ShoppingListsAPIResponse<ShoppingList>>(`/shopping-lists/${id}`, data);
    return response?.data?.data || response?.data;
  },

  // Delete list
  delete: async (id: string): Promise<void> => {
    await api.delete(`/shopping-lists/${id}`);
  },

  // Get list items
  getItems: async (listId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ShoppingListItem>> => {
    const response = await api.get<PaginatedShoppingListsResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items`, { params });
    return {
      data: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      limit: params?.limit || 10,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  // Add item to list
  addItem: async (listId: string, data: AddItemToListData): Promise<ShoppingListItem> => {
    const response = await api.post<ShoppingListsAPIResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items`, data);
    return response?.data?.data || response?.data;
  },

  // Update item
  updateItem: async (listId: string, itemId: string, data: Partial<AddItemToListData>): Promise<ShoppingListItem> => {
    const response = await api.put<ShoppingListsAPIResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items/${itemId}`, data);
    return response?.data?.data || response?.data;
  },

  // Remove item
  removeItem: async (listId: string, itemId: string): Promise<void> => {
    await api.delete(`/shopping-lists/${listId}/items/${itemId}`);
  },

  // Mark item as purchased
  markPurchased: async (listId: string, itemId: string, purchased: boolean): Promise<ShoppingListItem> => {
    const response = await api.patch<ShoppingListsAPIResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items/${itemId}/purchased`, { purchased });
    return response?.data?.data || response?.data;
  },

  // Add all items to cart
  addAllToCart: async (listId: string): Promise<{ addedItems: number }> => {
    const response = await api.post<ShoppingListsAPIResponse<{ addedItems: number }>>(`/shopping-lists/${listId}/add-to-cart`);
    return response?.data?.data || response?.data;
  },

  // Share list
  share: async (listId: string): Promise<{ shareUrl: string }> => {
    const response = await api.post<ShoppingListsAPIResponse<{ shareUrl: string }>>(`/shopping-lists/${listId}/share`);
    return response?.data?.data || response?.data;
  },
};

export default shoppingListsAPI;
