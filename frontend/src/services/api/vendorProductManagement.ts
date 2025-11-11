/**
 * Vendor Product Management API Services
 * Complete product catalog management for vendors
 */
import { api } from './client';

export interface VendorProduct {
  id: string;
  vendorId: string;
  sku: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: {
    id: string;
    name: string;
    path: string[];
  };
  brand?: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    attributes: Record<string, string>;
    price: {
      regular: number;
      sale?: number;
      cost: number;
      margin: number;
    };
    inventory: {
      quantity: number;
      reserved: number;
      available: number;
      minStock: number;
      maxStock: number;
      restockLevel: number;
    };
    dimensions?: {
      weight: number;
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  }>;
  pricing: {
    basePrice: number;
    salePrice?: number;
    costPrice: number;
    marginPercent: number;
    currency: string;
    priceRules: Array<{
      id: string;
      type: 'bulk' | 'tier' | 'seasonal';
      conditions: Record<string, any>;
      discount: number;
      active: boolean;
    }>;
  };
  inventory: {
    trackQuantity: boolean;
    allowBackorder: boolean;
    stockNotifications: boolean;
    lowStockThreshold: number;
  };
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
    slug: string;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    shippingClass?: string;
    freeShipping: boolean;
    separateShipping: boolean;
  };
  attributes: Array<{
    name: string;
    value: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
    visible: boolean;
    required: boolean;
  }>;
  compliance: {
    certifications: string[];
    restrictions: string[];
    warnings: string[];
    ageRestriction?: number;
  };
  analytics: {
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
    rating: number;
    reviewCount: number;
  };
  status: 'draft' | 'pending' | 'active' | 'inactive' | 'rejected';
  visibility: 'public' | 'hidden' | 'password_protected';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brand?: string;
  tags: string[];
  variants: Array<{
    sku: string;
    name?: string;
    attributes: Record<string, string>;
    price: {
      regular: number;
      sale?: number;
      cost: number;
    };
    inventory: {
      quantity: number;
      minStock?: number;
      maxStock?: number;
    };
    dimensions?: {
      weight: number;
      length: number;
      width: number;
      height: number;
    };
  }>;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords: string[];
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping?: boolean;
  };
  attributes?: Array<{
    name: string;
    value: string;
    type: string;
  }>;
  status?: 'draft' | 'active';
}

export interface BulkAction {
  action: 'activate' | 'deactivate' | 'delete' | 'update_price' | 'update_inventory' | 'update_category';
  productIds: string[];
  data?: Record<string, any>;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  status?: VendorProduct['status'];
  priceRange?: { min: number; max: number };
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  dateRange?: { from: string; to: string };
  tags?: string[];
  sortBy?: 'name' | 'created_at' | 'price' | 'sales' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryUpdate {
  productId: string;
  variantId?: string;
  quantity?: number;
  operation: 'set' | 'add' | 'subtract';
  reason?: string;
  note?: string;
}

export interface PriceUpdate {
  productId: string;
  variantId?: string;
  regularPrice?: number;
  salePrice?: number;
  costPrice?: number;
  effectiveDate?: string;
}

export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    options?: string[];
  }>;
  createdAt: string;
}

export const vendorProductManagementAPI = {
  /**
   * Get vendor products with filtering and pagination
   */
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    filters: ProductFilter = {}
  ) => {
    const { data } = await api.get('/vendor/products', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get single product details
   */
  getProduct: async (productId: string): Promise<VendorProduct> => {
    const { data } = await api.get(`/vendor/products/${productId}`);
    return data;
  },

  /**
   * Create new product
   */
  createProduct: async (productData: ProductCreateRequest): Promise<VendorProduct> => {
    const { data } = await api.post('/vendor/products', productData);
    return data;
  },

  /**
   * Update product
   */
  updateProduct: async (
    productId: string,
    updates: Partial<VendorProduct>
  ): Promise<VendorProduct> => {
    const { data } = await api.put(`/vendor/products/${productId}`, updates);
    return data;
  },

  /**
   * Delete product
   */
  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/vendor/products/${productId}`);
  },

  /**
   * Duplicate product
   */
  duplicateProduct: async (productId: string, newName: string): Promise<VendorProduct> => {
    const { data } = await api.post(`/vendor/products/${productId}/duplicate`, {
      name: newName,
    });
    return data;
  },

  /**
   * Bulk actions on products
   */
  bulkAction: async (action: BulkAction) => {
    const { data } = await api.post('/vendor/products/bulk', action);
    return data;
  },

  /**
   * Upload product images
   */
  uploadImages: async (productId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    
    const { data } = await api.post(`/vendor/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Reorder product images
   */
  reorderImages: async (productId: string, imageOrders: Array<{ id: string; order: number }>) => {
    const { data } = await api.put(`/vendor/products/${productId}/images/reorder`, {
      orders: imageOrders,
    });
    return data;
  },

  /**
   * Delete product image
   */
  deleteImage: async (productId: string, imageId: string): Promise<void> => {
    await api.delete(`/vendor/products/${productId}/images/${imageId}`);
  },

  /**
   * Update inventory
   */
  updateInventory: async (updates: InventoryUpdate[]) => {
    const { data } = await api.put('/vendor/products/inventory', { updates });
    return data;
  },

  /**
   * Get inventory levels
   */
  getInventoryLevels: async (
    filters: {
      status?: 'in_stock' | 'low_stock' | 'out_of_stock';
      search?: string;
    } = {}
  ) => {
    const { data } = await api.get('/vendor/products/inventory', {
      params: filters,
    });
    return data;
  },

  /**
   * Update prices
   */
  updatePrices: async (updates: PriceUpdate[]) => {
    const { data } = await api.put('/vendor/products/pricing', { updates });
    return data;
  },

  /**
   * Get pricing rules
   */
  getPricingRules: async (productId?: string) => {
    const { data } = await api.get('/vendor/products/pricing-rules', {
      params: { productId },
    });
    return data;
  },

  /**
   * Create pricing rule
   */
  createPricingRule: async (rule: {
    name: string;
    type: 'bulk' | 'tier' | 'seasonal';
    conditions: Record<string, any>;
    discount: number;
    productIds?: string[];
    categoryIds?: string[];
    startDate?: string;
    endDate?: string;
  }) => {
    const { data } = await api.post('/vendor/products/pricing-rules', rule);
    return data;
  },

  /**
   * Update pricing rule
   */
  updatePricingRule: async (ruleId: string, updates: Record<string, any>) => {
    const { data } = await api.put(`/vendor/products/pricing-rules/${ruleId}`, updates);
    return data;
  },

  /**
   * Delete pricing rule
   */
  deletePricingRule: async (ruleId: string): Promise<void> => {
    await api.delete(`/vendor/products/pricing-rules/${ruleId}`);
  },

  /**
   * Get product categories
   */
  getCategories: async () => {
    const { data } = await api.get('/vendor/products/categories');
    return data;
  },

  /**
   * Get product attributes
   */
  getAttributes: async (categoryId?: string) => {
    const { data } = await api.get('/vendor/products/attributes', {
      params: { categoryId },
    });
    return data;
  },

  /**
   * Create custom attribute
   */
  createAttribute: async (attribute: {
    name: string;
    type: string;
    options?: string[];
    categoryIds?: string[];
    required?: boolean;
  }) => {
    const { data } = await api.post('/vendor/products/attributes', attribute);
    return data;
  },

  /**
   * Get product variants
   */
  getVariants: async (productId: string) => {
    const { data } = await api.get(`/vendor/products/${productId}/variants`);
    return data;
  },

  /**
   * Create product variant
   */
  createVariant: async (productId: string, variant: {
    sku: string;
    name?: string;
    attributes: Record<string, string>;
    price: {
      regular: number;
      sale?: number;
      cost: number;
    };
    inventory: {
      quantity: number;
      minStock?: number;
    };
  }) => {
    const { data } = await api.post(`/vendor/products/${productId}/variants`, variant);
    return data;
  },

  /**
   * Update product variant
   */
  updateVariant: async (
    productId: string,
    variantId: string,
    updates: Record<string, any>
  ) => {
    const { data } = await api.put(
      `/vendor/products/${productId}/variants/${variantId}`,
      updates
    );
    return data;
  },

  /**
   * Delete product variant
   */
  deleteVariant: async (productId: string, variantId: string): Promise<void> => {
    await api.delete(`/vendor/products/${productId}/variants/${variantId}`);
  },

  /**
   * Get product templates
   */
  getTemplates: async (): Promise<ProductTemplate[]> => {
    const { data } = await api.get('/vendor/products/templates');
    return data;
  },

  /**
   * Create product template
   */
  createTemplate: async (template: Omit<ProductTemplate, 'id' | 'createdAt'>): Promise<ProductTemplate> => {
    const { data } = await api.post('/vendor/products/templates', template);
    return data;
  },

  /**
   * Create product from template
   */
  createFromTemplate: async (templateId: string, productData: Record<string, any>): Promise<VendorProduct> => {
    const { data } = await api.post(`/vendor/products/templates/${templateId}/create`, productData);
    return data;
  },

  /**
   * Import products from CSV/Excel
   */
  importProducts: async (file: File, options: {
    updateExisting?: boolean;
    skipErrors?: boolean;
    dryRun?: boolean;
  }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const { data } = await api.post('/vendor/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Export products to CSV/Excel
   */
  exportProducts: async (
    format: 'csv' | 'xlsx',
    filters: ProductFilter = {},
    fields?: string[]
  ) => {
    const { data } = await api.get('/vendor/products/export', {
      params: { format, ...filters, fields: fields?.join(',') },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get product analytics
   */
  getProductAnalytics: async (
    productId?: string,
    timeRange?: { from: string; to: string }
  ) => {
    const { data } = await api.get('/vendor/products/analytics', {
      params: { productId, ...timeRange },
    });
    return data;
  },

  /**
   * Get SEO suggestions
   */
  getSEOSuggestions: async (productId: string) => {
    const { data } = await api.get(`/vendor/products/${productId}/seo-suggestions`);
    return data;
  },

  /**
   * Optimize product listing
   */
  optimizeListing: async (productId: string, optimizations: {
    title?: boolean;
    description?: boolean;
    keywords?: boolean;
    images?: boolean;
    pricing?: boolean;
  }) => {
    const { data } = await api.post(`/vendor/products/${productId}/optimize`, optimizations);
    return data;
  },

  /**
   * Get product recommendations
   */
  getRecommendations: async (type: 'related' | 'upsell' | 'cross_sell', productId: string) => {
    const { data } = await api.get(`/vendor/products/${productId}/recommendations`, {
      params: { type },
    });
    return data;
  },

  /**
   * Set product recommendations
   */
  setRecommendations: async (
    productId: string,
    type: 'related' | 'upsell' | 'cross_sell',
    recommendedProductIds: string[]
  ) => {
    const { data } = await api.put(`/vendor/products/${productId}/recommendations`, {
      type,
      productIds: recommendedProductIds,
    });
    return data;
  },

  /**
   * Check SKU availability
   */
  checkSKUAvailability: async (sku: string): Promise<{ available: boolean; suggestions?: string[] }> => {
    const { data } = await api.get('/vendor/products/check-sku', {
      params: { sku },
    });
    return data;
  },

  /**
   * Generate SKU
   */
  generateSKU: async (pattern?: string): Promise<{ sku: string }> => {
    const { data } = await api.post('/vendor/products/generate-sku', { pattern });
    return data;
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: async () => {
    const { data } = await api.get('/vendor/products/low-stock-alerts');
    return data;
  },

  /**
   * Set restock alerts
   */
  setRestockAlert: async (productId: string, threshold: number, enabled: boolean) => {
    const { data } = await api.put(`/vendor/products/${productId}/restock-alert`, {
      threshold,
      enabled,
    });
    return data;
  },
};

export default vendorProductManagementAPI;