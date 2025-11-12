#!/bin/bash

# GitHub Pages Deployment Script for Groow Frontend
set -e

echo "🚀 Deploying Groow Frontend to GitHub Pages..."

# Ensure we're in the frontend directory
cd "$(dirname "$0")/frontend"

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

# Navigate to dist directory
cd dist

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git config user.name "GitHub Actions"
    git config user.email "action@github.com"
fi

# Add all files
echo "📦 Adding files to deployment..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Deploy: Frontend build $(date)"

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/destinpq/groow-frontend-pages.git
fi

# Push to gh-pages branch
echo "🚀 Deploying to GitHub Pages..."
git push -f origin main:gh-pages

echo "✅ Frontend deployed to GitHub Pages!"
echo "🌐 Your site will be available at: https://destinpq.github.io/groow-frontend-pages"

cd ../..