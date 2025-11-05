import { useState, useEffect } from 'react';
import { productsApi, cartApi, ordersApi, wishlistApi } from './api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (mounted) {
          setData(result);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}

// Products hook
export function useProducts(filters?: any) {
  return useApi(() => productsApi.getAll(filters), [JSON.stringify(filters)]);
}

// Product detail hook
export function useProduct(id: string) {
  return useApi(() => productsApi.getById(id), [id]);
}

// Cart hook
export function useCart() {
  const { data, loading, error } = useApi(() => cartApi.get(), []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await cartApi.add(productId, quantity);
      // Trigger refetch
      window.location.reload();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateCart = async (id: string, quantity: number) => {
    try {
      await cartApi.update(id, quantity);
      window.location.reload();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await cartApi.remove(id);
      window.location.reload();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    cart: data,
    loading,
    error,
    addToCart,
    updateCart,
    removeFromCart,
  };
}

// Orders hook
export function useOrders(params?: any) {
  return useApi(() => ordersApi.getMyOrders(params), [JSON.stringify(params)]);
}

// Wishlist hook
export function useWishlist() {
  const { data, loading, error } = useApi(() => wishlistApi.get(), []);

  const addToWishlist = async (productId: string) => {
    try {
      await wishlistApi.add(productId);
      window.location.reload();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      await wishlistApi.remove(id);
      window.location.reload();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    wishlist: data,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
  };
}
