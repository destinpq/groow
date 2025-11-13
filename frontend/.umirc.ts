import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  
  // HTTPS configuration
  https: {
    key: '/etc/letsencrypt/live/groow.destinpq.com/privkey.pem',
    cert: '/etc/letsencrypt/live/groow.destinpq.com/fullchain.pem',
  },
  
  // CRITICAL: Disable MFSU - it breaks with HTTPS/Caddy proxy
  mfsu: false,
  
  // Fix esbuild helper conflicts in production builds
  esbuildMinifyIIFE: true,
  
  // Title and metadata
  title: 'Groow - E-Commerce Platform',
});
  