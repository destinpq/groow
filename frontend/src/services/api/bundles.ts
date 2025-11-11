import api from './client';

// API Response wrappers for standardized POJO integration
interface BundleAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedBundleResponse<T> {
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

// ========================================
// Product Bundle Types
// ========================================

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  slug: string;
  bundleType: 'fixed' | 'dynamic' | 'mix_and_match' | 'tiered';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  visibility: 'public' | 'private' | 'members_only';
  
  // Pricing Configuration
  pricingStrategy: 'fixed_price' | 'percentage_discount' | 'fixed_discount' | 'dynamic_pricing';
  bundlePrice?: number;
  discountPercentage?: number;
  discountAmount?: number;
  originalPrice: number;
  savings: number;
  savingsPercentage: number;
  
  // Bundle Products
  products: BundleProduct[];
  minProducts?: number;
  maxProducts?: number;
  requiredProducts: string[]; // Product IDs that must be included
  
  // Inventory Management
  inventory: BundleInventory;
  trackInventory: boolean;
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock' | 'pre_order';
  
  // Marketing & Display
  images: string[];
  featuredImage: string;
  tags: string[];
  categories: string[];
  seoTitle?: string;
  seoDescription?: string;
  
  // Promotion Settings
  isPromoted: boolean;
  promotionStartDate?: string;
  promotionEndDate?: string;
  promotionPriority: number;
  
  // Analytics
  analytics: BundleAnalytics;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface BundleProduct {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productPrice: number;
  bundlePrice: number;
  discount: number;
  discountPercentage: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  isRequired: boolean;
  isVariable: boolean; // For mix-and-match bundles
  position: number;
  productImage: string;
  productCategory: string;
  availability: 'available' | 'unavailable' | 'limited';
  stockQuantity: number;
}

export interface BundleInventory {
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  soldQuantity: number;
  lowStockThreshold: number;
  autoRestock: boolean;
  restockLevel: number;
  backorderAllowed: boolean;
  preorderAllowed: boolean;
  estimatedRestockDate?: string;
}

export interface BundleAnalytics {
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  returnRate: number;
  customerSatisfaction: number;
  popularityScore: number;
  profitMargin: number;
  clickThroughRate: number;
  addToCartRate: number;
  abandonmentRate: number;
  crossSellSuccess: number;
  upsellSuccess: number;
}

export interface BundleTemplate {
  id: string;
  name: string;
  description: string;
  bundleType: ProductBundle['bundleType'];
  pricingStrategy: ProductBundle['pricingStrategy'];
  defaultDiscount: number;
  suggestedCategories: string[];
  minProducts: number;
  maxProducts: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface BundlePromotion {
  id: string;
  bundleId: string;
  title: string;
  description: string;
  promoType: 'flash_sale' | 'seasonal' | 'clearance' | 'cross_sell' | 'upsell';
  discountType: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetAudience: string[];
  conditions: PromotionCondition[];
  usage: {
    totalUses: number;
    maxUses?: number;
    usesPerCustomer?: number;
  };
}

export interface PromotionCondition {
  type: 'min_order_value' | 'customer_segment' | 'product_category' | 'quantity';
  operator: 'equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface BundleStats {
  totalBundles: number;
  activeBundles: number;
  draftBundles: number;
  archivedBundles: number;
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  topPerformingBundle: ProductBundle;
  recentActivity: BundleActivity[];
  conversionTrends: { date: string; rate: number }[];
}

export interface BundleActivity {
  id: string;
  type: 'bundle_created' | 'bundle_sold' | 'bundle_viewed' | 'promotion_started' | 'stock_low';
  bundleId: string;
  bundleName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BundleFilters {
  status?: ProductBundle['status'];
  bundleType?: ProductBundle['bundleType'];
  category?: string;
  priceRange?: { min: number; max: number };
  stockStatus?: ProductBundle['stockStatus'];
  isPromoted?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: 'name' | 'price' | 'sales' | 'revenue' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreateBundleRequest {
  name: string;
  description: string;
  bundleType: ProductBundle['bundleType'];
  pricingStrategy: ProductBundle['pricingStrategy'];
  bundlePrice?: number;
  discountPercentage?: number;
  discountAmount?: number;
  products: {
    productId: string;
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
    isRequired?: boolean;
    bundlePrice?: number;
  }[];
  minProducts?: number;
  maxProducts?: number;
  trackInventory?: boolean;
  initialStock?: number;
  images?: string[];
  tags?: string[];
  categories?: string[];
  visibility?: ProductBundle['visibility'];
  promotionSettings?: {
    isPromoted: boolean;
    startDate?: string;
    endDate?: string;
    priority?: number;
  };
}

export interface UpdateBundleRequest {
  name?: string;
  description?: string;
  bundlePrice?: number;
  discountPercentage?: number;
  discountAmount?: number;
  status?: ProductBundle['status'];
  visibility?: ProductBundle['visibility'];
  images?: string[];
  tags?: string[];
  categories?: string[];
  promotionSettings?: {
    isPromoted?: boolean;
    startDate?: string;
    endDate?: string;
    priority?: number;
  };
}

// ========================================
// Product Bundles API Service
// ========================================

export const bundlesAPI = {
  // ========================================
  // Bundle CRUD Operations
  // ========================================
  
  getAll: async (filters?: BundleFilters): Promise<{
    bundles: ProductBundle[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get<PaginatedBundleResponse<ProductBundle>>('/bundles', {
      params: filters,
    });
    return {
      bundles: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      limit: filters?.limit || 20
    };
  },

  getById: async (id: string): Promise<ProductBundle> => {
    const response = await api.get<BundleAPIResponse<ProductBundle>>(`/bundles/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<ProductBundle> => {
    const response = await api.get<BundleAPIResponse<ProductBundle>>(`/bundles/slug/${slug}`);
    return response.data.data;
  },

  create: async (bundleData: CreateBundleRequest): Promise<ProductBundle> => {
    const response = await api.post<BundleAPIResponse<ProductBundle>>('/bundles', bundleData);
    return response.data.data;
  },

  update: async (id: string, updateData: UpdateBundleRequest): Promise<ProductBundle> => {
    const response = await api.put<BundleAPIResponse<ProductBundle>>(`/bundles/${id}`, updateData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bundles/${id}`);
  },

  // ========================================
  // Bundle Status Management
  // ========================================

  activate: async (id: string): Promise<ProductBundle> => {
    const response = await api.post<BundleAPIResponse<ProductBundle>>(`/bundles/${id}/activate`);
    return response.data.data;
  },

  deactivate: async (id: string): Promise<ProductBundle> => {
    const response = await api.post<BundleAPIResponse<ProductBundle>>(`/bundles/${id}/deactivate`);
    return response.data.data;
  },

  archive: async (id: string): Promise<ProductBundle> => {
    const response = await api.post<BundleAPIResponse<ProductBundle>>(`/bundles/${id}/archive`);
    return response.data.data;
  },

  duplicate: async (id: string, modifications?: Partial<CreateBundleRequest>): Promise<ProductBundle> => {
    const response = await api.post<BundleAPIResponse<ProductBundle>>(`/bundles/${id}/duplicate`, modifications);
    return response.data.data;
  },

  // ========================================
  // Bundle Products Management
  // ========================================

  addProduct: async (bundleId: string, productData: {
    productId: string;
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
    isRequired?: boolean;
    bundlePrice?: number;
  }): Promise<ProductBundle> => {
    const response = await api.post(`/bundles/${bundleId}/products`, productData);
    return response.data;
  },

  updateProduct: async (
    bundleId: string, 
    productId: string, 
    updateData: {
      quantity?: number;
      minQuantity?: number;
      maxQuantity?: number;
      isRequired?: boolean;
      bundlePrice?: number;
      position?: number;
    }
  ): Promise<ProductBundle> => {
    const response = await api.put(`/bundles/${bundleId}/products/${productId}`, updateData);
    return response.data;
  },

  removeProduct: async (bundleId: string, productId: string): Promise<ProductBundle> => {
    const response = await api.delete(`/bundles/${bundleId}/products/${productId}`);
    return response.data;
  },

  reorderProducts: async (bundleId: string, productOrder: { productId: string; position: number }[]): Promise<ProductBundle> => {
    const response = await api.put(`/bundles/${bundleId}/products/reorder`, { productOrder });
    return response.data;
  },

  // ========================================
  // Pricing and Discounts
  // ========================================

  updatePricing: async (bundleId: string, pricingData: {
    pricingStrategy: ProductBundle['pricingStrategy'];
    bundlePrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
  }): Promise<ProductBundle> => {
    const response = await api.put(`/bundles/${bundleId}/pricing`, pricingData);
    return response.data;
  },

  calculatePrice: async (bundleId: string, configuration?: {
    products: { productId: string; quantity: number }[];
    applyCoupons?: string[];
    customerSegment?: string;
  }): Promise<{
    originalPrice: number;
    bundlePrice: number;
    totalDiscount: number;
    savings: number;
    savingsPercentage: number;
    breakdown: { productId: string; originalPrice: number; bundlePrice: number }[];
  }> => {
    const response = await api.post(`/bundles/${bundleId}/calculate-price`, configuration);
    return response.data;
  },

  // ========================================
  // Inventory Management
  // ========================================

  updateInventory: async (bundleId: string, inventoryData: {
    totalStock?: number;
    lowStockThreshold?: number;
    autoRestock?: boolean;
    restockLevel?: number;
    backorderAllowed?: boolean;
    preorderAllowed?: boolean;
  }): Promise<ProductBundle> => {
    const response = await api.put(`/bundles/${bundleId}/inventory`, inventoryData);
    return response.data;
  },

  adjustStock: async (bundleId: string, adjustment: {
    quantity: number;
    reason: string;
    notes?: string;
  }): Promise<ProductBundle> => {
    const response = await api.post(`/bundles/${bundleId}/inventory/adjust`, adjustment);
    return response.data;
  },

  checkAvailability: async (bundleId: string, requestedQuantity: number = 1): Promise<{
    available: boolean;
    availableQuantity: number;
    constrainingProducts: string[];
    estimatedRestockDate?: string;
  }> => {
    const response = await api.get(`/bundles/${bundleId}/availability`, {
      params: { quantity: requestedQuantity },
    });
    return response.data;
  },

  // ========================================
  // Templates Management
  // ========================================

  getTemplates: async (): Promise<BundleTemplate[]> => {
    const response = await api.get('/bundles/templates');
    return response.data;
  },

  createTemplate: async (templateData: Omit<BundleTemplate, 'id' | 'usageCount' | 'createdAt'>): Promise<BundleTemplate> => {
    const response = await api.post('/bundles/templates', templateData);
    return response.data;
  },

  updateTemplate: async (id: string, updateData: Partial<BundleTemplate>): Promise<BundleTemplate> => {
    const response = await api.put(`/bundles/templates/${id}`, updateData);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/bundles/templates/${id}`);
  },

  applyTemplate: async (templateId: string, bundleData: CreateBundleRequest): Promise<ProductBundle> => {
    const response = await api.post(`/bundles/templates/${templateId}/apply`, bundleData);
    return response.data;
  },

  // ========================================
  // Promotions Management
  // ========================================

  getPromotions: async (bundleId?: string): Promise<BundlePromotion[]> => {
    const response = await api.get('/bundles/promotions', {
      params: bundleId ? { bundleId } : undefined,
    });
    return response.data;
  },

  createPromotion: async (promotionData: Omit<BundlePromotion, 'id' | 'usage'>): Promise<BundlePromotion> => {
    const response = await api.post('/bundles/promotions', promotionData);
    return response.data;
  },

  updatePromotion: async (id: string, updateData: Partial<BundlePromotion>): Promise<BundlePromotion> => {
    const response = await api.put(`/bundles/promotions/${id}`, updateData);
    return response.data;
  },

  deletePromotion: async (id: string): Promise<void> => {
    await api.delete(`/bundles/promotions/${id}`);
  },

  activatePromotion: async (id: string): Promise<BundlePromotion> => {
    const response = await api.post(`/bundles/promotions/${id}/activate`);
    return response.data;
  },

  deactivatePromotion: async (id: string): Promise<BundlePromotion> => {
    const response = await api.post(`/bundles/promotions/${id}/deactivate`);
    return response.data;
  },

  // ========================================
  // Analytics and Statistics
  // ========================================

  getStats: async (dateRange?: { start: string; end: string }): Promise<BundleStats> => {
    const response = await api.get('/bundles/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getAnalytics: async (bundleId: string, dateRange?: { start: string; end: string }): Promise<BundleAnalytics & {
    performanceMetrics: { date: string; sales: number; revenue: number; views: number }[];
    topCombinations: { products: string[]; sales: number; revenue: number }[];
    customerSegments: { segment: string; purchases: number; revenue: number }[];
  }> => {
    const response = await api.get(`/bundles/${bundleId}/analytics`, {
      params: dateRange,
    });
    return response.data;
  },

  getPerformanceReport: async (bundleId: string): Promise<{
    summary: BundleAnalytics;
    trends: { period: string; sales: number; revenue: number; conversion: number }[];
    comparisons: { metric: string; current: number; previous: number; change: number }[];
    recommendations: string[];
  }> => {
    const response = await api.get(`/bundles/${bundleId}/performance`);
    return response.data;
  },

  getActivity: async (limit: number = 20): Promise<BundleActivity[]> => {
    const response = await api.get('/bundles/activity', {
      params: { limit },
    });
    return response.data;
  },

  // ========================================
  // Recommendations and Suggestions
  // ========================================

  getRecommendations: async (type: 'cross_sell' | 'upsell' | 'bundle_creation' | 'pricing_optimization'): Promise<{
    type: string;
    recommendations: any[];
    confidence: number;
    expectedImpact: string;
  }[]> => {
    const response = await api.get('/bundles/recommendations', {
      params: { type },
    });
    return response.data;
  },

  getSuggestedProducts: async (bundleId: string, criteria?: {
    category?: string;
    priceRange?: { min: number; max: number };
    complementary?: boolean;
  }): Promise<{
    productId: string;
    productName: string;
    compatibility: number;
    expectedSales: number;
    reason: string;
  }[]> => {
    const response = await api.get(`/bundles/${bundleId}/suggestions`, {
      params: criteria,
    });
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================

  bulkActivate: async (bundleIds: string[]): Promise<{ activated: number; failed: string[] }> => {
    const response = await api.post('/bundles/bulk/activate', { bundleIds });
    return response.data;
  },

  bulkDeactivate: async (bundleIds: string[]): Promise<{ deactivated: number; failed: string[] }> => {
    const response = await api.post('/bundles/bulk/deactivate', { bundleIds });
    return response.data;
  },

  bulkArchive: async (bundleIds: string[]): Promise<{ archived: number; failed: string[] }> => {
    const response = await api.post('/bundles/bulk/archive', { bundleIds });
    return response.data;
  },

  bulkDelete: async (bundleIds: string[]): Promise<{ deleted: number; failed: string[] }> => {
    const response = await api.post('/bundles/bulk/delete', { bundleIds });
    return response.data;
  },

  bulkUpdatePricing: async (updates: { bundleId: string; pricingData: any }[]): Promise<{ updated: number; failed: string[] }> => {
    const response = await api.post('/bundles/bulk/pricing', { updates });
    return response.data;
  },

  // ========================================
  // Search and Discovery
  // ========================================

  search: async (query: string, filters?: BundleFilters): Promise<ProductBundle[]> => {
    const response = await api.get('/bundles/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  getSuggestions: async (partial: string): Promise<string[]> => {
    const response = await api.get('/bundles/suggestions', {
      params: { partial },
    });
    return response.data;
  },

  // ========================================
  // Export and Import
  // ========================================

  export: async (filters?: BundleFilters, format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> => {
    const response = await api.get('/bundles/export', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response.data;
  },

  import: async (
    file: File,
    options?: { skipValidation?: boolean; updateExisting?: boolean; includeImages?: boolean }
  ): Promise<{ imported: number; errors: any[]; skipped: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/bundles/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ========================================
  // Cross-sell and Upsell
  // ========================================

  getCrossSellBundles: async (productId: string, limit: number = 5): Promise<ProductBundle[]> => {
    const response = await api.get(`/bundles/cross-sell/${productId}`, {
      params: { limit },
    });
    return response.data;
  },

  getUpsellBundles: async (bundleId: string, limit: number = 5): Promise<ProductBundle[]> => {
    const response = await api.get(`/bundles/${bundleId}/upsell`, {
      params: { limit },
    });
    return response.data;
  },

  getRelatedBundles: async (bundleId: string, limit: number = 5): Promise<ProductBundle[]> => {
    const response = await api.get(`/bundles/${bundleId}/related`, {
      params: { limit },
    });
    return response.data;
  },
};

export default bundlesAPI;