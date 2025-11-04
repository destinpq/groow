import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Clear existing data (optional - comment out for production)
    console.log('🗑️  Clearing existing data...');
    await dataSource.query('TRUNCATE TABLE "user" CASCADE');
    await dataSource.query('TRUNCATE TABLE "category" CASCADE');
    await dataSource.query('TRUNCATE TABLE "brand" CASCADE');
    await dataSource.query('TRUNCATE TABLE "product" CASCADE');
    console.log('✅ Existing data cleared\n');

    // Seed Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    await dataSource.query(`
      INSERT INTO "user" (id, email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'admin@groow.com',
        '${hashedPassword}',
        'admin',
        'Admin',
        'User',
        true,
        NOW(),
        NOW()
      )
    `);
    console.log('✅ Admin user created (admin@groow.com / Admin@123456)\n');

    // Seed Categories
    console.log('📁 Creating categories...');
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', icon: 'laptop' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', icon: 'shopping-bag' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies', icon: 'home' },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear', icon: 'trophy' },
      { name: 'Books & Media', slug: 'books-media', description: 'Books, music, movies, and games', icon: 'book' },
      { name: 'Toys & Games', slug: 'toys-games', description: 'Toys and games for all ages', icon: 'gift' },
      { name: 'Health & Beauty', slug: 'health-beauty', description: 'Health and beauty products', icon: 'heart' },
      { name: 'Automotive', slug: 'automotive', description: 'Auto parts and accessories', icon: 'car' },
    ];

    for (const category of categories) {
      await dataSource.query(`
        INSERT INTO "category" (id, name, slug, description, icon, "isActive", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          '${category.name}',
          '${category.slug}',
          '${category.description}',
          '${category.icon}',
          true,
          NOW(),
          NOW()
        )
      `);
    }
    console.log(`✅ Created ${categories.length} categories\n`);

    // Seed Brands
    console.log('🏷️  Creating brands...');
    const brands = [
      { name: 'Apple', slug: 'apple', description: 'Premium technology products' },
      { name: 'Samsung', slug: 'samsung', description: 'Electronics and appliances' },
      { name: 'Nike', slug: 'nike', description: 'Sports apparel and footwear' },
      { name: 'Adidas', slug: 'adidas', description: 'Sportswear and accessories' },
      { name: 'Sony', slug: 'sony', description: 'Electronics and entertainment' },
      { name: 'LG', slug: 'lg', description: 'Home appliances and electronics' },
      { name: 'Dell', slug: 'dell', description: 'Computers and technology' },
      { name: 'HP', slug: 'hp', description: 'Computing and printing solutions' },
      { name: 'Canon', slug: 'canon', description: 'Cameras and imaging' },
      { name: 'Nikon', slug: 'nikon', description: 'Photography equipment' },
    ];

    for (const brand of brands) {
      await dataSource.query(`
        INSERT INTO "brand" (id, name, slug, description, "isActive", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          '${brand.name}',
          '${brand.slug}',
          '${brand.description}',
          true,
          NOW(),
          NOW()
        )
      `);
    }
    console.log(`✅ Created ${brands.length} brands\n`);

    // Seed Sample Vendors
    console.log('🏪 Creating sample vendors...');
    const vendorPassword = await bcrypt.hash('Vendor@123456', 10);
    
    for (let i = 1; i <= 5; i++) {
      const vendorUserId = await dataSource.query(`
        INSERT INTO "user" (id, email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          'vendor${i}@groow.com',
          '${vendorPassword}',
          'vendor',
          'Vendor',
          '${i}',
          true,
          NOW(),
          NOW()
        )
        RETURNING id
      `);

      await dataSource.query(`
        INSERT INTO "vendor" (id, "userId", "businessName", "businessType", "verificationStatus", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          '${vendorUserId[0].id}',
          'Vendor Store ${i}',
          'retail',
          'verified',
          NOW(),
          NOW()
        )
      `);
    }
    console.log('✅ Created 5 sample vendors (vendor1@groow.com to vendor5@groow.com / Vendor@123456)\n');

    // Seed Sample Customers
    console.log('👥 Creating sample customers...');
    const customerPassword = await bcrypt.hash('Customer@123456', 10);
    
    for (let i = 1; i <= 10; i++) {
      const customerUserId = await dataSource.query(`
        INSERT INTO "user" (id, email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          'customer${i}@groow.com',
          '${customerPassword}',
          'customer',
          'Customer',
          '${i}',
          true,
          NOW(),
          NOW()
        )
        RETURNING id
      `);

      await dataSource.query(`
        INSERT INTO "customer" (id, "userId", phone, "dateOfBirth", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          '${customerUserId[0].id}',
          '+1234567890${i}',
          '1990-01-01',
          NOW(),
          NOW()
        )
      `);
    }
    console.log('✅ Created 10 sample customers (customer1@groow.com to customer10@groow.com / Customer@123456)\n');

    console.log('========================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('========================================\n');
    console.log('📋 Summary:');
    console.log('  ✓ 1 Admin user');
    console.log('  ✓ 8 Categories');
    console.log('  ✓ 10 Brands');
    console.log('  ✓ 5 Vendors');
    console.log('  ✓ 10 Customers');
    console.log('\n📝 Login Credentials:');
    console.log('  Admin:    admin@groow.com / Admin@123456');
    console.log('  Vendors:  vendor1-5@groow.com / Vendor@123456');
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
