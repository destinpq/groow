#!/bin/bash

# Vercel Deployment Script for Groow Frontend
set -e

echo "▲ Deploying Groow Frontend to Vercel..."

# Update Vercel CLI
echo "📦 Updating Vercel CLI..."
npm install -g vercel@latest

# Build the frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployed to Vercel!"
echo "🌐 Your frontend will be available at: https://groow-frontend.vercel.app"

cd ..