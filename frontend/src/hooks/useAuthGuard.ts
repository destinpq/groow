import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'umi';

/**
 * Authentication Guard Hook
 * 
 * Ensures user is authenticated before allowing access to protected resources.
 * Automatically redirects to login if not authenticated.
 * 
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Object with authentication state and helper flags
 * 
 * @example
 * ```typescript
 * const MyProtectedComponent = () => {
 *   const { canMakeApiCalls, isAuthenticated } = useAuthGuard();
 *   
 *   useEffect(() => {
 *     if (!canMakeApiCalls) return;
 *     fetchProtectedData();
 *   }, [canMakeApiCalls]);
 * };
 * ```
 */
export const useAuthGuard = (requireAuth = true) => {
  const { isAuthenticated, token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && (!isAuthenticated || !token)) {
      console.warn('🔒 Authentication required - redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, token, requireAuth, navigate]);

  // Check if we can make API calls (have valid token)
  const canMakeApiCalls = isAuthenticated && !!token && !!localStorage.getItem('access_token');

  return {
    isAuthenticated,
    token,
    user,
    canMakeApiCalls,
    hasToken: !!token,
  };
};

/**
 * Check if user is authenticated without redirecting
 * Useful for conditional rendering
 */
export const useAuth = () => {
  const { isAuthenticated, token, user } = useAuthStore();
  const hasToken = !!token && !!localStorage.getItem('access_token');

  return {
    isAuthenticated,
    token,
    user,
    hasToken,
    canMakeApiCalls: isAuthenticated && hasToken,
  };
};

