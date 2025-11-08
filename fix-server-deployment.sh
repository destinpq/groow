#!/bin/bash

# Fix Server Deployment - Update Frontend with Correct API URL
# This script updates the remote server to use the correct Railway backend URL

set -e

echo "=========================================="
echo "🚀 FIXING SERVER DEPLOYMENT"
echo "Backend URL: grooow-api-db.destinpq.com"
echo "Frontend: groow.destinpq.com"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Server details (adjust these to match your server)
SERVER_USER="azureuser"
SERVER_HOST="groow.destinpq.com"  # or the IP address
PROJECT_PATH="/home/azureuser/Groow/groow"

echo -e "${BLUE}Step 1: Connecting to server and pulling latest code...${NC}"

# SSH commands to run on the server
ssh_commands="
cd $PROJECT_PATH
echo 'Pulling latest code from GitHub...'
git pull origin main

echo 'Installing frontend dependencies...'
cd frontend
npm install

echo 'Building frontend with updated API URL...'
npm run build

echo 'Restarting frontend PM2 process...'
pm2 restart groow-frontend-dev
pm2 restart groow-frontend-static

echo 'Checking PM2 status...'
pm2 list

echo 'Done! Frontend updated with correct API URL.'
"

echo -e "${BLUE}Executing commands on server...${NC}"
ssh -t "$SERVER_USER@$SERVER_HOST" "$ssh_commands"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ SERVER DEPLOYMENT FIXED!${NC}"
echo "=========================================="
echo ""
echo "The frontend at groow.destinpq.com should now:"
echo "✓ Use the correct API URL: grooow-api-db.destinpq.com"
echo "✓ Successfully make authentication requests"
echo "✓ No more CORS errors"
echo ""
echo "Test the login at: https://groow.destinpq.com/login"