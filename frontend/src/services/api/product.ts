import request from '../../utils/request';
import type { AxiosResponse } from 'axios';

// Product Interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: ProductImage[];
  category: Category;
  brand?: Brand;
  tags: string[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  specifications: ProductSpecification[];
  rating: {
    average: number;
    count: number;
  };
  reviews: ProductReview[];
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  downloadUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  displayType: 'text' | 'color' | 'image' | 'dropdown';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: ProductAttribute[];
  images: ProductImage[];
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  group: string;
}

export interface ProductReview {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  attributes?: { [key: string]: string };
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'rating' | 'sales';
  direction: 'asc' | 'desc';
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: ProductSort;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProductFilters;
}

export interface ProductComparison {
  products: Product[];
  attributes: string[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Product API
export const productAPI = {
  // Get products list with filters, search, and pagination
  getProducts: async (params?: ProductSearchParams): Promise<AxiosResponse<ProductListResponse>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.filters?.search) searchParams.append('search', params.filters.search);
    if (params?.filters?.categoryId) searchParams.append('categoryId', params.filters.categoryId);
    if (params?.filters?.brandId) searchParams.append('brandId', params.filters.brandId);
    if (params?.filters?.priceMin) searchParams.append('priceMin', params.filters.priceMin.toString());
    if (params?.filters?.priceMax) searchParams.append('priceMax', params.filters.priceMax.toString());
    if (params?.sort) {
      searchParams.append('sortBy', params.sort.field);
      searchParams.append('sortOrder', params.sort.direction);
    }

    try {
      const response = await request.get(`/products?${searchParams.toString()}`);
      return response;
    } catch (error) {
      // Fallback data for demonstration
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
          shortDescription: 'Premium wireless headphones with noise cancellation',
          sku: 'WH-1000XM5',
          slug: 'premium-wireless-headphones',
          price: 299.99,
          originalPrice: 349.99,
          currency: 'USD',
          discount: 14.3,
          discountType: 'percentage',
          stock: 45,
          minOrderQuantity: 1,
          maxOrderQuantity: 5,
          weight: 0.25,
          dimensions: { length: 20, width: 18, height: 8, unit: 'cm' },
          images: [
            { id: '1', url: '/images/headphones-1.jpg', alt: 'Wireless Headphones Front View', isPrimary: true, sortOrder: 1 },
            { id: '2', url: '/images/headphones-2.jpg', alt: 'Wireless Headphones Side View', isPrimary: false, sortOrder: 2 },
          ],
          category: { id: '1', name: 'Electronics', slug: 'electronics', level: 1, sortOrder: 1, isActive: true, productCount: 150, createdAt: '2024-01-01' },
          brand: { id: '1', name: 'SoundTech', slug: 'soundtech', isActive: true, productCount: 25, createdAt: '2024-01-01' },
          tags: ['wireless', 'noise-canceling', 'premium', 'bluetooth'],
          attributes: [
            { id: '1', name: 'Color', value: 'Black', displayType: 'color' },
            { id: '2', name: 'Connectivity', value: 'Bluetooth 5.0', displayType: 'text' },
          ],
          specifications: [
            { id: '1', name: 'Battery Life', value: '30 hours', group: 'Power' },
            { id: '2', name: 'Driver Size', value: '40mm', group: 'Audio' },
          ],
          rating: { average: 4.8, count: 156 },
          reviews: [],
          isActive: true,
          isFeatured: true,
          isDigital: false,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone integration.',
          shortDescription: 'Smart fitness watch with health monitoring',
          sku: 'FW-SPORT-2024',
          slug: 'smart-fitness-watch',
          price: 199.99,
          currency: 'USD',
          stock: 32,
          minOrderQuantity: 1,
          images: [
            { id: '3', url: '/images/watch-1.jpg', alt: 'Fitness Watch Display', isPrimary: true, sortOrder: 1 },
          ],
          category: { id: '2', name: 'Wearables', slug: 'wearables', level: 2, sortOrder: 2, isActive: true, productCount: 75, createdAt: '2024-01-01' },
          brand: { id: '2', name: 'FitLife', slug: 'fitlife', isActive: true, productCount: 18, createdAt: '2024-01-01' },
          tags: ['fitness', 'smartwatch', 'health', 'gps'],
          attributes: [
            { id: '3', name: 'Band Color', value: 'Blue', displayType: 'color' },
            { id: '4', name: 'Size', value: '42mm', displayType: 'text' },
          ],
          specifications: [
            { id: '3', name: 'Display', value: '1.4" OLED', group: 'Screen' },
            { id: '4', name: 'Water Resistance', value: 'IP68', group: 'Durability' },
          ],
          rating: { average: 4.5, count: 89 },
          reviews: [],
          isActive: true,
          isFeatured: false,
          isDigital: false,
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:20:00Z',
        }
      ];

      return {
        data: {
          data: mockProducts,
          total: mockProducts.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
          filters: params?.filters || {},
        }
      } as AxiosResponse<ProductListResponse>;
    }
  },

  // Get single product by ID or slug
  getProduct: async (id: string): Promise<AxiosResponse<Product>> => {
    try {
      return await request.get(`/products/${id}`);
    } catch (error) {
      // Fallback data
      const mockProduct: Product = {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with advanced noise cancellation technology and superior sound quality. Features premium materials and long battery life.',
        shortDescription: 'Premium wireless headphones with noise cancellation',
        sku: 'WH-1000XM5',
        slug: 'premium-wireless-headphones',
        price: 299.99,
        originalPrice: 349.99,
        currency: 'USD',
        discount: 14.3,
        discountType: 'percentage',
        stock: 45,
        minOrderQuantity: 1,
        maxOrderQuantity: 5,
        weight: 0.25,
        dimensions: { length: 20, width: 18, height: 8, unit: 'cm' },
        images: [
          { id: '1', url: '/images/headphones-1.jpg', alt: 'Wireless Headphones Front View', isPrimary: true, sortOrder: 1 },
          { id: '2', url: '/images/headphones-2.jpg', alt: 'Wireless Headphones Side View', isPrimary: false, sortOrder: 2 },
          { id: '3', url: '/images/headphones-3.jpg', alt: 'Wireless Headphones Detail', isPrimary: false, sortOrder: 3 },
        ],
        category: { id: '1', name: 'Electronics', slug: 'electronics', level: 1, sortOrder: 1, isActive: true, productCount: 150, createdAt: '2024-01-01' },
        brand: { id: '1', name: 'SoundTech', slug: 'soundtech', logo: '/images/brands/soundtech.png', website: 'https://soundtech.com', isActive: true, productCount: 25, createdAt: '2024-01-01' },
        tags: ['wireless', 'noise-canceling', 'premium', 'bluetooth', 'audio'],
        attributes: [
          { id: '1', name: 'Color', value: 'Black', displayType: 'color' },
          { id: '2', name: 'Connectivity', value: 'Bluetooth 5.0', displayType: 'text' },
          { id: '3', name: 'Warranty', value: '2 Years', displayType: 'text' },
        ],
        variants: [
          {
            id: 'v1',
            name: 'Black',
            sku: 'WH-1000XM5-BLK',
            price: 299.99,
            stock: 25,
            attributes: [{ id: '1', name: 'Color', value: 'Black', displayType: 'color' }],
            images: [{ id: '1', url: '/images/headphones-black.jpg', alt: 'Black Headphones', isPrimary: true, sortOrder: 1 }],
          },
          {
            id: 'v2',
            name: 'Silver',
            sku: 'WH-1000XM5-SLV',
            price: 299.99,
            stock: 20,
            attributes: [{ id: '2', name: 'Color', value: 'Silver', displayType: 'color' }],
            images: [{ id: '2', url: '/images/headphones-silver.jpg', alt: 'Silver Headphones', isPrimary: true, sortOrder: 1 }],
          }
        ],
        specifications: [
          { id: '1', name: 'Battery Life', value: '30 hours', group: 'Power' },
          { id: '2', name: 'Driver Size', value: '40mm', group: 'Audio' },
          { id: '3', name: 'Frequency Response', value: '4Hz - 40kHz', group: 'Audio' },
          { id: '4', name: 'Charging Time', value: '3 hours', group: 'Power' },
          { id: '5', name: 'Weight', value: '250g', group: 'Physical' },
        ],
        rating: { average: 4.8, count: 156 },
        reviews: [
          {
            id: 'r1',
            customerId: 'c1',
            customerName: 'John D.',
            rating: 5,
            title: 'Excellent sound quality',
            comment: 'Amazing headphones with great noise cancellation. Perfect for work and travel.',
            isVerified: true,
            createdAt: '2024-01-10T14:30:00Z',
            images: ['/images/review-1.jpg']
          },
          {
            id: 'r2',
            customerId: 'c2',
            customerName: 'Sarah M.',
            rating: 4,
            title: 'Good value for money',
            comment: 'Great headphones, comfortable for long use. Battery life is as advertised.',
            isVerified: true,
            createdAt: '2024-01-08T10:15:00Z'
          }
        ],
        isActive: true,
        isFeatured: true,
        isDigital: false,
        seoTitle: 'Premium Wireless Headphones - Noise Canceling | SoundTech',
        seoDescription: 'Buy premium wireless headphones with advanced noise cancellation. Free shipping, 2-year warranty.',
        seoKeywords: ['wireless headphones', 'noise canceling', 'bluetooth', 'premium audio'],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      };

      return { data: mockProduct } as AxiosResponse<Product>;
    }
  },

  // Search products
  searchProducts: async (query: string, filters?: ProductFilters): Promise<AxiosResponse<ProductListResponse>> => {
    const params = { filters: { ...filters, search: query } };
    return productAPI.getProducts(params);
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10): Promise<AxiosResponse<Product[]>> => {
    try {
      return await request.get(`/products/featured?limit=${limit}`);
    } catch (error) {
      const response = await productAPI.getProducts({ filters: { featured: true }, limit });
      return { data: response.data.data } as AxiosResponse<Product[]>;
    }
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit = 6): Promise<AxiosResponse<Product[]>> => {
    try {
      return await request.get(`/products/${productId}/related?limit=${limit}`);
    } catch (error) {
      const response = await productAPI.getProducts({ limit });
      return { data: response.data.data.slice(0, limit) } as AxiosResponse<Product[]>;
    }
  },

  // Get product reviews
  getProductReviews: async (productId: string, page = 1, limit = 10): Promise<AxiosResponse<{ data: ProductReview[]; total: number; }>> => {
    try {
      return await request.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
    } catch (error) {
      const mockReviews: ProductReview[] = [
        {
          id: 'r1',
          customerId: 'c1',
          customerName: 'John D.',
          rating: 5,
          title: 'Excellent sound quality',
          comment: 'Amazing headphones with great noise cancellation. Perfect for work and travel.',
          isVerified: true,
          createdAt: '2024-01-10T14:30:00Z',
          images: ['/images/review-1.jpg']
        },
        {
          id: 'r2',
          customerId: 'c2',
          customerName: 'Sarah M.',
          rating: 4,
          title: 'Good value for money',
          comment: 'Great headphones, comfortable for long use. Battery life is as advertised.',
          isVerified: true,
          createdAt: '2024-01-08T10:15:00Z'
        }
      ];

      return { data: { data: mockReviews, total: mockReviews.length } } as AxiosResponse<{ data: ProductReview[]; total: number; }>;
    }
  },

  // Add product review
  addProductReview: async (productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>): Promise<AxiosResponse<ProductReview>> => {
    try {
      return await request.post(`/products/${productId}/reviews`, review);
    } catch (error) {
      const newReview: ProductReview = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return { data: newReview } as AxiosResponse<ProductReview>;
    }
  },

  // Compare products
  compareProducts: async (productIds: string[]): Promise<AxiosResponse<ProductComparison>> => {
    try {
      return await request.post('/products/compare', { productIds });
    } catch (error) {
      // Mock comparison data
      const products = await Promise.all(productIds.map(id => productAPI.getProduct(id)));
      const comparison: ProductComparison = {
        products: products.map(p => p.data),
        attributes: ['Price', 'Brand', 'Rating', 'Warranty', 'Color Options']
      };
      return { data: comparison } as AxiosResponse<ProductComparison>;
    }
  },
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async (): Promise<AxiosResponse<Category[]>> => {
    try {
      return await request.get('/categories');
    } catch (error) {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and gadgets',
          image: '/images/categories/electronics.jpg',
          level: 1,
          sortOrder: 1,
          isActive: true,
          productCount: 150,
          seoTitle: 'Electronics - Latest Gadgets & Devices',
          seoDescription: 'Shop latest electronics, smartphones, laptops, and gadgets',
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: '1-1',
              name: 'Smartphones',
              slug: 'smartphones',
              parentId: '1',
              level: 2,
              sortOrder: 1,
              isActive: true,
              productCount: 45,
              createdAt: '2024-01-01T00:00:00Z',
            },
            {
              id: '1-2',
              name: 'Laptops',
              slug: 'laptops',
              parentId: '1',
              level: 2,
              sortOrder: 2,
              isActive: true,
              productCount: 32,
              createdAt: '2024-01-01T00:00:00Z',
            }
          ]
        },
        {
          id: '2',
          name: 'Fashion',
          slug: 'fashion',
          description: 'Clothing, shoes, and accessories',
          image: '/images/categories/fashion.jpg',
          level: 1,
          sortOrder: 2,
          isActive: true,
          productCount: 280,
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: '2-1',
              name: 'Men\'s Clothing',
              slug: 'mens-clothing',
              parentId: '2',
              level: 2,
              sortOrder: 1,
              isActive: true,
              productCount: 120,
              createdAt: '2024-01-01T00:00:00Z',
            },
            {
              id: '2-2',
              name: 'Women\'s Clothing',
              slug: 'womens-clothing',
              parentId: '2',
              level: 2,
              sortOrder: 2,
              isActive: true,
              productCount: 160,
              createdAt: '2024-01-01T00:00:00Z',
            }
          ]
        }
      ];

      return { data: mockCategories } as AxiosResponse<Category[]>;
    }
  },

  // Get category by ID or slug
  getCategory: async (id: string): Promise<AxiosResponse<Category>> => {
    try {
      return await request.get(`/categories/${id}`);
    } catch (error) {
      const mockCategory: Category = {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets including smartphones, laptops, tablets, and accessories',
        image: '/images/categories/electronics.jpg',
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 150,
        seoTitle: 'Electronics - Latest Gadgets & Devices',
        seoDescription: 'Shop latest electronics, smartphones, laptops, and gadgets with fast shipping',
        createdAt: '2024-01-01T00:00:00Z',
      };

      return { data: mockCategory } as AxiosResponse<Category>;
    }
  },

  // Get products by category
  getCategoryProducts: async (categoryId: string, params?: ProductSearchParams): Promise<AxiosResponse<ProductListResponse>> => {
    const searchParams = { ...params, filters: { ...params?.filters, categoryId } };
    return productAPI.getProducts(searchParams);
  },
};

// Brand API
export const brandAPI = {
  // Get all brands
  getBrands: async (): Promise<AxiosResponse<Brand[]>> => {
    try {
      return await request.get('/brands');
    } catch (error) {
      const mockBrands: Brand[] = [
        {
          id: '1',
          name: 'SoundTech',
          slug: 'soundtech',
          description: 'Premium audio equipment manufacturer',
          logo: '/images/brands/soundtech.png',
          website: 'https://soundtech.com',
          isActive: true,
          productCount: 25,
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'FitLife',
          slug: 'fitlife',
          description: 'Fitness and wellness technology',
          logo: '/images/brands/fitlife.png',
          website: 'https://fitlife.com',
          isActive: true,
          productCount: 18,
          createdAt: '2024-01-01T00:00:00Z',
        }
      ];

      return { data: mockBrands } as AxiosResponse<Brand[]>;
    }
  },

  // Get brand by ID or slug
  getBrand: async (id: string): Promise<AxiosResponse<Brand>> => {
    try {
      return await request.get(`/brands/${id}`);
    } catch (error) {
      const mockBrand: Brand = {
        id: '1',
        name: 'SoundTech',
        slug: 'soundtech',
        description: 'Premium audio equipment manufacturer specializing in wireless headphones and speakers',
        logo: '/images/brands/soundtech.png',
        website: 'https://soundtech.com',
        isActive: true,
        productCount: 25,
        createdAt: '2024-01-01T00:00:00Z',
      };

      return { data: mockBrand } as AxiosResponse<Brand>;
    }
  },

  // Get products by brand
  getBrandProducts: async (brandId: string, params?: ProductSearchParams): Promise<AxiosResponse<ProductListResponse>> => {
    const searchParams = { ...params, filters: { ...params?.filters, brandId } };
    return productAPI.getProducts(searchParams);
  },
};

// Wishlist API
export const wishlistAPI = {
  // Get wishlist
  getWishlist: async (): Promise<AxiosResponse<WishlistItem[]>> => {
    try {
      return await request.get('/wishlist');
    } catch (error) {
      const mockWishlist: WishlistItem[] = [];
      return { data: mockWishlist } as AxiosResponse<WishlistItem[]>;
    }
  },

  // Add to wishlist
  addToWishlist: async (productId: string): Promise<AxiosResponse<WishlistItem>> => {
    try {
      return await request.post('/wishlist', { productId });
    } catch (error) {
      const product = await productAPI.getProduct(productId);
      const wishlistItem: WishlistItem = {
        id: Date.now().toString(),
        productId,
        product: product.data,
        addedAt: new Date().toISOString(),
      };
      return { data: wishlistItem } as AxiosResponse<WishlistItem>;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string): Promise<AxiosResponse<void>> => {
    try {
      return await request.delete(`/wishlist/${productId}`);
    } catch (error) {
      return { data: undefined } as AxiosResponse<void>;
    }
  },
};

// Export default API object
const productAPIService = {
  productAPI,
  categoryAPI,
  brandAPI,
  wishlistAPI,
};

export default productAPIService;