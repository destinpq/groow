# 🗄️ GROOW E-Commerce - Database Setup Guide

Complete guide for setting up and configuring the PostgreSQL database for the GROOW platform.

---

## 📋 Prerequisites

### Required Software
- **PostgreSQL 14+** - Database server
- **Node.js 18+** - Runtime environment
- **npm/yarn** - Package manager

### Installation

#### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

#### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Windows
1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and follow wizard
3. Note the password you set for the `postgres` user

---

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
# Make script executable
chmod +x setup-database.sh

# Run setup script
./setup-database.sh
```

This will:
- ✅ Create database user: `groow_user`
- ✅ Create database: `groow_db`
- ✅ Install required extensions
- ✅ Grant necessary privileges

### Option 2: Manual Setup

#### 1. Connect to PostgreSQL
```bash
# macOS/Linux
psql -U postgres

# Windows (in PowerShell)
psql -U postgres
```

#### 2. Create Database User
```sql
CREATE USER groow_user WITH PASSWORD 'groow_password';
```

#### 3. Create Database
```sql
CREATE DATABASE groow_db OWNER groow_user;
GRANT ALL PRIVILEGES ON DATABASE groow_db TO groow_user;
```

#### 4. Install Extensions
```sql
\c groow_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

#### 5. Exit PostgreSQL
```sql
\q
```

---

## 📦 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your database credentials
# The defaults should work if you used the automated setup
```

### 3. Run Database Seeder
```bash
# Seed initial data (admin, categories, brands, sample users)
npm run seed
```

This creates:
- ✅ 1 Admin user (`admin@groow.com`)
- ✅ 8 Product categories
- ✅ 10 Brands
- ✅ 5 Sample vendors
- ✅ 10 Sample customers

### 4. Start Backend Server
```bash
# Development mode with hot-reload
npm run start:dev
```

The server will start on `https://nz-api.destinpq.com`

---

## 🔐 Default Credentials

After running the seeder, you can login with:

### Admin Portal
- **Email:** admin@groow.com
- **Password:** Admin@123456
- **URL:** http://localhost:8000/admin/login

### Vendor Portal
- **Email:** vendor1@groow.com to vendor5@groow.com
- **Password:** Vendor@123456
- **URL:** http://localhost:8000/vendor/login

### Customer Portal
- **Email:** customer1@groow.com to customer10@groow.com
- **Password:** Customer@123456
- **URL:** http://localhost:8000/login

---

## 📊 Database Schema

### Core Tables

#### Users & Authentication
- `user` - Base user accounts (admin, vendor, customer)
- `vendor` - Vendor profiles and business details
- `customer` - Customer profiles and preferences

#### Products & Catalog
- `category` - Product categories (hierarchical)
- `brand` - Product brands
- `product` - Product listings
- `product_variant` - Product variations (size, color)
- `product_review` - Customer reviews and ratings

#### Orders & Transactions
- `order` - Customer orders
- `order_item` - Individual order items
- `payment` - Payment transactions
- `wallet_transaction` - Wallet credits/debits

#### RFQ System
- `rfq` - Request for quotation
- `quotation` - Vendor quotes
- `rfq_message` - RFQ messaging

#### CMS & Content
- `page` - CMS pages
- `banner` - Homepage banners
- `faq` - FAQ entries
- `testimonial` - Customer testimonials

#### Shopping
- `cart_item` - Shopping cart items
- `wishlist_item` - Customer wishlists

#### File Management
- `upload` - File uploads and media

---

## 🛠️ Database Management

### View All Tables
```sql
\c groow_db
\dt
```

### View Table Structure
```sql
\d+ table_name
```

### View Database Size
```sql
SELECT pg_size_pretty(pg_database_size('groow_db'));
```

### Backup Database
```bash
# Full backup
pg_dump -U groow_user groow_db > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -U groow_user groow_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Database
```bash
# From SQL file
psql -U groow_user groow_db < backup.sql

# From compressed file
gunzip -c backup.sql.gz | psql -U groow_user groow_db
```

### Reset Database
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS groow_db;"
psql -U postgres -c "CREATE DATABASE groow_db OWNER groow_user;"

# Re-run seeder
cd backend
npm run seed
```

---

## 🔍 Troubleshooting

### Connection Issues

#### Error: "FATAL: password authentication failed"
```bash
# Reset user password
psql -U postgres -c "ALTER USER groow_user WITH PASSWORD 'groow_password';"
```

#### Error: "FATAL: database 'groow_db' does not exist"
```bash
# Create database
psql -U postgres -c "CREATE DATABASE groow_db OWNER groow_user;"
```

#### Error: "psql: could not connect to server"
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL if not running
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux
```

### Permission Issues

#### Error: "permission denied for schema public"
```sql
-- Grant schema permissions
GRANT ALL ON SCHEMA public TO groow_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO groow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO groow_user;
```

### Performance Issues

#### Enable Query Logging
In `.env`:
```
DATABASE_LOGGING=true
```

#### View Slow Queries
```sql
-- Enable slow query logging
ALTER DATABASE groow_db SET log_min_duration_statement = 1000;  -- Log queries > 1s

-- View running queries
SELECT pid, age(clock_timestamp(), query_start), usename, query 
FROM pg_stat_activity 
WHERE query != '<IDLE>' AND query NOT ILIKE '%pg_stat_activity%' 
ORDER BY query_start DESC;
```

---

## 📈 Database Monitoring

### Check Database Connections
```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'groow_db';
```

### View Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords
```bash
# Update .env with strong passwords
DATABASE_PASSWORD=<strong-random-password>
JWT_SECRET=<strong-random-secret>
```

### 2. Restrict Database Access
```sql
-- Revoke public access
REVOKE ALL ON DATABASE groow_db FROM PUBLIC;

-- Grant specific access only
GRANT CONNECT ON DATABASE groow_db TO groow_user;
```

### 3. Enable SSL (Production)
In `postgresql.conf`:
```
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

---

## 🚀 Production Deployment

### 1. Disable Auto-Sync
In `.env`:
```
DATABASE_SYNC=false
```

### 2. Use Migrations
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### 3. Connection Pooling
In production, use connection pooling:
```typescript
// In app.module.ts
TypeOrmModule.forRoot({
  ...config,
  extra: {
    max: 20,  // Maximum pool size
    min: 5,   // Minimum pool size
    connectionTimeoutMillis: 3000,
  },
})
```

### 4. Read Replicas (Optional)
For high-traffic applications, configure read replicas:
```typescript
TypeOrmModule.forRoot({
  ...config,
  replication: {
    master: {
      host: 'master.example.com',
      // ...
    },
    slaves: [{
      host: 'replica1.example.com',
      // ...
    }]
  }
})
```

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)

---

## ✅ Setup Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `groow_db` created
- [ ] User `groow_user` created with correct password
- [ ] Extensions (`uuid-ossp`, `pg_trgm`) installed
- [ ] Backend `.env` configured correctly
- [ ] Dependencies installed (`npm install`)
- [ ] Database seeded successfully (`npm run seed`)
- [ ] Backend server starts without errors (`npm run start:dev`)
- [ ] Can login as admin (admin@groow.com)
- [ ] Can login as vendor (vendor1@groow.com)
- [ ] Can login as customer (customer1@groow.com)

---

**Database setup complete!** 🎉

Your GROOW e-commerce platform is now ready for backend integration.

Next steps:
1. Start frontend: `cd frontend && npm run dev`
2. Test API endpoints: Visit https://nz-api.destinpq.com/api/v1
3. View API docs: Visit https://nz-api.destinpq.com/api/docs (if Swagger enabled)
