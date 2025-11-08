#!/bin/bash

# Railway Deployment Script for Groow Backend
set -e

echo "🚂 Deploying Groow Backend to Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway login --browser

# Create or connect to Railway project
echo "🏗️ Setting up Railway project..."
railway projects

# Deploy the backend
echo "🚀 Deploying backend to Railway..."
cd backend

# Set environment variables
echo "⚙️ Setting environment variables..."

# Database secrets (Railway will provide these automatically when PostgreSQL is added)
# railway variables set NODE_ENV=production
# railway variables set PORT=3001
# railway variables set API_PREFIX=api/v1

# JWT secrets (you should change these)
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_REFRESH_SECRET=$(openssl rand -base64 32)
railway variables set SESSION_SECRET=$(openssl rand -base64 32)

# Admin credentials
railway variables set ADMIN_EMAIL=admin@groow.com
railway variables set ADMIN_PASSWORD=$(openssl rand -base64 16)

# Frontend URL (will be updated after Vercel deployment)
railway variables set FRONTEND_URL=https://groow-frontend.vercel.app
railway variables set CORS_ORIGINS=https://groow-frontend.vercel.app,https://groow.destinpq.com,https://nz.destinpq.com

echo "✅ Environment variables set!"

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
railway add --database postgresql

# Add Redis (optional)
echo "📦 Adding Redis..."
railway add --database redis

# Deploy the application
echo "🚀 Deploying application..."
railway up --detach

echo "✅ Backend deployed to Railway!"
echo "🌐 Your backend will be available at: https://your-app-name.up.railway.app"
echo "📚 API Documentation: https://your-app-name.up.railway.app/api/docs"
echo "💓 Health Check: https://your-app-name.up.railway.app/api/v1/health"

# Show deployment info
railway status