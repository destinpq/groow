import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // CRITICAL: Completely disable MFSU - it breaks with HTTPS/Caddy proxy
  mfsu: false,
  
  // Disable code splitting to avoid chunk loading issues with Caddy proxy
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  
  // Force cache busting with hash in development
  hash: true,
  
  // Fix esbuild helper conflicts in production builds
  esbuildMinifyIIFE: true,
  
  // Browser targets - ensure proper polyfill support
  targets: {
    chrome: 79,
    firefox: 67,
    safari: 11,
    edge: 79,
  },
  
  // Polyfill configuration
  polyfill: {
    imports: ['core-js/stable'],
  },
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
  
  // Proxy configuration for API calls
  proxy: {
    '/api': {
      target: 'http://localhost:21440',
      changeOrigin: true,
    },
  },
});
  