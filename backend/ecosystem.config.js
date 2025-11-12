module.exports = {
  apps: [
    {
      name: 'groow-backend',
      script: 'dist/main.js',
      cwd: '/home/azureuser/Groow/groow/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_URL: 'postgresql://groow_user:groow_password@localhost:5432/groow_db'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};