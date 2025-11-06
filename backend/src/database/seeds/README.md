# Database Seed Data Files

This directory contains JSON seed data files for all major tables in the Groow e-commerce platform.

## 📁 Available Seed Files

### Core Tables
- **users.json** - User accounts (admin, vendors, customers) with credentials
- **vendors.json** - Vendor business information with logos and banner images
- **customers.json** - Customer profiles with avatar images and contact information

### Product Catalog
- **categories.json** - Product categories with images, icons and descriptions
- **brands.json** - Brand information with company logos
- **products.json** - Product listings with multiple images and detailed specifications
- **product-reviews.json** - Customer product reviews and ratings

### Content Management
- **pages.json** - CMS pages (About, Terms, Privacy, etc.)
- **banners.json** - Marketing banners with images for homepage and sidebars
- **faqs.json** - Frequently asked questions with categories

### Transactions
- **orders.json** - Sample customer orders with different statuses
- **rfqs.json** - Request for Quotation samples
- **notifications.json** - System and user notifications

## 🎨 Image Assets

All visual assets included for realistic demo data:
- **Vendors**: Logo URLs and banner images from Unsplash
- **Customers**: Avatar images from Pravatar (diverse profile photos)
- **Categories**: Category-specific images from Unsplash
- **Brands**: Company logos from Clearbit
- **Products**: 2-3 product images per item from Unsplash
- **Banners**: Marketing images with proper sizing

## 🚀 Usage

### Using the JSON Seeder Script

You can create a TypeScript seeder that reads these JSON files and populates the database:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

async function seedFromJSON() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  // Read JSON files
  const usersData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds/users.json'), 'utf-8')
  );
  
  // Process and insert data
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    // Insert user...
  }
  
  await app.close();
}
```

### Manual Import

Each JSON file can be imported individually using:

```bash
# PostgreSQL COPY command
psql -d groow_db -c "\copy users FROM 'users.json' CSV HEADER"

# Or use a database GUI tool like pgAdmin, DBeaver, etc.
```

## 📋 Data Structure

### users.json
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "role": "admin|vendor|customer",
  "firstName": "First",
  "lastName": "Last",
  "isActive": true
}
```

### products.json
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "sku": "SKU-CODE",
  "vendorEmail": "vendor@example.com",
  "categorySlug": "category-slug",
  "brandSlug": "brand-slug",
  "basePrice": 99.99,
  "salePrice": 79.99,
  "stockQuantity": 100,
  "images": ["url1", "url2"],
  "specifications": [{"key": "Feature", "value": "Value"}]
}
```

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@groow.com
- **Password:** Admin@123456

### Vendor Accounts (5 vendors)
- **Email:** vendor1@groow.com to vendor5@groow.com
- **Password:** Vendor@123456

### Customer Accounts (10 customers)
- **Email:** customer1@groow.com to customer10@groow.com
- **Password:** Customer@123456

## 📊 Data Relationships

The seed files maintain referential integrity through:

1. **Email References**: Users are referenced by email in vendors.json and customers.json
2. **Slug References**: Categories, brands, and products use slugs for lookups
3. **Status Values**: Use predefined enum values (pending, active, delivered, etc.)

## ⚠️ Important Notes

1. **Passwords**: All passwords in users.json are plain text and must be hashed using bcrypt before insertion
2. **UUIDs**: Primary keys will be auto-generated; don't include IDs in JSON
3. **Timestamps**: createdAt and updatedAt will be auto-managed by TypeORM
4. **Foreign Keys**: Ensure referenced entities exist before inserting dependent data

## 🔄 Seeding Order

To maintain referential integrity, seed in this order:

1. users.json
2. vendors.json and customers.json
3. categories.json and brands.json
4. products.json
5. product-reviews.json
6. pages.json, banners.json, faqs.json
7. orders.json
8. rfqs.json
9. notifications.json

## 🛠️ Customization

Feel free to modify these JSON files to add more data or change existing values:

- Add more products by copying existing entries
- Create new categories and brands
- Add customer reviews for better testing
- Modify prices and inventory levels

## 📝 License

These seed files are part of the Groow e-commerce platform.
