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
      // Create users table if it doesn't exist
      console.log('🔄 Creating users table...');
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          "firstName" VARCHAR(255),
          "lastName" VARCHAR(255),
          role VARCHAR(50) DEFAULT 'customer',
          status VARCHAR(50) DEFAULT 'pending',
          "emailVerified" BOOLEAN DEFAULT FALSE,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table ready');

      // Check if admin already exists
      const result = await this.dataSource.query('SELECT * FROM users WHERE email = $1', ['admin@groow.com']);

      if (result.length > 0) {
        return { 
          message: 'Database already seeded', 
          admin: result[0].email,
          note: 'Admin user already exists - you can login!'
        };
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      await this.dataSource.query(`
        INSERT INTO users (email, password, "firstName", "lastName", role, status, "emailVerified")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'admin@groow.com',
        hashedPassword,
        'Admin',
        'User', 
        'admin',
        'active',
        true
      ]);

      return { 
        message: '🎉 Database seeded successfully!',
        admin: {
          email: 'admin@groow.com',
          role: 'admin',
          password: 'Admin@123456'
        },
        note: 'Tables created and admin user added. You can now login at groow.destinpq.com!'
      };
    } catch (error) {
      console.error('❌ Seeding error:', error);
      return { 
        message: 'Seeding failed', 
        error: error.message 
      };
    }
  }
}