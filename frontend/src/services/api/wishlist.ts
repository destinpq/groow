import api from './client';
import { wishlistAPI as cartWishlistAPI } from './cart';
import type { 
  WishlistItem as BackendWishlistItem,
  Wishlist as BackendWishlist,
  AddToWishlistDto,
  CartAPIResponse 
} from '@/types/backend/cart';

// Extended wishlist types for advanced frontend features
export interface WishlistItem extends BackendWishlistItem {
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
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

export interface AddToWishlistRequest extends AddToWishlistDto {
  wishlistId?: string; // For multiple wishlists
}

export interface UpdateWishlistRequest {
  name?: string;
  isPublic?: boolean;
}

// Extended Wishlist API that builds on the backend cart wishlist functionality
export const wishlistAPI = {
  // Get all wishlists (primary + named wishlists)
  getWishlists: async (): Promise<Wishlist[]> => {
    try {
      // Get primary wishlist from backend
      const backendWishlist = await cartWishlistAPI.get();
      
      // Get named wishlists from frontend storage/API extension
      const response = await api.get<CartAPIResponse<Wishlist[]>>('/wishlists/named');
      const namedWishlists = response.data.data || [];
      
      // Convert backend wishlist to frontend format
      const primaryWishlist: Wishlist = {
        id: 'primary',
        name: 'My Wishlist',
        items: backendWishlist.items.map(item => ({
          ...item,
          productName: item.product?.name || 'Unknown Product',
          productImage: item.product?.images?.[0] || '',
          price: item.product?.basePrice || 0,
          originalPrice: item.product?.salePrice || undefined,
          inStock: (item.product?.stockQuantity || 0) > 0,
        })),
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return [primaryWishlist, ...namedWishlists];
    } catch (error) {
      console.error('Failed to get wishlists:', error);
      // Fallback to primary wishlist only
      const backendWishlist = await cartWishlistAPI.get();
      return [{
        id: 'primary',
        name: 'My Wishlist',
        items: backendWishlist.items.map(item => ({
          ...item,
          productName: item.product?.name || 'Unknown Product',
          productImage: item.product?.images?.[0] || '',
          price: item.product?.basePrice || 0,
          originalPrice: item.product?.salePrice || undefined,
          inStock: (item.product?.stockQuantity || 0) > 0,
        })),
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
    }
  },

  // Get a specific wishlist
  getWishlist: async (wishlistId: string): Promise<Wishlist> => {
    if (wishlistId === 'primary') {
      // Return primary wishlist from backend
      const backendWishlist = await cartWishlistAPI.get();
      return {
        id: 'primary',
        name: 'My Wishlist',
        items: backendWishlist.items.map(item => ({
          ...item,
          productName: item.product?.name || 'Unknown Product',
          productImage: item.product?.images?.[0] || '',
          price: item.product?.basePrice || 0,
          originalPrice: item.product?.salePrice || undefined,
          inStock: (item.product?.stockQuantity || 0) > 0,
        })),
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Get named wishlist from frontend extension
    const response = await api.get<CartAPIResponse<Wishlist>>(`/wishlists/named/${wishlistId}`);
    return response.data.data;
  },

  // Create new wishlist (named wishlist)
  createWishlist: async (data: CreateWishlistRequest): Promise<Wishlist> => {
    const response = await api.post<CartAPIResponse<Wishlist>>('/wishlists/named', data);
    return response.data.data;
  },

  // Update wishlist
  updateWishlist: async (wishlistId: string, data: UpdateWishlistRequest): Promise<Wishlist> => {
    if (wishlistId === 'primary') {
      throw new Error('Cannot rename primary wishlist');
    }
    
    const response = await api.put<CartAPIResponse<Wishlist>>(`/wishlists/named/${wishlistId}`, data);
    return response.data.data;
  },

  // Delete wishlist
  deleteWishlist: async (wishlistId: string): Promise<void> => {
    if (wishlistId === 'primary') {
      // Clear primary wishlist
      await cartWishlistAPI.clear();
    } else {
      // Delete named wishlist
      await api.delete(`/wishlists/named/${wishlistId}`);
    }
  },

  // Add item to wishlist
  addItem: async (wishlistId: string, data: AddToWishlistRequest): Promise<WishlistItem> => {
    if (wishlistId === 'primary') {
      // Add to primary wishlist via backend cart API
      const result = await cartWishlistAPI.addItem(data.productId, data.notes);
      const item = result.wishlistItem;
      
      return {
        ...item,
        productName: item.product?.name || 'Unknown Product',
        productImage: item.product?.images?.[0] || '',
        price: item.product?.basePrice || 0,
        originalPrice: item.product?.salePrice || undefined,
        inStock: (item.product?.stockQuantity || 0) > 0,
      };
    }
    
    // Add to named wishlist
    const response = await api.post<CartAPIResponse<WishlistItem>>(`/wishlists/named/${wishlistId}/items`, data);
    return response.data.data;
  },

  // Remove item from wishlist
  removeItem: async (wishlistId: string, itemId: string): Promise<void> => {
    if (wishlistId === 'primary') {
      // Remove from primary wishlist via backend cart API
      await cartWishlistAPI.removeItem(itemId);
    } else {
      // Remove from named wishlist
      await api.delete(`/wishlists/named/${wishlistId}/items/${itemId}`);
    }
  },

  // Move item to another wishlist
  moveItem: async (fromWishlistId: string, toWishlistId: string, itemId: string): Promise<void> => {
    if (fromWishlistId === 'primary' && toWishlistId === 'primary') {
      return; // No-op
    }
    
    // This would require backend support for multiple wishlists
    // For now, implement as copy + delete
    const fromWishlist = await wishlistAPI.getWishlist(fromWishlistId);
    const item = fromWishlist.items.find(i => i.id === itemId);
    
    if (item) {
      await wishlistAPI.addItem(toWishlistId, { 
        productId: item.productId, 
        notes: item.notes 
      });
      await wishlistAPI.removeItem(fromWishlistId, itemId);
    }
  },

  // Share wishlist
  shareWishlist: async (wishlistId: string): Promise<{ shareUrl: string }> => {
    const response = await api.post<CartAPIResponse<{ shareUrl: string }>>(`/wishlists/${wishlistId}/share`);
    return response.data.data;
  },

  // Get shared wishlist (public access)
  getSharedWishlist: async (shareToken: string): Promise<Wishlist> => {
    const response = await api.get<CartAPIResponse<Wishlist>>(`/wishlists/shared/${shareToken}`);
    return response.data.data;
  },

  // Helper methods that delegate to cart wishlist API
  isInWishlist: async (productId: string, wishlistId: string = 'primary'): Promise<boolean> => {
    if (wishlistId === 'primary') {
      return cartWishlistAPI.isInWishlist(productId);
    }
    
    const wishlist = await wishlistAPI.getWishlist(wishlistId);
    return wishlist.items.some(item => item.productId === productId);
  },

  getItemCount: async (wishlistId?: string): Promise<number> => {
    if (!wishlistId || wishlistId === 'primary') {
      return cartWishlistAPI.getItemCount();
    }
    
    const wishlist = await wishlistAPI.getWishlist(wishlistId);
    return wishlist.items.length;
  },

  getTotalItemCount: async (): Promise<number> => {
    const wishlists = await wishlistAPI.getWishlists();
    return wishlists.reduce((total, list) => total + list.items.length, 0);
  },
};

export default wishlistAPI;
