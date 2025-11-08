#!/bin/bash

# GROOW E-Commerce Deployment Script
# This script deploys the platform with the new domain structure

set -e

echo "=========================================="
echo "GROOW E-Commerce Platform Deployment"
echo "Frontend: groow.destinpq.com"
echo "Backend API: groow-api.destinpq.com"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Validating Caddyfile...${NC}"
if sudo caddy validate --config ./Caddyfile; then
    echo -e "${GREEN}✓ Caddyfile is valid${NC}"
else
    echo -e "${RED}✗ Caddyfile validation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Backing up existing Caddy config...${NC}"
if [ -f /etc/caddy/Caddyfile ]; then
    sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backup created${NC}"
else
    echo -e "${GREEN}✓ No existing config to backup${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Deploying new Caddyfile...${NC}"
sudo cp ./Caddyfile /etc/caddy/Caddyfile
sudo chown root:root /etc/caddy/Caddyfile
sudo chmod 644 /etc/caddy/Caddyfile
echo -e "${GREEN}✓ Caddyfile deployed${NC}"
echo ""

echo -e "${BLUE}Step 4: Creating log directories...${NC}"
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy
echo -e "${GREEN}✓ Log directories created${NC}"
echo ""

echo -e "${BLUE}Step 5: Building backend application...${NC}"
cd backend
npm install --production
npm run build
cd ..
echo -e "${GREEN}✓ Backend built successfully${NC}"
echo ""

echo -e "${BLUE}Step 6: Restarting services...${NC}"

# Restart backend if service exists
if systemctl is-active --quiet groow-api 2>/dev/null; then
    sudo systemctl restart groow-api
    echo -e "${GREEN}✓ Backend service restarted${NC}"
else
    echo -e "${GREEN}✓ Backend service not configured (manual restart required)${NC}"
fi

# Reload Caddy
sudo systemctl reload caddy
if sudo systemctl is-active --quiet caddy; then
    echo -e "${GREEN}✓ Caddy reloaded successfully${NC}"
else
    echo -e "${RED}✗ Caddy reload failed${NC}"
    sudo systemctl status caddy --no-pager
    exit 1
fi
echo ""

echo -e "${BLUE}Step 7: Running health checks...${NC}"

# Wait a moment for services to start
sleep 3

# Test local backend
if curl -s http://localhost:3001/api/v1/health > /dev/null; then
    echo -e "${GREEN}✓ Local backend is responding${NC}"
else
    echo -e "${RED}✗ Local backend not responding${NC}"
fi

# Test through Caddy (may need DNS)
echo -e "${BLUE}Testing domain access (may fail if DNS not propagated)...${NC}"
if curl -s -k https://groow-api.destinpq.com/api/v1/health > /dev/null; then
    echo -e "${GREEN}✓ Domain access working${NC}"
else
    echo -e "${RED}⚠ Domain access not working (DNS may not be propagated yet)${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Add Cloudflare DNS records:"
echo "   - groow.destinpq.com → 20.40.56.175"
echo "   - groow-api.destinpq.com → 20.40.56.175"
echo ""
echo "2. Test the endpoints:"
echo "   - Frontend: https://groow.destinpq.com"
echo "   - API: https://groow-api.destinpq.com/api/v1/health"
echo "   - Docs: https://groow-api.destinpq.com/api/docs"
echo ""
echo "3. Update frontend API configuration to use:"
echo "   https://groow-api.destinpq.com/api/v1"
echo ""

if ! curl -s https://groow-api.destinpq.com/api/v1/health > /dev/null; then
    echo -e "${BLUE}Note: If domain doesn't work immediately, DNS may need time to propagate.${NC}"
    echo -e "${BLUE}You can test locally by adding to /etc/hosts:${NC}"
    echo "20.40.56.175 groow.destinpq.com"
    echo "20.40.56.175 groow-api.destinpq.com"
fi