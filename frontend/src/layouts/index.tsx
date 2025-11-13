import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'umi';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';
import AdminLayout from './AdminLayout';
import VendorLayout from './VendorLayout';
import CustomerLayout from './CustomerLayout';

const GlobalLayoutWrapper = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auth protection logic
    if (!isAuthenticated && !['/login', '/register', '/', '/about', '/contact', '/services', '/privacy', '/terms'].includes(location.pathname) && !location.pathname.startsWith('/service/')) {
      navigate('/login');
      return;
    }

    // Role-based redirection after successful login
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role and current path
      if (location.pathname === '/login' || location.pathname === '/register') {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
        return;
      }

      // Check if user is accessing the correct role-based routes
      const currentPath = location.pathname;
      
      if (user.role === 'admin' && !currentPath.startsWith('/admin') && currentPath !== '/') {
        navigate('/admin/dashboard');
        return;
      }
      
      if (user.role === 'vendor' && !currentPath.startsWith('/vendor') && currentPath !== '/') {
        navigate('/vendor/dashboard');
        return;
      }
      
      if (user.role === 'customer' && currentPath.startsWith('/admin')) {
        navigate('/customer/dashboard');
        return;
      }
      
      if (user.role === 'customer' && currentPath.startsWith('/vendor')) {
        navigate('/customer/dashboard');
        return;
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  // Show loading while auth state is being determined
  if (isAuthenticated === undefined) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Public routes (no layout needed)
  const publicRoutes = ['/login', '/register', '/', '/about', '/contact', '/services', '/privacy', '/terms'];
  const isPublicRoute = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/service/');
  
  if (isPublicRoute || !isAuthenticated) {
    return <Outlet />;
  }

  // Apply appropriate layout based on user role and current route
  const currentPath = location.pathname;

  if (user?.role === 'admin' && currentPath.startsWith('/admin')) {
    return <AdminLayout />;
  }
  
  if (user?.role === 'vendor' && currentPath.startsWith('/vendor')) {
    return <VendorLayout />;
  }
  
  if (user?.role === 'customer' && (currentPath.startsWith('/customer') || currentPath === '/dashboard' || currentPath.startsWith('/profile') || currentPath.startsWith('/orders') || currentPath.startsWith('/cart') || currentPath.startsWith('/wishlist'))) {
    return <CustomerLayout />;
  }

  // Default fallback - if authenticated but no specific layout, use customer layout
  if (isAuthenticated) {
    return <CustomerLayout />;
  }

  // Fallback for unauthenticated users
  return <Outlet />;
};

export default GlobalLayoutWrapper;