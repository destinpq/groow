#!/bin/bash

# GROOW E-Commerce Database Setup Script
# This script sets up PostgreSQL database for the GROOW platform

set -e

echo "=========================================="
echo "GROOW E-Commerce Database Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database configuration - Use Railway env vars if available, otherwise local
if [ ! -z "$DATABASE_HOST" ] && [ ! -z "$DATABASE_USER" ] && [ ! -z "$DATABASE_PASSWORD" ] && [ ! -z "$DATABASE_NAME" ]; then
    echo "🚂 Using Railway database configuration..."
    DB_HOST="$DATABASE_HOST"
    DB_PORT="${DATABASE_PORT:-5432}"
    DB_NAME="$DATABASE_NAME"
    DB_USER="$DATABASE_USER"
    DB_PASSWORD="$DATABASE_PASSWORD"
    PGPASSWORD="$DB_PASSWORD"
    export PGPASSWORD
else
    echo "🏠 Using local database configuration..."
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_NAME="groow_db"
    DB_USER="groow_user"
    DB_PASSWORD="groow_password"
fi

echo -e "${BLUE}Step 1: Checking PostgreSQL installation...${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed!${NC}"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@14"
    echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking PostgreSQL service status...${NC}"

# Check if PostgreSQL is running (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! pgrep -x postgres > /dev/null; then
        echo "Starting PostgreSQL service..."
        brew services start postgresql@14
        sleep 3
    fi
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}"
echo ""

echo -e "${BLUE}Step 3: Creating/verifying database user...${NC}"

# For Railway, skip user creation as it's managed
if [ "$DB_HOST" = "localhost" ]; then
    # Create user if not exists (local only)
    psql -U postgres -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
        psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    echo -e "${GREEN}✓ Database user created/verified${NC}"
else
    echo -e "${GREEN}✓ Using Railway managed database user${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Setting up database...${NC}"

if [ "$DB_HOST" = "localhost" ]; then
    # Local database setup
    psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    echo -e "${GREEN}✓ Database created: $DB_NAME${NC}"
else
    # Railway database - database already exists, just connect
    echo -e "${GREEN}✓ Using existing Railway database: $DB_NAME${NC}"
fi
echo ""

echo -e "${BLUE}Step 5: Installing PostgreSQL extensions...${NC}"

# Install UUID extension
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Install pg_trgm for full-text search
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

echo -e "${GREEN}✓ Extensions installed${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}Database Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Database Details:"
echo "  Host:     $DB_HOST"
echo "  Port:     $DB_PORT"
echo "  Name:     $DB_NAME"
echo "  User:     $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: cd backend && npm install"
echo "  2. Run migrations: npm run migration:run"
echo "  3. Seed database: npm run seed"
echo "  4. Start server: npm run start:dev"
echo ""
