import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // Theme configuration
  theme: {
    '@primary-color': '#FF9900',
    '@link-color': '#007185',
    '@success-color': '#067D62',
    '@warning-color': '#F0C14B',
    '@error-color': '#C7511F',
    '@font-size-base': '14px',
    '@border-radius-base': '4px',
  },
  
  // Routes configuration
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/login', component: '@/pages/login' },
    { path: '/register', component: '@/pages/register' },
    { path: '/forgot-password', component: '@/pages/forgot-password' },
    
    // Admin routes
    { 
      path: '/admin',
      component: '@/layouts/AdminLayout',
      routes: [
        { path: '/admin', redirect: '/admin/dashboard' },
        { path: '/admin/dashboard', component: '@/pages/admin/dashboard' },
        
        // Products
        { path: '/admin/products', component: '@/pages/admin/products' },
        // { path: '/admin/products/add', component: '@/pages/admin/products/add' },
        { path: '/admin/categories', component: '@/pages/admin/categories' },
        { path: '/admin/brands', component: '@/pages/admin/brands' },
        // { path: '/admin/attributes', component: '@/pages/admin/attributes' },
        
        // Orders
        { path: '/admin/orders', component: '@/pages/admin/orders' },
        { path: '/admin/orders/:status', component: '@/pages/admin/orders' },
        
        // Vendors
        { path: '/admin/vendors', component: '@/pages/admin/vendors' },
        { path: '/admin/vendors/:status', component: '@/pages/admin/vendors' },
        // { path: '/admin/vendors/subscriptions', component: '@/pages/admin/vendors/subscriptions' },
        
        // Customers
        { path: '/admin/customers', component: '@/pages/admin/customers' },
        { path: '/admin/customers/:status', component: '@/pages/admin/customers' },
        
        // RFQ
        { path: '/admin/rfq', component: '@/pages/admin/rfq' },
        { path: '/admin/rfq/:status', component: '@/pages/admin/rfq' },
        
        // CMS - Comment out subdirectory routes
        // { path: '/admin/cms/banners', component: '@/pages/admin/cms/banners' },
        // { path: '/admin/cms/sliders', component: '@/pages/admin/cms/sliders' },
        // { path: '/admin/cms/pages', component: '@/pages/admin/cms/pages' },
        // { path: '/admin/cms/menus', component: '@/pages/admin/cms/menus' },
        // { path: '/admin/cms/testimonials', component: '@/pages/admin/cms/testimonials' },
        // { path: '/admin/cms/faqs', component: '@/pages/admin/cms/faqs' },
        
        // Marketing - Comment out subdirectory routes
        // { path: '/admin/marketing/deals', component: '@/pages/admin/marketing/deals' },
        // { path: '/admin/marketing/coupons', component: '@/pages/admin/marketing/coupons' },
        // { path: '/admin/marketing/promotions', component: '@/pages/admin/marketing/promotions' },
        
        // Reports
        { path: '/admin/reports/:type', component: '@/pages/admin/sales-reports' },
        
        // Finance - Comment out subdirectory routes
        // { path: '/admin/finance/transactions', component: '@/pages/admin/finance/transactions' },
        // { path: '/admin/finance/payouts', component: '@/pages/admin/finance/payouts' },
        // { path: '/admin/finance/refunds', component: '@/pages/admin/finance/refunds' },
        
        // Support - Comment out subdirectory routes
        // { path: '/admin/support/tickets', component: '@/pages/admin/support/tickets' },
        // { path: '/admin/support/disputes', component: '@/pages/admin/support/disputes' },
        
        // Staff - Comment out subdirectory routes (file doesn't exist)
        // { path: '/admin/staff', component: '@/pages/admin/staff' },
        // { path: '/admin/staff/roles', component: '@/pages/admin/staff/roles' },
        
        // Settings
        { path: '/admin/settings', component: '@/pages/admin/settings' },
      ]
    },
    
    // Vendor routes
    {
      path: '/vendor',
      component: '@/layouts/VendorLayout',
      routes: [
        { path: '/vendor', redirect: '/vendor/dashboard' },
        { path: '/vendor/dashboard', component: '@/pages/vendor/dashboard' },
        { path: '/vendor/profile', component: '@/pages/vendor/profile' },
        { path: '/vendor/kyc', component: '@/pages/vendor/kyc' },
        // { path: '/vendor/store', component: '@/pages/vendor/store' }, // File doesn't exist
        { path: '/vendor/products', component: '@/pages/vendor/products' },
        // { path: '/vendor/products/add', component: '@/pages/vendor/products/add' },
        { path: '/vendor/orders', component: '@/pages/vendor/orders' },
        { path: '/vendor/rfq', component: '@/pages/vendor/rfq' },
        { path: '/vendor/customers', component: '@/pages/vendor/customers' },
        { path: '/vendor/wallet', component: '@/pages/vendor/wallet' },
        // { path: '/vendor/payouts', component: '@/pages/vendor/payouts' }, // File doesn't exist
        // { path: '/vendor/reports', component: '@/pages/vendor/reports' }, // reports is a directory
        { path: '/vendor/promotions', component: '@/pages/vendor/promotions' },
      ]
    },
    
    // Customer routes
    {
      path: '/customer',
      component: '@/layouts/CustomerLayout',
      routes: [
        { path: '/customer', redirect: '/customer/dashboard' },
        { path: '/customer/dashboard', component: '@/pages/customer/dashboard' },
        { path: '/customer/profile', component: '@/pages/customer/profile' },
        { path: '/customer/orders', component: '@/pages/customer/orders' },
        // { path: '/customer/rfq', component: '@/pages/customer/rfq' }, // rfq is a directory
        // { path: '/customer/wallet', component: '@/pages/customer/wallet' }, // File doesn't exist
        { path: '/customer/wishlist', component: '@/pages/customer/wishlist' },
        { path: '/customer/reviews', component: '@/pages/customer/reviews' },
      ]
    },
    
    // Public routes
    { path: '/products', component: '@/pages/products' },
    // { path: '/products/:id', component: '@/pages/products/detail' },
    // { path: '/category/:id', component: '@/pages/category' }, // File doesn't exist
    // { path: '/vendor/:id', component: '@/pages/vendor-profile' }, // File doesn't exist
    { path: '/cart', component: '@/pages/cart' },
    { path: '/checkout', component: '@/pages/checkout' },
    // { path: '/search', component: '@/pages/search' }, // File doesn't exist
    
    // Help pages
    // { path: '/help', component: '@/pages/help' }, // help is a directory
    { path: '/contact', component: '@/pages/contact' },
    { path: '/about', component: '@/pages/about' },
    { path: '/privacy', component: '@/pages/privacy' },
    { path: '/terms', component: '@/pages/terms' },
    { path: '/faq', component: '@/pages/faq' },
  ],
  
  // Proxy for development
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
  
  // Webpack configuration
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        antd: {
          name: 'antd',
          test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
          priority: 20,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
      },
    });
  },
});
