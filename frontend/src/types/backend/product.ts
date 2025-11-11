// Backend product types - synchronized with backend entities
import type { ProductStatus } from './enums';

// Product entity structure (from backend/src/modules/product/entities/product.entity.ts)
export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
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
  minOrderQuantity: number;
  images?: string[];
  videoUrl?: string;
  variants?: Array<{
    id: string;
    attributes: { name: string; value: string }[];
    sku: string;
    price: number;
    stock: number;
  }>;
  specifications?: Array<{ key: string; value: string }>;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  viewCount: number;
  salesCount: number;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  isActive: boolean;
  publishedAt?: string;
}

// Category entity structure (from backend/src/modules/product/entities/category.entity.ts)
export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Brand entity structure (from backend/src/modules/product/entities/brand.entity.ts)
export interface Brand {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  sortOrder: number;
}

// Product DTOs (from backend/src/modules/product/dto/product.dto.ts)
export interface CreateProductDto {
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
  variants?: any[];
  specifications?: any[];
  status?: ProductStatus;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface UpdateProductDto {
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

export interface ProductFilterDto {
  categoryId?: string;
  brandId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// Category DTOs (from backend/src/modules/product/dto/category.dto.ts)
export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Brand DTOs
export interface CreateBrandDto {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  sortOrder?: number;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

// Product Review entity (from backend/src/modules/product/entities/product-review.entity.ts)
export interface ProductReview {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  customerId: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
}