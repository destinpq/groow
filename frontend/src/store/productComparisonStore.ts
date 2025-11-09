import { create } from 'zustand';
import { type EnhancedProduct } from '@/services/api/enhanced-product';

interface ProductComparisonState {
  products: EnhancedProduct[];
  addProduct: (product: EnhancedProduct) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  maxProducts: number;
}

export const useProductComparisonStore = create<ProductComparisonState>((set, get) => ({
  products: [],
  maxProducts: 4,
  
  addProduct: (product: EnhancedProduct) => {
    const { products, maxProducts } = get();
    if (products.length >= maxProducts) {
      return; // Don't add if at max capacity
    }
    if (!products.some(p => p.id === product.id)) {
      set({ products: [...products, product] });
    }
  },
  
  removeProduct: (productId: string) => {
    const { products } = get();
    set({ products: products.filter(p => p.id !== productId) });
  },
  
  clearAll: () => {
    set({ products: [] });
  },
}));