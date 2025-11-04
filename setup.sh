#!/bin/bash

# Groow E-Commerce Platform - Quick Setup Script
# This script helps you quickly setup the development environment

echo "🚀 Starting Groow E-Commerce Platform Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL not found. You'll need to install it separately.${NC}"
    echo "  macOS: brew install postgresql@15"
    echo "  Linux: sudo apt-get install postgresql-15"
else
    echo -e "${GREEN}✓ PostgreSQL detected${NC}"
fi

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit backend/.env with your database credentials${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Backend installation failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from .env.example..."
    cp .env.example .env.local
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    # Install peer dependency
    npm install tailwindcss-animate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Frontend installation failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

cd ..

# Summary
echo ""
echo "═══════════════════════════════════════════════"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your database:"
echo "   - Create PostgreSQL database: createdb groow_db"
echo "   - Update backend/.env with your credentials"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo "   → http://localhost:3001"
echo "   → API Docs: http://localhost:3001/api/docs"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo "   → http://localhost:3000"
echo ""
echo "4. Access the portals:"
echo "   - Landing: http://localhost:3000"
echo "   - Admin: http://localhost:3000/admin/login"
echo "   - Vendor: http://localhost:3000/vendor/login"
echo "   - Customer: http://localhost:3000/customer/login"
echo ""
echo "📚 Documentation:"
echo "   - SETUP_GUIDE.md - Complete setup instructions"
echo "   - FEATURES_STATUS.md - Feature implementation status"
echo "   - README.md - Project overview"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""
