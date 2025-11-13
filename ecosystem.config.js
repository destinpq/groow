module.exports = {
  apps: [
    // Backend API Server
    {
      name: 'groow-backend',
      script: 'dist/main.js',
      cwd: '/home/azureuser/Groow/groow/backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 21440
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 21440,
        DATABASE_SYNC: 'false',
        DATABASE_LOGGING: 'false'
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 21440,
        DATABASE_SYNC: 'false',
        DATABASE_LOGGING: 'true'
      },
      // Logging
      log_file: './logs/backend-combined.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      // Advanced settings
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Environment files
      env_file: '.env',
      
      // Node.js specific
      node_args: '--max_old_space_size=4096'
    },
    
    // Frontend Development Server
    {
      name: 'groow-frontend-dev',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/azureuser/Groow/groow/frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 21441,
        HOST: '0.0.0.0',
        UMI_ENV: 'dev',
        MFSU: 'none',
        UMI_MFSU: 'none'
      },
      // Logging
      log_file: './logs/frontend-dev-combined.log',
      out_file: './logs/frontend-dev-out.log',
      error_file: './logs/frontend-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000
    },
    
    // Frontend Static Server (for production)
    {
      name: 'groow-frontend-static',
      script: './node_modules/.bin/serve',
      args: '-s dist -l 21441',
      cwd: '/home/azureuser/Groow/groow/frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 21441
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8001
      },
      // Logging
      log_file: './logs/frontend-static-combined.log',
      out_file: './logs/frontend-static-out.log',
      error_file: './logs/frontend-static-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2000,
      kill_timeout: 3000
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['groow-api.destinpq.com'],
      ref: 'origin/main',
      repo: 'git@github.com:destinpq/groow.git',
      path: '/var/www/groow',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    staging: {
      user: 'ubuntu',
      host: ['staging.destinpq.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:destinpq/groow.git',
      path: '/var/www/groow-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};