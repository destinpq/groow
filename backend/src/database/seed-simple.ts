import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

// Load JSON seed files
const loadJSON = (filename: string) => {
  const filePath = path.join(__dirname, 'seeds', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Load JSON data
    console.log('📂 Loading seed data from JSON files...');
    const usersData = loadJSON('users.json');
    const categoriesData = loadJSON('categories.json');
    const brandsData = loadJSON('brands.json');
    console.log('✅ JSON files loaded\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    await dataSource.query('TRUNCATE TABLE categories CASCADE');
    await dataSource.query('TRUNCATE TABLE brands CASCADE');
    console.log('✅ Data cleared\n');

    // 1. Seed Users
    console.log('👤 Creating users...');
    const userIdMap = new Map();
    
    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await dataSource.query(`
        INSERT INTO users (email, password, role, "firstName", "lastName", status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [user.email, hashedPassword, user.role, user.firstName, user.lastName, user.isActive ? 'active' : 'pending']);
      
      userIdMap.set(user.email, result[0].id);
    }
    console.log(`✅ Created ${usersData.length} users\n`);

    // 2. Seed Categories
    console.log('📁 Creating categories...');
    for (const category of categoriesData) {
      await dataSource.query(`
        INSERT INTO categories (name, slug, description, icon, image, "isActive", "sortOrder")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        category.name,
        category.slug,
        category.description,
        category.icon,
        category.image || null,
        category.isActive,
        category.displayOrder || 0
      ]);
    }
    console.log(`✅ Created ${categoriesData.length} categories\n`);

    // 3. Seed Brands
    console.log('🏷️  Creating brands...');
    for (const brand of brandsData) {
      await dataSource.query(`
        INSERT INTO brands (name, slug, description, logo, website, "isActive")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        brand.name,
        brand.slug,
        brand.description,
        brand.logo || null,
        brand.website || null,
        brand.isActive
      ]);
    }
    console.log(`✅ Created ${brandsData.length} brands\n`);

    // 4. Seed Vendors
    console.log('🏪 Creating vendors...');
    const vendorsData = loadJSON('vendors.json');
    let vendorCount = 0;
    
    for (const vendor of vendorsData) {
      const userId = userIdMap.get(vendor.userEmail);
      if (!userId) {
        console.warn(`⚠️  User not found: ${vendor.userEmail}`);
        continue;
      }

      await dataSource.query(`
        INSERT INTO vendors ("userId", "businessName", city, state, country, pincode, "verificationStatus")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        userId,
        vendor.businessName,
        vendor.city || null,
        vendor.state || null,
        vendor.country || null,
        vendor.postalCode || null,
        vendor.verificationStatus
      ]);
      vendorCount++;
    }
    console.log(`✅ Created ${vendorCount} vendors\n`);

    // 5. Seed Customers  
    console.log('👥 Creating customers...');
    const customersData = loadJSON('customers.json');
    let customerCount = 0;
    
    for (const customer of customersData) {
      const userId = userIdMap.get(customer.userEmail);
      if (!userId) {
        console.warn(`⚠️  User not found: ${customer.userEmail}`);
        continue;
      }

      await dataSource.query(`
        INSERT INTO customers ("userId")
        VALUES ($1)
      `, [userId]);
      customerCount++;
    }
    console.log(`✅ Created ${customerCount} customers\n`);

    console.log('========================================');
    console.log('✅ Database seeding completed!');
    console.log('========================================\n');
    console.log('📋 Summary:');
    console.log(`  ✓ ${usersData.length} Users`);
    console.log(`  ✓ ${categoriesData.length} Categories`);
    console.log(`  ✓ ${brandsData.length} Brands`);
    console.log(`  ✓ ${vendorCount} Vendors`);
    console.log(`  ✓ ${customerCount} Customers`);
    console.log('\n📝 Login Credentials:');
    console.log('  Admin:     admin@groow.com / Admin@123456');
    console.log('  Vendors:   vendor1-5@groow.com / Vendor@123456');
    console.log('  Customers: customer1-10@groow.com / Customer@123456');
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
