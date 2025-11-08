#!/bin/bash

# PM2 Startup Script for Groow Backend
# This script builds the application and starts it with PM2

echo "🚀 Starting Groow Backend with PM2..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Stop existing process if running
echo "🛑 Stopping existing process..."
pm2 stop groow-backend 2>/dev/null || echo "No existing process found"
pm2 delete groow-backend 2>/dev/null || echo "No existing process to delete"

# Start the application based on environment
if [ "$1" = "production" ]; then
    echo "🏭 Starting in production mode..."
    pm2 start ecosystem.config.js --env production
elif [ "$1" = "staging" ]; then
    echo "🔧 Starting in staging mode..."
    pm2 start ecosystem.config.js --env staging
else
    echo "🔧 Starting in development mode..."
    pm2 start ecosystem.config.js
fi

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "✅ Groow Backend started successfully!"
echo "📊 Use 'pm2 monit' to monitor the application"
echo "📝 Use 'pm2 logs groow-backend' to view logs"
echo "🔄 Use 'pm2 restart groow-backend' to restart"