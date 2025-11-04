import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI, Cart, CartItem, AddToCartData } from '@/services/api/cart';
import { message } from 'antd';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (data: AddToCartData) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      itemCount: 0,

      // Fetch cart from backend
      fetchCart: async () => {
        try {
          set({ loading: true });
          const cart = await cartAPI.get();
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
        } catch (error: any) {
          console.error('Failed to fetch cart:', error);
          set({ loading: false });
          // Don't show error message on initial load if cart is empty
          if (error?.response?.status !== 404) {
            message.error(error?.response?.data?.message || 'Failed to load cart');
          }
        }
      },

      // Add item to cart
      addItem: async (data: AddToCartData) => {
        try {
          set({ loading: true });
          const cart = await cartAPI.addItem(data);
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
          message.success('Item added to cart');
        } catch (error: any) {
          console.error('Failed to add item:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to add item to cart');
          throw error;
        }
      },

      // Update item quantity
      updateItemQuantity: async (itemId: string, quantity: number) => {
        try {
          set({ loading: true });
          
          if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            await get().removeItem(itemId);
            return;
          }

          const cart = await cartAPI.updateItem(itemId, { quantity });
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
          message.success('Cart updated');
        } catch (error: any) {
          console.error('Failed to update item:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to update cart');
          throw error;
        }
      },

      // Remove item from cart
      removeItem: async (itemId: string) => {
        try {
          set({ loading: true });
          const cart = await cartAPI.removeItem(itemId);
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
          message.success('Item removed from cart');
        } catch (error: any) {
          console.error('Failed to remove item:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to remove item');
          throw error;
        }
      },

      // Clear entire cart
      clearCart: async () => {
        try {
          set({ loading: true });
          await cartAPI.clear();
          set({ 
            cart: null, 
            itemCount: 0,
            loading: false 
          });
          message.success('Cart cleared');
        } catch (error: any) {
          console.error('Failed to clear cart:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to clear cart');
          throw error;
        }
      },

      // Apply coupon code
      applyCoupon: async (code: string) => {
        try {
          set({ loading: true });
          const cart = await cartAPI.applyCoupon(code);
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
          message.success('Coupon applied successfully');
        } catch (error: any) {
          console.error('Failed to apply coupon:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to apply coupon');
          throw error;
        }
      },

      // Remove coupon
      removeCoupon: async () => {
        try {
          set({ loading: true });
          const cart = await cartAPI.removeCoupon();
          set({ 
            cart, 
            itemCount: cart.itemCount || cart.items.length,
            loading: false 
          });
          message.success('Coupon removed');
        } catch (error: any) {
          console.error('Failed to remove coupon:', error);
          set({ loading: false });
          message.error(error?.response?.data?.message || 'Failed to remove coupon');
          throw error;
        }
      },

      // Sync with backend (useful after login)
      syncWithBackend: async () => {
        await get().fetchCart();
      },
    }),
    {
      name: 'cart-storage',
      // Only persist cart data, not loading state
      partialize: (state) => ({ 
        cart: state.cart,
        itemCount: state.itemCount 
      }),
    }
  )
);

// Helper hook to get just the cart count (for badge)
export const useCartCount = () => {
  const itemCount = useCartStore((state) => state.itemCount);
  return itemCount;
};

// Helper hook to check if product is in cart
export const useIsInCart = (productId: string) => {
  const cart = useCartStore((state) => state.cart);
  return cart?.items.some(item => item.productId === productId) || false;
};

// Helper hook to get cart item by product ID
export const useCartItem = (productId: string) => {
  const cart = useCartStore((state) => state.cart);
  return cart?.items.find(item => item.productId === productId);
};
