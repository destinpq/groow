/**
 * Enhanced Cart API Services
 * Advanced shopping cart functionality with cross-device sync
 */
import { api } from './client';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    inStock: boolean;
    stockQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity?: number;
  };
  variant?: {
    id: string;
    name: string;
    attributes: Record<string, string>;
    sku: string;
  };
  addedAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  weight: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  summary: CartSummary;
  appliedCoupons: Array<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  }>;
  shippingAddress?: {
    country: string;
    state: string;
    postalCode: string;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
  customizations?: Record<string, any>;
}

export interface UpdateCartItemData {
  quantity: number;
  variantId?: string;
}

export interface CartValidationResult {
  isValid: boolean;
  errors: Array<{
    itemId: string;
    type: 'out_of_stock' | 'insufficient_stock' | 'price_changed' | 'product_unavailable';
    message: string;
    currentValue?: any;
  }>;
  warnings: Array<{
    itemId: string;
    type: 'low_stock' | 'price_increase';
    message: string;
  }>;
}

export interface SavedCart {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: string;
  isWishlist: boolean;
}

export const cartEnhancedAPI = {
  /**
   * Get current cart
   */
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get('/cart');
    return data;
  },

  /**
   * Add item to cart
   */
  addItem: async (itemData: AddToCartData): Promise<Cart> => {
    const { data } = await api.post('/cart/items', itemData);
    return data;
  },

  /**
   * Update cart item
   */
  updateItem: async (itemId: string, updateData: UpdateCartItemData): Promise<Cart> => {
    const { data } = await api.put(`/cart/items/${itemId}`, updateData);
    return data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },

  /**
   * Apply coupon code
   */
  applyCoupon: async (code: string): Promise<Cart> => {
    const { data } = await api.post('/cart/coupons', { code });
    return data;
  },

  /**
   * Remove coupon
   */
  removeCoupon: async (code: string): Promise<Cart> => {
    const { data } = await api.delete(`/cart/coupons/${code}`);
    return data;
  },

  /**
   * Validate cart (check stock, prices, etc.)
   */
  validateCart: async (): Promise<CartValidationResult> => {
    const { data } = await api.post('/cart/validate');
    return data;
  },

  /**
   * Calculate shipping costs
   */
  calculateShipping: async (address: {
    country: string;
    state: string;
    postalCode: string;
  }) => {
    const { data } = await api.post('/cart/shipping/calculate', address);
    return data;
  },

  /**
   * Merge guest cart with user cart
   */
  mergeCart: async (guestCartId: string): Promise<Cart> => {
    const { data } = await api.post('/cart/merge', { guestCartId });
    return data;
  },

  /**
   * Save cart for later
   */
  saveCart: async (name: string): Promise<SavedCart> => {
    const { data } = await api.post('/cart/save', { name });
    return data;
  },

  /**
   * Get saved carts
   */
  getSavedCarts: async (): Promise<SavedCart[]> => {
    const { data } = await api.get('/cart/saved');
    return data;
  },

  /**
   * Restore saved cart
   */
  restoreCart: async (savedCartId: string): Promise<Cart> => {
    const { data } = await api.post(`/cart/restore/${savedCartId}`);
    return data;
  },

  /**
   * Delete saved cart
   */
  deleteSavedCart: async (savedCartId: string): Promise<void> => {
    await api.delete(`/cart/saved/${savedCartId}`);
  },

  /**
   * Share cart (generate shareable link)
   */
  shareCart: async (): Promise<{ shareUrl: string; expiresAt: string }> => {
    const { data } = await api.post('/cart/share');
    return data;
  },

  /**
   * Import shared cart
   */
  importSharedCart: async (shareToken: string): Promise<Cart> => {
    const { data } = await api.post('/cart/import', { shareToken });
    return data;
  },

  /**
   * Move item to wishlist
   */
  moveToWishlist: async (itemId: string): Promise<{ cart: Cart; wishlistId: string }> => {
    const { data } = await api.post(`/cart/items/${itemId}/move-to-wishlist`);
    return data;
  },

  /**
   * Get cart summary
   */
  getCartSummary: async (): Promise<CartSummary> => {
    const { data } = await api.get('/cart/summary');
    return data;
  },

  /**
   * Estimate delivery date
   */
  estimateDelivery: async (shippingMethodId: string) => {
    const { data } = await api.post('/cart/estimate-delivery', {
      shippingMethodId,
    });
    return data;
  },

  /**
   * Check if products are still available at current quantities
   */
  checkAvailability: async (items: Array<{ productId: string; variantId?: string; quantity: number }>) => {
    const { data } = await api.post('/cart/check-availability', { items });
    return data;
  },

  /**
   * Get recommended products for current cart
   */
  getRecommendations: async (limit: number = 6) => {
    const { data } = await api.get('/cart/recommendations', { params: { limit } });
    return data;
  },
};

export default cartEnhancedAPI;