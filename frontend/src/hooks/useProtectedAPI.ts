import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuthGuard';

/**
 * Protected API Call Hook
 * 
 * Automatically guards API calls to ensure they're only made when authenticated.
 * Provides loading, error, and data states.
 * 
 * @param apiCall - The API function to call
 * @param dependencies - Dependencies that trigger a refetch
 * @param options - Configuration options
 * @returns Object with data, loading, error states and refetch function
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const { data, loading, error, refetch } = useProtectedAPI(
 *     () => dashboardAPI.getStats(),
 *     []
 *   );
 *   
 *   if (loading) return <Spin />;
 *   if (error) return <Alert message={error.message} />;
 *   return <div>{data}</div>;
 * };
 * ```
 */
export const useProtectedAPI = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { canMakeApiCalls } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { enabled = true, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!canMakeApiCalls) {
      console.warn('⚠️ Cannot make API call - user not authenticated');
      return;
    }

    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('API call failed');
      setError(error);
      onError?.(error);
      console.error('❌ Protected API call failed:', error);
    } finally {
      setLoading(false);
    }
  }, [canMakeApiCalls, enabled, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    canMakeApiCalls,
  };
};

/**
 * Protected API Mutation Hook
 * 
 * For POST/PUT/PATCH/DELETE operations that should be triggered manually.
 * 
 * @param apiCall - The API mutation function
 * @returns Object with mutate function, loading, error states
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const { mutate, loading, error } = useProtectedMutation(
 *     (data) => productAPI.create(data)
 *   );
 *   
 *   const handleSubmit = async (formData) => {
 *     await mutate(formData);
 *   };
 * };
 * ```
 */
export const useProtectedMutation = <TData, TVariables = void>(
  apiCall: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { canMakeApiCalls } = useAuth();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (variables: TVariables) => {
      if (!canMakeApiCalls) {
        const authError = new Error('Authentication required');
        setError(authError);
        onError?.(authError);
        throw authError;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(variables);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canMakeApiCalls, apiCall, onSuccess, onError]
  );

  return {
    mutate,
    data,
    loading,
    error,
    canMakeApiCalls,
  };
};

