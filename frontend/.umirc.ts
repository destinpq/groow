import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // HTTPS configuration
  https: {
    key: '/etc/letsencrypt/live/groow.destinpq.com/privkey.pem',
    cert: '/etc/letsencrypt/live/groow.destinpq.com/fullchain.pem',
  },
  
  // CRITICAL: Completely disable MFSU - it breaks with HTTPS/Caddy proxy
  mfsu: false,
  
  // Disable code splitting to avoid chunk loading issues
  codeSplitting: {
    jsStrategy: 'bigVendors',
  },
  
  // Force cache busting with hash in development
  hash: true,
  
  // Fix esbuild helper conflicts in production builds
  esbuildMinifyIIFE: true,
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
});
  