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
  @ApiOperation({ summary: 'Seed initial data with auto table creation' })
  async seed() {
    try {
      // Force create tables if they don't exist
      console.log('🔄 Synchronizing database schema...');
      await this.dataSource.synchronize();
      console.log('✅ Database schema synchronized');

      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@groow.com' }
      });

      if (existingAdmin) {
        return { message: 'Database already seeded', admin: existingAdmin.email };
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      const admin = this.userRepository.create({
        email: 'admin@groow.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      });

      await this.userRepository.save(admin);

      return { 
        message: '🎉 Database seeded successfully!',
        admin: {
          email: admin.email,
          role: admin.role,
          password: 'Admin@123456'
        },
        note: 'Tables created and admin user added. You can now login!'
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