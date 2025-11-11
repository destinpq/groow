-- GROOW Database Schema Fix
-- This script will create all missing tables to match TypeORM entities

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's fix the users table by adding missing columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "resetPasswordToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" VARCHAR(255);

-- Ensure users table has all BaseEntity columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP,
ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Update users table to use UUID if not already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    -- Create new users table with UUID and migrate data
    CREATE TABLE users_new (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "firstName" VARCHAR(100),
      "lastName" VARCHAR(100),
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'vendor', 'customer')),
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
      "profileImage" VARCHAR(500),
      "lastLoginAt" TIMESTAMP,
      "resetPasswordToken" VARCHAR(255),
      "resetPasswordExpires" TIMESTAMP,
      "emailVerified" BOOLEAN DEFAULT FALSE,
      "emailVerificationToken" VARCHAR(255),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "deletedAt" TIMESTAMP
    );
    
    -- Copy data from old table
    INSERT INTO users_new (email, password, "firstName", "lastName", phone, role, status, "emailVerified", "createdAt", "updatedAt")
    SELECT email, password, "firstName", "lastName", phone, role, status, "emailVerified", "createdAt", "updatedAt"
    FROM users;
    
    -- Drop old table and rename new one
    DROP TABLE users;
    ALTER TABLE users_new RENAME TO users;
  END IF;
END $$;

-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  icon VARCHAR(500),
  "parentId" UUID,
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  seo JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("parentId") REFERENCES categories(id)
);

-- Create Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(500),
  "isActive" BOOLEAN DEFAULT TRUE,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);

-- Create Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "businessName" VARCHAR(255) UNIQUE NOT NULL,
  "businessRegistrationNumber" VARCHAR(100),
  "gstNumber" VARCHAR(100),
  "panNumber" VARCHAR(100),
  "businessAddress" TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  pincode VARCHAR(20),
  "verificationStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("verificationStatus" IN ('pending', 'verified', 'rejected')),
  "kycDocuments" JSONB,
  "commissionRate" DECIMAL(5,2) DEFAULT 0.00,
  "walletBalance" DECIMAL(10,2) DEFAULT 0.00,
  "totalSales" DECIMAL(12,2) DEFAULT 0.00,
  "averageRating" DECIMAL(3,2) DEFAULT 0.00,
  "ratingCount" INTEGER DEFAULT 0,
  "isSubscribed" BOOLEAN DEFAULT FALSE,
  "subscriptionExpiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "companyName" VARCHAR(255),
  "shippingAddresses" JSONB,
  "walletBalance" DECIMAL(10,2) DEFAULT 0.00,
  "cashbackBalance" DECIMAL(10,2) DEFAULT 0.00,
  preferences JSONB,
  "gstNumber" VARCHAR(100),
  "isSubscribed" BOOLEAN DEFAULT FALSE,
  "subscriptionExpiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  "shortDescription" TEXT,
  sku VARCHAR(100) NOT NULL,
  "vendorId" UUID NOT NULL,
  "categoryId" UUID,
  "subcategoryId" UUID,
  "brandId" UUID,
  "basePrice" DECIMAL(10,2) NOT NULL,
  "salePrice" DECIMAL(10,2),
  "stockQuantity" INTEGER DEFAULT 0,
  "minOrderQuantity" INTEGER DEFAULT 1,
  images JSONB,
  "videoUrl" VARCHAR(500),
  variants JSONB,
  specifications JSONB,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  "reviewCount" INTEGER DEFAULT 0,
  "viewCount" INTEGER DEFAULT 0,
  "salesCount" INTEGER DEFAULT 0,
  seo JSONB,
  "isActive" BOOLEAN DEFAULT TRUE,
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("vendorId") REFERENCES vendors(id),
  FOREIGN KEY ("categoryId") REFERENCES categories(id),
  FOREIGN KEY ("brandId") REFERENCES brands(id)
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderNumber" VARCHAR(100) UNIQUE NOT NULL,
  "customerId" UUID NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  "shippingCost" DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  "paymentStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'refunded')),
  "paymentMethod" VARCHAR(50) CHECK ("paymentMethod" IN ('cod', 'online', 'wallet', 'card')),
  "shippingAddress" JSONB NOT NULL,
  "billingAddress" JSONB,
  "trackingNumber" VARCHAR(100),
  "courierName" VARCHAR(100),
  "deliveredAt" TIMESTAMP,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("customerId") REFERENCES customers(id)
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  "paymentMethod" VARCHAR(50) CHECK ("paymentMethod" IN ('cod', 'online', 'wallet', 'card')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  "transactionId" VARCHAR(255),
  "gatewayResponse" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES orders(id),
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Create Wallet Transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  type VARCHAR(50) CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  "balanceBefore" DECIMAL(10,2) NOT NULL,
  "balanceAfter" DECIMAL(10,2) NOT NULL,
  "referenceType" VARCHAR(50),
  "referenceId" VARCHAR(255),
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- Create Product Reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" UUID NOT NULL,
  "customerId" UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSONB,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "isApproved" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES products(id),
  FOREIGN KEY ("customerId") REFERENCES customers(id)
);

-- Create Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "productId" UUID NOT NULL,
  "variantId" VARCHAR(255),
  quantity INTEGER NOT NULL DEFAULT 1,
  "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id),
  FOREIGN KEY ("productId") REFERENCES products(id)
);

-- Create Wishlist Items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "productId" UUID NOT NULL,
  "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id),
  FOREIGN KEY ("productId") REFERENCES products(id)
);

-- Create RFQ table
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "rfqNumber" VARCHAR(100) UNIQUE NOT NULL,
  "customerId" UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "productCategory" VARCHAR(255),
  "targetPrice" DECIMAL(10,2),
  quantity INTEGER NOT NULL,
  "deliveryLocation" VARCHAR(255),
  "expectedDeliveryDate" DATE,
  attachments JSONB,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  "quotationCount" INTEGER DEFAULT 0,
  "selectedQuotationId" UUID,
  "expiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("customerId") REFERENCES customers(id)
);

-- Create Quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "rfqId" UUID NOT NULL,
  "vendorId" UUID NOT NULL,
  "quotedPrice" DECIMAL(10,2) NOT NULL,
  "deliveryTimeline" VARCHAR(255),
  notes TEXT,
  attachments JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  "validUntil" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("rfqId") REFERENCES rfqs(id),
  FOREIGN KEY ("vendorId") REFERENCES vendors(id)
);

-- Create CMS Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  "metaTitle" VARCHAR(255),
  "metaDescription" TEXT,
  "metaKeywords" TEXT[],
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);

-- Create Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  "subtitle" VARCHAR(255),
  image VARCHAR(500) NOT NULL,
  "mobileImage" VARCHAR(500),
  "linkUrl" VARCHAR(500),
  "linkText" VARCHAR(100),
  position VARCHAR(50) DEFAULT 'hero' CHECK (position IN ('hero', 'sidebar', 'footer')),
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "startsAt" TIMESTAMP,
  "endsAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);

-- Create Uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  path VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  "uploadedBy" UUID NOT NULL,
  "entityType" VARCHAR(50),
  "entityId" UUID,
  metadata JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP,
  FOREIGN KEY ("uploadedBy") REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products("vendorId");
CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId");
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders("customerId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO groow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO groow_user;

-- Update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updatedAt column
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT t.table_name 
        FROM information_schema.tables t
        JOIN information_schema.columns c ON t.table_name = c.table_name
        WHERE t.table_schema = 'public' 
        AND c.column_name = 'updatedAt'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', table_name, table_name);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                       BEFORE UPDATE ON %s 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', table_name, table_name);
    END LOOP;
END $$;

COMMIT;