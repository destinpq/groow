import api from './client';

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
    const response = await api.get<PaginatedResponse<ShoppingList>>('/shopping-lists', { params });
    return response.data;
  },

  // Get list by ID
  getById: async (id: string): Promise<ShoppingList> => {
    const response = await api.get<ShoppingList>(`/shopping-lists/${id}`);
    return response.data;
  },

  // Create list
  create: async (data: CreateShoppingListData): Promise<ShoppingList> => {
    const response = await api.post<ShoppingList>('/shopping-lists', data);
    return response.data;
  },

  // Update list
  update: async (id: string, data: Partial<CreateShoppingListData>): Promise<ShoppingList> => {
    const response = await api.put<ShoppingList>(`/shopping-lists/${id}`, data);
    return response.data;
  },

  // Delete list
  delete: async (id: string): Promise<void> => {
    const response = await api.delete<void>(`/shopping-lists/${id}`);
    return response.data;
  },

  // Get list items
  getItems: async (listId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ShoppingListItem>> => {
    const response = await api.get<PaginatedResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items`, { params });
    return response.data;
  },

  // Add item to list
  addItem: async (listId: string, data: AddItemToListData): Promise<ShoppingListItem> => {
    const response = await api.post<ShoppingListItem>(`/shopping-lists/${listId}/items`, data);
    return response.data;
  },

  // Update item
  updateItem: async (listId: string, itemId: string, data: Partial<AddItemToListData>): Promise<ShoppingListItem> => {
    const response = await api.put<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}`, data);
    return response.data;
  },

  // Remove item
  removeItem: async (listId: string, itemId: string): Promise<void> => {
    const response = await api.delete<void>(`/shopping-lists/${listId}/items/${itemId}`);
    return response.data;
  },

  // Mark item as purchased
  markPurchased: async (listId: string, itemId: string, purchased: boolean): Promise<ShoppingListItem> => {
    const response = await api.patch<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}/purchased`, { purchased });
    return response.data;
  },

  // Add all items to cart
  addAllToCart: async (listId: string): Promise<{ addedItems: number }> => {
    const response = await api.post<{ addedItems: number }>(`/shopping-lists/${listId}/add-to-cart`);
    return response.data;
  },

  // Share list
  share: async (listId: string): Promise<{ shareUrl: string }> => {
    const response = await api.post<{ shareUrl: string }>(`/shopping-lists/${listId}/share`);
    return response.data;
  },
};

export default shoppingListsAPI;
