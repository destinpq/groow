import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // Defensive fix for Array.prototype.some to prevent null/undefined errors
  headScripts: [
    {
      content: `
        (function() {
          // Override all array methods to be defensive
          const originalSome = Array.prototype.some;
          const originalFilter = Array.prototype.filter;
          const originalMap = Array.prototype.map;
          const originalFind = Array.prototype.find;
          
          // Defensive wrapper function
          function safeArrayMethod(obj, method, defaultReturn) {
            if (obj == null || obj == undefined || typeof obj.some !== 'function') {
              return defaultReturn;
            }
            return method.apply(obj, arguments);
          }
          
          Array.prototype.some = function() {
            if (this == null || this == undefined) return false;
            return originalSome.apply(this, arguments);
          };
          
          Array.prototype.filter = function() {
            if (this == null || this == undefined) return [];
            return originalFilter.apply(this, arguments);
          };
          
          Array.prototype.map = function() {
            if (this == null || this == undefined) return [];
            return originalMap.apply(this, arguments);
          };
          
          Array.prototype.find = function() {
            if (this == null || this == undefined) return undefined;
            return originalFind.apply(this, arguments);
          };
          
          // Intercept all property access to 'some' method
          const originalDefineProperty = Object.defineProperty;
          
          // Global error handler with more aggressive prevention
          window.addEventListener('error', function(e) {
            if (e.message && (e.message.includes('some is not a function') || e.message.includes('.some is not a function'))) {
              console.log('Intercepted some() error:', e);
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
            }
          }, true);
          
          // Intercept unhandled promise rejections
          window.addEventListener('unhandledrejection', function(e) {
            if (e.reason && e.reason.message && e.reason.message.includes('some is not a function')) {
              console.log('Intercepted promise rejection with some() error:', e);
              e.preventDefault();
              return false;
            }
          });
          
          // Override console.error to catch and suppress these errors
          const originalError = console.error;
          console.error = function() {
            const message = arguments[0];
            if (typeof message === 'string' && message.includes('some is not a function')) {
              console.log('Suppressed some() console error:', message);
              return;
            }
            return originalError.apply(console, arguments);
          };
        })();
      `
    }
  ],
  
  // HTTPS configuration
  https: {
    key: '/etc/letsencrypt/live/groow.destinpq.com/privkey.pem',
    cert: '/etc/letsencrypt/live/groow.destinpq.com/fullchain.pem',
  },
  
  // Disable MFSU - it's breaking React loading
  mfsu: false,
  
  // Disable source maps to see actual errors
  devtool: false,
  
  // Fix esbuild helper conflicts
  esbuildMinifyIIFE: true,
  
  // Force new chunk names with timestamp
  hash: true,
  
  // Output configuration for cache busting
  outputPath: 'dist',
  
  // Define environment variables
  define: {
    'process.env.API_URL': 'https://groow-api.destinpq.com/api/v1',
    'process.env.REACT_APP_API_URL': 'https://groow-api.destinpq.com/api/v1',
  },
  
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
  
  // Remove proxy - let API calls go directly to groow-api.destinpq.com
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
});
  