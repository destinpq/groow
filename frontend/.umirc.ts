import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // Disable MFSU - it's breaking React loading
  mfsu: false,
  
  // Disable source maps to see actual errors
  devtool: false,
  
  // Fix esbuild helper conflicts
  esbuildMinifyIIFE: true,
  
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
  