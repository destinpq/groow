import request from '@/utils/request';

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWishlistRequest {
  name: string;
  isPublic?: boolean;
}

export interface AddToWishlistRequest {
  productId: string;
  notes?: string;
}

export interface UpdateWishlistRequest {
  name?: string;
  isPublic?: boolean;
}

export const wishlistAPI = {
  // Get all wishlists
  getWishlists: async (): Promise<Wishlist[]> => {
    return request('/api/wishlists', {
      method: 'GET',
    });
  },

  // Get a specific wishlist
  getWishlist: async (wishlistId: string): Promise<Wishlist> => {
    return request(`/api/wishlists/${wishlistId}`, {
      method: 'GET',
    });
  },

  // Create new wishlist
  createWishlist: async (data: CreateWishlistRequest): Promise<Wishlist> => {
    return request('/api/wishlists', {
      method: 'POST',
      data,
    });
  },

  // Update wishlist
  updateWishlist: async (wishlistId: string, data: UpdateWishlistRequest): Promise<Wishlist> => {
    return request(`/api/wishlists/${wishlistId}`, {
      method: 'PUT',
      data,
    });
  },

  // Delete wishlist
  deleteWishlist: async (wishlistId: string): Promise<void> => {
    return request(`/api/wishlists/${wishlistId}`, {
      method: 'DELETE',
    });
  },

  // Add item to wishlist
  addItem: async (wishlistId: string, data: AddToWishlistRequest): Promise<WishlistItem> => {
    return request(`/api/wishlists/${wishlistId}/items`, {
      method: 'POST',
      data,
    });
  },

  // Remove item from wishlist
  removeItem: async (wishlistId: string, itemId: string): Promise<void> => {
    return request(`/api/wishlists/${wishlistId}/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Move item to another wishlist
  moveItem: async (fromWishlistId: string, toWishlistId: string, itemId: string): Promise<void> => {
    return request(`/api/wishlists/${fromWishlistId}/items/${itemId}/move`, {
      method: 'POST',
      data: { toWishlistId },
    });
  },

  // Share wishlist
  shareWishlist: async (wishlistId: string): Promise<{ shareUrl: string }> => {
    return request(`/api/wishlists/${wishlistId}/share`, {
      method: 'POST',
    });
  },

  // Get shared wishlist (public access)
  getSharedWishlist: async (shareToken: string): Promise<Wishlist> => {
    return request(`/api/wishlists/shared/${shareToken}`, {
      method: 'GET',
    });
  },
};
