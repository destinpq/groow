import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserRole, UserStatus } from '../../common/enums';
import * as bcrypt from 'bcrypt';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Seed initial data' })
  async seed() {
    try {
      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@groow.com' }
      });

      if (existingAdmin) {
        return { message: 'Database already seeded', admin: existingAdmin.email };
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
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
        message: 'Database seeded successfully',
        admin: {
          email: admin.email,
          role: admin.role,
          password: 'admin123'
        }
      };
    } catch (error) {
      return { 
        message: 'Seeding failed', 
        error: error.message 
      };
    }
  }
}