import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
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
  
  // Proxy for development
  proxy: {
    '/api': {
      target: 'https://groow-api.destinpq.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      secure: false,
    },
  },
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
});
  