// Backend cart types - synchronized with backend cart entities and DTOs

import { Customer } from './customer';
import { Product } from './product';

// Cart Item Entity
export interface CartItem {
  id: string;
  customerId: string;
  customer: Customer;
  productId: string;
  product: Product;
  variantId?: string;
  quantity: number;
  price: number;
  selectedAttributes?: Array<{
    name: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Wishlist Item Entity  
export interface WishlistItem {
  id: string;
  customerId: string;
  customer: Customer;
  productId: string;
  product: Product;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Cart Summary
export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  tax: number;
  total: number;
}

// Cart (complete cart with items and summary)
export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// Wishlist (complete wishlist with items)
export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
}

// Cart DTOs
export interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedAttributes?: Array<{
    name: string;
    value: string;
  }>;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface AddToWishlistDto {
  productId: string;
  notes?: string;
}

// API Response Types
export interface CartAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Response DTOs for specific operations
export interface GetCartResponse {
  cart: Cart;
}

export interface AddToCartResponse {
  cartItem: CartItem;
  cart: Cart;
}

export interface UpdateCartItemResponse {
  cartItem: CartItem;
  cart: Cart;
}

export interface RemoveFromCartResponse {
  message: string;
  cart: Cart;
}

export interface ClearCartResponse {
  message: string;
}

export interface GetWishlistResponse {
  wishlist: Wishlist;
}

export interface AddToWishlistResponse {
  wishlistItem: WishlistItem;
  wishlist: Wishlist;
}

export interface RemoveFromWishlistResponse {
  message: string;
  wishlist: Wishlist;
}

export interface MoveToCartResponse {
  cartItem: CartItem;
  cart: Cart;
  wishlist: Wishlist;
}

// Validation Response
export interface CartValidationResponse {
  cart: Cart;
  issues: Array<{
    itemId: string;
    issue: 'out_of_stock' | 'price_changed' | 'unavailable';
    message: string;
  }>;
}

// Filter interfaces for admin operations
export interface CartFilter {
  customerId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface WishlistFilter {
  customerId?: string;
  page?: number;
  limit?: number;
}

// Re-export for convenience
export * from './pagination';