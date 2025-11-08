module.exports = {
  apps: [
    {
      name: 'groow-backend',
      script: 'dist/main.js',
      cwd: '/Users/pratik/Desktop/Work/DestinPQ/EXTERNAL/Groow/groow/backend',
      instances: 1, // or 'max' for cluster mode
      exec_mode: 'fork', // or 'cluster'
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_SYNC: 'false', // Disable sync in production
        DATABASE_LOGGING: 'false'
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
        DATABASE_SYNC: 'false',
        DATABASE_LOGGING: 'true'
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      // Advanced settings
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check: {
        port: 3001,
        path: '/api/v1/health'
      },
      
      // Environment files
      env_file: '.env',
      
      // Node.js specific
      node_args: '--max_old_space_size=4096'
    }
  ]
};