import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const loadJSON = (filename: string) => {
  const filePath = path.join(__dirname, 'seeds', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('📂 Loading seed data from JSON files...');
    const usersData = loadJSON('users.json');
    const categoriesData = loadJSON('categories.json');
    const brandsData = loadJSON('brands.json');
    const vendorsData = loadJSON('vendors.json');
    const customersData = loadJSON('customers.json');
    const dealsData = loadJSON('deals.json');
    const couponsData = loadJSON('coupons.json');
    const promotionsData = loadJSON('promotions.json');
    console.log('✅ JSON files loaded\n');

    console.log('🏷️  Clearing existing data...');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    await dataSource.query('TRUNCATE TABLE categories CASCADE');
    await dataSource.query('TRUNCATE TABLE brands CASCADE');
    await dataSource.query('TRUNCATE TABLE deals CASCADE');
    await dataSource.query('TRUNCATE TABLE coupons CASCADE');
    await dataSource.query('TRUNCATE TABLE promotions CASCADE');
    console.log('✅ Data cleared\n');

    console.log('👤 Creating users...');
    const userIdMap = new Map();
    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await dataSource.query(
        'INSERT INTO users (email, password, role, "firstName", "lastName", status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [user.email, hashedPassword, user.role, user.firstName, user.lastName, user.isActive ? 'active' : 'pending']
      );
      userIdMap.set(user.email, result[0].id);
    }
    console.log(`✅ Created ${usersData.length} users\n`);

    console.log('📁 Creating categories...');
    for (const category of categoriesData) {
      await dataSource.query(
        'INSERT INTO categories (name, slug, description, icon, image, "isActive", "sortOrder") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [category.name, category.slug, category.description, category.icon, category.image || null, category.isActive, category.displayOrder || 0]
      );
    }
    console.log(`✅ Created ${categoriesData.length} categories\n`);

    console.log('🏷️  Creating brands...');
    for (const brand of brandsData) {
      await dataSource.query(
        'INSERT INTO brands (name, slug, description, logo, website, "isActive") VALUES ($1, $2, $3, $4, $5, $6)',
        [brand.name, brand.slug, brand.description, brand.logo || null, brand.website || null, brand.isActive]
      );
    }
    console.log(`✅ Created ${brandsData.length} brands\n`);

    console.log('🏪 Creating vendors...');
    let vendorCount = 0;
    for (const vendor of vendorsData) {
      const userId = userIdMap.get(vendor.userEmail);
      if (userId) {
        await dataSource.query(
          'INSERT INTO vendors ("userId", "businessName", city, state, country, pincode, "verificationStatus") VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, vendor.businessName, vendor.city || null, vendor.state || null, vendor.country || null, vendor.postalCode || null, vendor.verificationStatus]
        );
        vendorCount++;
      }
    }
    console.log(`✅ Created ${vendorCount} vendors\n`);

    console.log('👥 Creating customers...');
    let customerCount = 0;
    for (const customer of customersData) {
      const userId = userIdMap.get(customer.userEmail);
      if (userId) {
        await dataSource.query('INSERT INTO customers ("userId") VALUES ($1)', [userId]);
        customerCount++;
      }
    }
    console.log(`✅ Created ${customerCount} customers\n`);

    console.log('🎯 Creating deals...');
    let dealCount = 0;
    const adminUserId = userIdMap.get('admin@groow.com');
    for (const deal of dealsData) {
      await dataSource.query(
        `INSERT INTO deals (
          title, description, "dealType", "discountRules", conditions, 
          "startDate", "endDate", "isActive", "isFeatured", "usageLimit", 
          banner, targeting, analytics, tags, "createdById"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          deal.title,
          deal.description, 
          deal.dealType,
          JSON.stringify(deal.discountRules),
          JSON.stringify(deal.conditions),
          deal.startDate,
          deal.endDate,
          deal.isActive,
          deal.isFeatured || false,
          deal.usageLimit || null,
          JSON.stringify(deal.banner),
          JSON.stringify(deal.targeting),
          JSON.stringify(deal.analytics),
          JSON.stringify(deal.tags || []),
          adminUserId
        ]
      );
      dealCount++;
    }
    console.log(`✅ Created ${dealCount} deals\n`);

    console.log('🎫 Creating coupons...');
    let couponCount = 0;
    for (const coupon of couponsData) {
      await dataSource.query(
        `INSERT INTO coupons (
          code, name, description, type, "discountValue", conditions, 
          "validFrom", "validUntil", "isActive", "usageLimit", "usageLimitPerCustomer", 
          generation, distribution, analytics, tags, "createdById"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          coupon.code,
          coupon.name,
          coupon.description,
          coupon.type,
          JSON.stringify(coupon.discountValue),
          JSON.stringify(coupon.conditions),
          coupon.validFrom,
          coupon.validUntil,
          coupon.isActive,
          coupon.usageLimit,
          coupon.usageLimitPerCustomer,
          JSON.stringify(coupon.generation),
          JSON.stringify(coupon.distribution),
          JSON.stringify(coupon.analytics),
          JSON.stringify(coupon.tags || []),
          adminUserId
        ]
      );
      couponCount++;
    }
    console.log(`✅ Created ${couponCount} coupons\n`);

    console.log('📢 Creating promotions...');
    let promotionCount = 0;
    for (const promotion of promotionsData) {
      await dataSource.query(
        `INSERT INTO promotions (
          name, description, type, status, campaign, content, 
          scheduling, targeting, rules, "associatedDeals", "associatedCoupons", 
          budget, "abTesting", tags, metrics, "createdById"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          promotion.name,
          promotion.description,
          promotion.type,
          promotion.status,
          JSON.stringify(promotion.campaign),
          JSON.stringify(promotion.content),
          JSON.stringify(promotion.scheduling),
          JSON.stringify(promotion.targeting),
          JSON.stringify(promotion.rules),
          JSON.stringify(promotion.associatedDeals),
          JSON.stringify(promotion.associatedCoupons),
          promotion.budget,
          JSON.stringify(promotion.abTesting),
          JSON.stringify(promotion.tags || []),
          JSON.stringify(promotion.metrics),
          adminUserId
        ]
      );
      promotionCount++;
    }
    console.log(`✅ Created ${promotionCount} promotions\n`);

    console.log('========================================');
    console.log('✅ Database seeding completed!');
    console.log('========================================\n');
    console.log('📋 Summary:');
    console.log(`  ✓ ${usersData.length} Users`);
    console.log(`  ✓ ${categoriesData.length} Categories`);
    console.log(`  ✓ ${brandsData.length} Brands`);
    console.log(`  ✓ ${vendorCount} Vendors`);
    console.log(`  ✓ ${customerCount} Customers`);
    console.log(`  ✓ ${dealCount} Deals`);
    console.log(`  ✓ ${couponCount} Coupons`);
    console.log(`  ✓ ${promotionCount} Promotions`);
    console.log('\n📝 Login Credentials:');
    console.log('  Admin:     admin@groow.com / Admin@123456');
    console.log('  Vendors:   vendor1-5@groow.com / Vendor@123456');
    console.log('  Customers: customer1-10@groow.com / Customer@123456');
    console.log('\n📸 All images included in seed data!');
    console.log('');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed()
  .then(() => {
    console.log('🎉 Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
