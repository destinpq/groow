import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '@/modules/auth/entities/user.entity';
import { UserRole, UserStatus } from '@/common/enums';
import { parsePaginationParams, calculateSkip, createPaginationResult } from '@/common/utils/pagination.util';

interface UserFilter {
  role?: UserRole;
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(filters: UserFilter) {
    try {
      const { role, page, limit, status } = filters;
      const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
      
      // Build where conditions
      const whereConditions: any = {};
      if (role) {
        whereConditions.role = role;
      }
      if (status) {
        whereConditions.status = status;
      }

      // Use findAndCount for proper pagination
      const [users, total] = await this.userRepository.findAndCount({
        where: whereConditions,
        order: { createdAt: 'DESC' },
        skip: calculateSkip(pageNum, limitNum),
        take: limitNum,
      });

      return {
        success: true,
        data: users,
        pagination: createPaginationResult(total, pageNum, limitNum),
      };
    } catch (error) {
      console.error('Error in getUsers:', error);
      return {
        success: false,
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        error: error.message,
      };
    }
  }

  async getUserStats() {
    const [totalUsers, totalAdmins, totalVendors, totalCustomers, activeUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.userRepository.count({ where: { role: UserRole.VENDOR } }),
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalVendors,
        totalCustomers,
        activeUsers,
        recentRegistrations: await this.getRecentRegistrations(),
      },
    };
  }

  private async getRecentRegistrations() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.userRepository.count({
      where: {
        createdAt: MoreThanOrEqual(thirtyDaysAgo),
      },
    });
  }
}