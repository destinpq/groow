import { create } from 'zustand';

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  
  isInWishlist: (productId: string) => {
    return get().items.some(item => item.productId === productId);
  },
  
  addToWishlist: async (productId: string) => {
    const { items } = get();
    if (!items.some(item => item.productId === productId)) {
      const newItem: WishlistItem = {
        id: Date.now().toString(),
        productId,
        addedAt: new Date().toISOString(),
      };
      set({ items: [...items, newItem] });
    }
  },
  
  removeFromWishlist: async (productId: string) => {
    const { items } = get();
    set({ items: items.filter(item => item.productId !== productId) });
  },
  
  clearWishlist: () => {
    set({ items: [] });
  },
}));