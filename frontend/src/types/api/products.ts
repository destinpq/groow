/**
 * Product API Types and POJOs
 * 
 * All product-related request/response types
 */

import { ApiResponse, BaseEntity, PaginatedResponse, BaseFilter, ProductStatus } from './common';

// =================== PRODUCT ENTITIES ===================

export interface Category extends BaseEntity {
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Brand extends BaseEntity {
  name: string;
  description?: string;
  slug: string;
  logo?: string;
  website?: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  slug: string;
  vendorId: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  minOrderQuantity?: number;
  images?: string[];
  videoUrl?: string;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
  views?: number;
  seo?: ProductSEO;
  category?: Category;
  brand?: Brand;
}

// =================== PRODUCT REQUEST TYPES ===================

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  vendorId: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  minOrderQuantity?: number;
  images?: string[];
  videoUrl?: string;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  status?: ProductStatus;
  seo?: ProductSEO;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  shortDescription?: string;
  basePrice?: number;
  salePrice?: number;
  stockQuantity?: number;
  images?: string[];
  status?: ProductStatus;
  isActive?: boolean;
}

export interface ProductFilterRequest extends BaseFilter {
  categoryId?: string;
  brandId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface ProductStatusUpdateRequest {
  status: ProductStatus;
  reason?: string;
}

export interface ProductStockUpdateRequest {
  stockQuantity: number;
  operation: 'set' | 'add' | 'subtract';
  reason?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateBrandRequest {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive?: boolean;
}

// =================== PRODUCT RESPONSE TYPES ===================

export interface ProductResponse extends ApiResponse<Product> {}
export interface ProductListResponse extends ApiResponse<PaginatedResponse<Product>> {}
export interface ProductsResponse extends ApiResponse<Product[]> {}

export interface CategoryResponse extends ApiResponse<Category> {}
export interface CategoryListResponse extends ApiResponse<PaginatedResponse<Category>> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface CategoryHierarchyResponse extends ApiResponse<Category[]> {}

export interface BrandResponse extends ApiResponse<Brand> {}
export interface BrandListResponse extends ApiResponse<PaginatedResponse<Brand>> {}
export interface BrandsResponse extends ApiResponse<Brand[]> {}

// =================== PRODUCT API INTERFACE ===================

export interface ProductAPI {
  // Product CRUD
  // POST /api/v1/products
  createProduct(request: CreateProductRequest): Promise<ProductResponse>;
  
  // GET /api/v1/products
  getProducts(filters?: ProductFilterRequest): Promise<ProductListResponse>;
  
  // GET /api/v1/products/featured
  getFeaturedProducts(limit?: number): Promise<ProductsResponse>;
  
  // GET /api/v1/products/recommended
  getRecommendedProducts(limit?: number): Promise<ProductsResponse>;
  
  // GET /api/v1/products/vendor/:vendorId
  getProductsByVendor(vendorId: string, filters?: ProductFilterRequest): Promise<ProductListResponse>;
  
  // GET /api/v1/products/slug/:slug
  getProductBySlug(slug: string): Promise<ProductResponse>;
  
  // GET /api/v1/products/:id
  getProductById(id: string): Promise<ProductResponse>;
  
  // PATCH /api/v1/products/:id
  updateProduct(id: string, request: UpdateProductRequest): Promise<ProductResponse>;
  
  // PATCH /api/v1/products/:id/status
  updateProductStatus(id: string, request: ProductStatusUpdateRequest): Promise<ProductResponse>;
  
  // PATCH /api/v1/products/:id/stock
  updateProductStock(id: string, request: ProductStockUpdateRequest): Promise<ProductResponse>;
  
  // DELETE /api/v1/products/:id
  deleteProduct(id: string): Promise<ApiResponse>;
  
  // Category endpoints
  // POST /api/v1/categories
  createCategory(request: CreateCategoryRequest): Promise<CategoryResponse>;
  
  // GET /api/v1/categories
  getCategories(filters?: BaseFilter): Promise<CategoryListResponse>;
  
  // GET /api/v1/categories/hierarchy
  getCategoryHierarchy(): Promise<CategoryHierarchyResponse>;
  
  // GET /api/v1/categories/:id/subcategories
  getSubcategories(id: string): Promise<CategoriesResponse>;
  
  // GET /api/v1/categories/slug/:slug
  getCategoryBySlug(slug: string): Promise<CategoryResponse>;
  
  // GET /api/v1/categories/:id
  getCategoryById(id: string): Promise<CategoryResponse>;
  
  // PATCH /api/v1/categories/:id
  updateCategory(id: string, request: UpdateCategoryRequest): Promise<CategoryResponse>;
  
  // DELETE /api/v1/categories/:id
  deleteCategory(id: string): Promise<ApiResponse>;
  
  // Brand endpoints
  // POST /api/v1/brands
  createBrand(request: CreateBrandRequest): Promise<BrandResponse>;
  
  // GET /api/v1/brands
  getBrands(filters?: BaseFilter): Promise<BrandListResponse>;
  
  // GET /api/v1/brands/slug/:slug
  getBrandBySlug(slug: string): Promise<BrandResponse>;
  
  // GET /api/v1/brands/:id
  getBrandById(id: string): Promise<BrandResponse>;
  
  // PATCH /api/v1/brands/:id
  updateBrand(id: string, request: UpdateBrandRequest): Promise<BrandResponse>;
  
  // DELETE /api/v1/brands/:id
  deleteBrand(id: string): Promise<ApiResponse>;
}