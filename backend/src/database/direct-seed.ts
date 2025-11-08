import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

async function directSeed() {
  console.log('🚀 Direct PostgreSQL seeding...');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }
  
  console.log('📡 Database URL (masked):', databaseUrl.substring(0, 30) + '...');
  
  // Create PostgreSQL client directly
  const client = new Client({
    connectionString: databaseUrl,
    ssl: false
  });
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully!');
    
    // Drop and recreate users table
    console.log('🔄 Dropping existing users table...');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('🔄 Creating users table...');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'vendor', 'customer')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
        "emailVerified" BOOLEAN DEFAULT FALSE,
        "phoneVerified" BOOLEAN DEFAULT FALSE,
        "lastLogin" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created successfully!');
    
    // Create admin user
    console.log('🔄 Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    
    const result = await client.query(`
      INSERT INTO users (email, password, "firstName", "lastName", role, status, "emailVerified")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, role
    `, [
      'admin@groow.com',
      hashedPassword,
      'Admin',
      'User', 
      'admin',
      'active',
      true
    ]);
    
    console.log('✅ Admin user created successfully!');
    
    console.log('\n🎉 DATABASE SETUP COMPLETE!');
    console.log('========================================');
    console.log('Admin Login Credentials:');
    console.log('  Email: admin@groow.com');
    console.log('  Password: Admin@123456');
    console.log('========================================');
    console.log('You can now login at: https://groow.destinpq.com/login');
    
  } catch (error) {
    console.error('❌ Direct seeding failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

directSeed()
  .then(() => {
    console.log('✅ Direct seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Direct seeding failed:', error);
    process.exit(1);
  });