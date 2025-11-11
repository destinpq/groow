/**
 * Admin Product Management API Services
 * Comprehensive product management functionality for administrators
 */
import { api } from './client';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  status: 'draft' | 'published' | 'archived' | 'out_of_stock';
  type: 'simple' | 'variable' | 'digital' | 'subscription' | 'bundle';
  visibility: 'visible' | 'hidden' | 'search_only' | 'catalog_only';
  featured: boolean;
  virtual: boolean;
  downloadable: boolean;
  categories: string[];
  tags: string[];
  brand?: string;
  vendor?: {
    id: string;
    name: string;
  };
  pricing: {
    regular: number;
    sale?: number;
    saleStart?: string;
    saleEnd?: string;
    cost?: number;
  };
  inventory: {
    manageStock: boolean;
    stockQuantity: number;
    stockStatus: 'in_stock' | 'out_of_stock' | 'on_backorder';
    lowStockThreshold: number;
    allowBackorders: boolean;
    trackQuantity: boolean;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    shippingClass?: string;
    requiresShipping: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    featured: boolean;
  }>;
  variations?: ProductVariation[];
  attributes?: ProductAttribute[];
  upsells?: string[];
  crossSells?: string[];
  bundleProducts?: Array<{
    productId: string;
    quantity: number;
  }>;
  downloadFiles?: Array<{
    id: string;
    name: string;
    file: string;
    downloadLimit?: number;
    downloadExpiry?: number;
  }>;
  reviews: {
    enabled: boolean;
    averageRating: number;
    reviewCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  id: string;
  sku: string;
  status: 'enabled' | 'disabled';
  pricing: {
    regular: number;
    sale?: number;
  };
  inventory: {
    stockQuantity: number;
    stockStatus: string;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
  attributes: Record<string, string>;
  image?: string;
  downloadFiles?: Array<{
    id: string;
    name: string;
    file: string;
  }>;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number';
  options?: string[];
  required: boolean;
  variation: boolean;
  visible: boolean;
  global: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  image?: string;
  displayType: 'default' | 'products' | 'subcategories' | 'both';
  productCount: number;
  children?: ProductCategory[];
}

export interface BulkProductAction {
  productIds: string[];
  action: 'update_status' | 'update_category' | 'update_tags' | 'update_pricing' | 'export' | 'delete';
  data?: any;
}

export interface ProductFilter {
  status?: AdminProduct['status'];
  type?: AdminProduct['type'];
  categories?: string[];
  brands?: string[];
  vendor?: string;
  featured?: boolean;
  stockStatus?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
}

export const adminProductManagementAPI = {
  // Product Management
  /**
   * Get products with filtering and pagination
   */
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    filters: ProductFilter = {}
  ) => {
    const { data } = await api.get('/admin/products', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get product by ID
   */
  getProduct: async (productId: string): Promise<AdminProduct> => {
    const { data } = await api.get(`/admin/products/${productId}`);
    return data;
  },

  /**
   * Create product
   */
  createProduct: async (productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminProduct> => {
    const { data } = await api.post('/admin/products', productData);
    return data;
  },

  /**
   * Update product
   */
  updateProduct: async (productId: string, updates: Partial<AdminProduct>): Promise<AdminProduct> => {
    const { data } = await api.put(`/admin/products/${productId}`, updates);
    return data;
  },

  /**
   * Delete product
   */
  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/admin/products/${productId}`);
  },

  /**
   * Duplicate product
   */
  duplicateProduct: async (productId: string, newName?: string): Promise<AdminProduct> => {
    const { data } = await api.post(`/admin/products/${productId}/duplicate`, {
      newName,
    });
    return data;
  },

  /**
   * Bulk product actions
   */
  bulkProductAction: async (action: BulkProductAction) => {
    const { data } = await api.post('/admin/products/bulk', action);
    return data;
  },

  // Product Variations
  /**
   * Get product variations
   */
  getProductVariations: async (productId: string): Promise<ProductVariation[]> => {
    const { data } = await api.get(`/admin/products/${productId}/variations`);
    return data;
  },

  /**
   * Create product variation
   */
  createProductVariation: async (
    productId: string,
    variationData: Omit<ProductVariation, 'id'>
  ): Promise<ProductVariation> => {
    const { data } = await api.post(`/admin/products/${productId}/variations`, variationData);
    return data;
  },

  /**
   * Update product variation
   */
  updateProductVariation: async (
    productId: string,
    variationId: string,
    updates: Partial<ProductVariation>
  ): Promise<ProductVariation> => {
    const { data } = await api.put(`/admin/products/${productId}/variations/${variationId}`, updates);
    return data;
  },

  /**
   * Delete product variation
   */
  deleteProductVariation: async (productId: string, variationId: string): Promise<void> => {
    await api.delete(`/admin/products/${productId}/variations/${variationId}`);
  },

  /**
   * Generate variations from attributes
   */
  generateVariations: async (productId: string, attributes: Array<{ name: string; values: string[] }>) => {
    const { data } = await api.post(`/admin/products/${productId}/variations/generate`, {
      attributes,
    });
    return data;
  },

  // Categories Management
  /**
   * Get categories
   */
  getCategories: async (
    parent?: string,
    includeChildren: boolean = true
  ): Promise<ProductCategory[]> => {
    const { data } = await api.get('/admin/products/categories', {
      params: { parent, includeChildren },
    });
    return data;
  },

  /**
   * Create category
   */
  createCategory: async (categoryData: Omit<ProductCategory, 'id' | 'productCount' | 'children'>): Promise<ProductCategory> => {
    const { data } = await api.post('/admin/products/categories', categoryData);
    return data;
  },

  /**
   * Update category
   */
  updateCategory: async (categoryId: string, updates: Partial<ProductCategory>): Promise<ProductCategory> => {
    const { data } = await api.put(`/admin/products/categories/${categoryId}`, updates);
    return data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (categoryId: string, reassignTo?: string): Promise<void> => {
    await api.delete(`/admin/products/categories/${categoryId}`, {
      data: { reassignTo },
    });
  },

  /**
   * Reorder categories
   */
  reorderCategories: async (categories: Array<{ id: string; parent?: string; order: number }>) => {
    const { data } = await api.put('/admin/products/categories/reorder', { categories });
    return data;
  },

  // Attributes Management
  /**
   * Get product attributes
   */
  getAttributes: async (): Promise<ProductAttribute[]> => {
    const { data } = await api.get('/admin/products/attributes');
    return data;
  },

  /**
   * Create attribute
   */
  createAttribute: async (attributeData: Omit<ProductAttribute, 'id'>): Promise<ProductAttribute> => {
    const { data } = await api.post('/admin/products/attributes', attributeData);
    return data;
  },

  /**
   * Update attribute
   */
  updateAttribute: async (attributeId: string, updates: Partial<ProductAttribute>): Promise<ProductAttribute> => {
    const { data } = await api.put(`/admin/products/attributes/${attributeId}`, updates);
    return data;
  },

  /**
   * Delete attribute
   */
  deleteAttribute: async (attributeId: string): Promise<void> => {
    await api.delete(`/admin/products/attributes/${attributeId}`);
  },

  // Import/Export
  /**
   * Import products from CSV/Excel
   */
  importProducts: async (
    file: File,
    options: {
      updateExisting?: boolean;
      skipDuplicates?: boolean;
      createCategories?: boolean;
      mapping?: Record<string, string>;
    } = {}
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const { data } = await api.post('/admin/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get import status
   */
  getImportStatus: async (importId: string) => {
    const { data } = await api.get(`/admin/products/import/${importId}/status`);
    return data;
  },

  /**
   * Export products
   */
  exportProducts: async (
    format: 'csv' | 'xlsx',
    filters: ProductFilter = {},
    fields?: string[]
  ) => {
    const { data } = await api.post('/admin/products/export', {
      format,
      filters,
      fields,
    }, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Get export templates
   */
  getExportTemplates: async () => {
    const { data } = await api.get('/admin/products/export/templates');
    return data;
  },

  // Analytics and Reports
  /**
   * Get product analytics
   */
  getProductAnalytics: async (
    productId?: string,
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ) => {
    const { data } = await api.get('/admin/products/analytics', {
      params: { productId, period },
    });
    return data;
  },

  /**
   * Get low stock products
   */
  getLowStockProducts: async (threshold?: number) => {
    const { data } = await api.get('/admin/products/low-stock', {
      params: { threshold },
    });
    return data;
  },

  /**
   * Get product performance report
   */
  getProductPerformanceReport: async (
    period: { from: string; to: string },
    filters: ProductFilter = {}
  ) => {
    const { data } = await api.post('/admin/products/reports/performance', {
      period,
      filters,
    });
    return data;
  },

  // Advanced Features
  /**
   * Generate product SEO
   */
  generateProductSEO: async (productId: string) => {
    const { data } = await api.post(`/admin/products/${productId}/seo/generate`);
    return data;
  },

  /**
   * Optimize product images
   */
  optimizeProductImages: async (productId: string) => {
    const { data } = await api.post(`/admin/products/${productId}/images/optimize`);
    return data;
  },

  /**
   * Check product URLs
   */
  checkProductURLs: async (productIds: string[]) => {
    const { data } = await api.post('/admin/products/urls/check', { productIds });
    return data;
  },

  /**
   * Sync inventory across variations
   */
  syncVariationInventory: async (productId: string) => {
    const { data } = await api.post(`/admin/products/${productId}/variations/sync-inventory`);
    return data;
  },

  /**
   * Update product pricing
   */
  updateProductPricing: async (
    updates: Array<{
      productId: string;
      variationId?: string;
      pricing: { regular: number; sale?: number };
    }>
  ) => {
    const { data } = await api.put('/admin/products/pricing', { updates });
    return data;
  },

  /**
   * Get product suggestions
   */
  getProductSuggestions: async (query: string, limit: number = 10) => {
    const { data } = await api.get('/admin/products/suggestions', {
      params: { query, limit },
    });
    return data;
  },
};

export default adminProductManagementAPI;