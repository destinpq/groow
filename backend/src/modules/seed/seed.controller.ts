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
      console.log('Database connection status:', this.dataSource.isInitialized);

      // First, try to create the table using synchronize
      console.log('🔄 Attempting to synchronize database schema...');
      await this.dataSource.synchronize(true); // true = drop existing tables
      
      console.log('✅ Database schema synchronized');

      // Create admin user
      console.log('🔄 Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      // Try using the repository first
      try {
        const existingAdmin = await this.userRepository.findOne({ 
          where: { email: 'admin@groow.com' } 
        });

        if (existingAdmin) {
          return {
            success: true,
            message: 'Admin user already exists',
            admin: {
              email: existingAdmin.email,
              role: existingAdmin.role,
              password: 'Admin@123456'
            }
          };
        }

        const admin = this.userRepository.create({
          email: 'admin@groow.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin' as any,
          status: 'active' as any,
          emailVerified: true
        });

        const savedAdmin = await this.userRepository.save(admin);
        
        console.log('✅ Admin user created via repository');

        return { 
          success: true,
          message: '🎉 Database setup complete!',
          admin: {
            id: savedAdmin.id,
            email: savedAdmin.email,
            role: savedAdmin.role,
            password: 'Admin@123456'
          },
          instructions: [
            '1. Go to https://groow.destinpq.com/login',
            '2. Login with: admin@groow.com / Admin@123456',
            '3. Your database is ready!'
          ]
        };

      } catch (repoError) {
        console.log('Repository approach failed, trying raw SQL...', repoError.message);
        
        // Fallback to raw SQL
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

        console.log('✅ Admin user created via raw SQL');

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
      }

    } catch (error) {
      console.error('❌ Database setup error:', error);
      return { 
        success: false,
        message: 'Database setup failed', 
        error: error.message,
        stack: error.stack,
        hint: 'This creates the basic users table and admin account from scratch.'
      };
    }
  }
}