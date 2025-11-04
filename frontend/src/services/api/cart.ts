import api from './client';

// Types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
  vendorId: string;
  stock: number;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

// Cart API Service
export const cartAPI = {
  // Get current cart
  get: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  // Add item to cart
  addItem: async (data: AddToCartData): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/items', data);
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (itemId: string, data: UpdateCartItemData): Promise<Cart> => {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clear: async (): Promise<void> => {
    await api.delete('/cart');
  },

  // Apply coupon code
  applyCoupon: async (code: string): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/coupon', { code });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart/coupon');
    return response.data;
  },

  // Get cart count (badge)
  getCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/cart/count');
    return response.data.count;
  },
};

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  inStock: boolean;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  customerId: string;
  items: WishlistItem[];
  totalItems: number;
}

// Wishlist API Service
export const wishlistAPI = {
  // Get wishlist
  get: async (): Promise<Wishlist> => {
    const response = await api.get<Wishlist>('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  addItem: async (productId: string): Promise<Wishlist> => {
    const response = await api.post<Wishlist>('/wishlist/items', { productId });
    return response.data;
  },

  // Remove item from wishlist
  removeItem: async (itemId: string): Promise<Wishlist> => {
    const response = await api.delete<Wishlist>(`/wishlist/items/${itemId}`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string): Promise<boolean> => {
    const response = await api.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
    return response.data.inWishlist;
  },

  // Move item to cart
  moveToCart: async (itemId: string): Promise<{ cart: Cart; wishlist: Wishlist }> => {
    const response = await api.post(`/wishlist/items/${itemId}/move-to-cart`);
    return response.data;
  },

  // Clear wishlist
  clear: async (): Promise<void> => {
    await api.delete('/wishlist');
  },
};

export default { cartAPI, wishlistAPI };
