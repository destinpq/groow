/**
 * Inventory Management API Services
 * Admin functionality for managing product inventory
 */
import { api } from './client';

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  barcode?: string;
  productName: string;
  variantName?: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  maxStockLevel: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  supplier?: string;
  lastRestocked?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  type: 'restock' | 'sale' | 'adjustment' | 'return' | 'damaged' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string;
  cost?: number;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalMovements: number;
  recentMovements: StockMovement[];
  topProductsByValue: Array<{
    productId: string;
    productName: string;
    value: number;
    quantity: number;
  }>;
}

export interface StockAdjustment {
  productId: string;
  variantId?: string;
  quantity: number;
  reason: string;
  cost?: number;
  reference?: string;
}

export interface BulkStockUpdate {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    reason?: string;
  }>;
  type: 'restock' | 'adjustment';
}

export interface InventoryFilter {
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  category?: string;
  supplier?: string;
  location?: string;
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface InventoryListResponse {
  items: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    totalValue: number;
    totalQuantity: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

export interface RestockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  suggestedOrderQuantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export const inventoryManagementAPI = {
  /**
   * Get inventory items with filtering and pagination
   */
  getInventory: async (
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilter = {}
  ): Promise<InventoryListResponse> => {
    const { data } = await api.get('/admin/inventory', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get inventory item by ID
   */
  getInventoryItem: async (itemId: string): Promise<InventoryItem> => {
    const { data } = await api.get(`/admin/inventory/${itemId}`);
    return data;
  },

  /**
   * Update inventory levels
   */
  updateStock: async (itemId: string, quantity: number, reason: string): Promise<InventoryItem> => {
    const { data } = await api.put(`/admin/inventory/${itemId}/stock`, {
      quantity,
      reason,
    });
    return data;
  },

  /**
   * Adjust stock (increase/decrease)
   */
  adjustStock: async (adjustments: StockAdjustment[]): Promise<StockMovement[]> => {
    const { data } = await api.post('/admin/inventory/adjust', { adjustments });
    return data;
  },

  /**
   * Bulk update stock levels
   */
  bulkUpdateStock: async (update: BulkStockUpdate): Promise<StockMovement[]> => {
    const { data } = await api.post('/admin/inventory/bulk-update', update);
    return data;
  },

  /**
   * Get stock movement history
   */
  getStockMovements: async (
    productId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    movements: StockMovement[];
    pagination: any;
  }> => {
    const { data } = await api.get('/admin/inventory/movements', {
      params: { productId, page, limit },
    });
    return data;
  },

  /**
   * Get inventory statistics
   */
  getInventoryStats: async (): Promise<InventoryStats> => {
    const { data } = await api.get('/admin/inventory/stats');
    return data;
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: async (): Promise<RestockAlert[]> => {
    const { data } = await api.get('/admin/inventory/alerts/low-stock');
    return data;
  },

  /**
   * Get restock suggestions
   */
  getRestockSuggestions: async (): Promise<RestockAlert[]> => {
    const { data } = await api.get('/admin/inventory/suggestions/restock');
    return data;
  },

  /**
   * Set reorder levels
   */
  setReorderLevel: async (productId: string, reorderLevel: number, maxLevel?: number) => {
    const { data } = await api.put(`/admin/inventory/${productId}/reorder-level`, {
      reorderLevel,
      maxLevel,
    });
    return data;
  },

  /**
   * Track inventory by location
   */
  getInventoryByLocation: async (location: string) => {
    const { data } = await api.get('/admin/inventory/location', {
      params: { location },
    });
    return data;
  },

  /**
   * Transfer stock between locations
   */
  transferStock: async (
    productId: string,
    fromLocation: string,
    toLocation: string,
    quantity: number
  ) => {
    const { data } = await api.post('/admin/inventory/transfer', {
      productId,
      fromLocation,
      toLocation,
      quantity,
    });
    return data;
  },

  /**
   * Import inventory from CSV/Excel
   */
  importInventory: async (file: File, options?: { updateExisting: boolean }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const { data } = await api.post('/admin/inventory/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Export inventory data
   */
  exportInventory: async (format: 'csv' | 'xlsx', filters: InventoryFilter = {}) => {
    const { data } = await api.get('/admin/inventory/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Reserve stock for orders
   */
  reserveStock: async (items: Array<{ productId: string; variantId?: string; quantity: number }>) => {
    const { data } = await api.post('/admin/inventory/reserve', { items });
    return data;
  },

  /**
   * Release reserved stock
   */
  releaseReservedStock: async (reservationId: string) => {
    const { data } = await api.post(`/admin/inventory/release/${reservationId}`);
    return data;
  },

  /**
   * Get products needing attention (low stock, discontinued, etc.)
   */
  getProductsNeedingAttention: async () => {
    const { data } = await api.get('/admin/inventory/attention-needed');
    return data;
  },

  /**
   * Update inventory settings
   */
  updateInventorySettings: async (settings: {
    autoReorderEnabled?: boolean;
    lowStockThreshold?: number;
    trackInventoryByLocation?: boolean;
  }) => {
    const { data } = await api.put('/admin/inventory/settings', settings);
    return data;
  },

  /**
   * Get inventory valuation report
   */
  getValuationReport: async (method: 'fifo' | 'lifo' | 'average_cost' = 'average_cost') => {
    const { data } = await api.get('/admin/inventory/valuation', {
      params: { method },
    });
    return data;
  },

  /**
   * Generate barcode for product
   */
  generateBarcode: async (productId: string, variantId?: string) => {
    const { data } = await api.post('/admin/inventory/generate-barcode', {
      productId,
      variantId,
    });
    return data;
  },

  /**
   * Search inventory by barcode/SKU
   */
  searchInventory: async (query: string) => {
    const { data } = await api.get('/admin/inventory/search', {
      params: { query },
    });
    return data;
  },
};

export default inventoryManagementAPI;