import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserRole, UserStatus } from '../../common/enums';
import * as bcrypt from 'bcrypt';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Seed initial data with manual table creation' })
  async seed() {
    try {
      console.log('🚀 Starting database setup...');

      // Drop table if exists and recreate
      console.log('🔄 Dropping existing users table...');
      await this.dataSource.query('DROP TABLE IF EXISTS users CASCADE');
      
      // Create users table from scratch
      console.log('🔄 Creating users table...');
      await this.dataSource.query(`
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
      console.log('✅ Users table created');

      // Create admin user
      console.log('🔄 Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      const result = await this.dataSource.query(`
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

      console.log('✅ Admin user created');

      return { 
        success: true,
        message: '🎉 Database setup complete!',
        admin: {
          id: result[0].id,
          email: result[0].email,
          role: result[0].role,
          password: 'Admin@123456'
        },
        instructions: [
          '1. Go to https://groow.destinpq.com/login',
          '2. Login with: admin@groow.com / Admin@123456',
          '3. Your database is ready!'
        ]
      };
    } catch (error) {
      console.error('❌ Database setup error:', error);
      return { 
        success: false,
        message: 'Database setup failed', 
        error: error.message,
        hint: 'This creates the basic users table and admin account from scratch.'
      };
    }
  }
}