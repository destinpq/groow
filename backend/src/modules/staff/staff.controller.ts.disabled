import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Staff Management')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Staff HRMS Module (REQ-073)
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all staff members' })
  async getAllStaff(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('department') department?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.staffService.getAllStaff({
      page: Number(page),
      limit: Number(limit),
      department,
      status,
      search,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get staff member details' })
  async getStaffById(@Param('id') id: string) {
    return this.staffService.getStaffById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Add new staff member' })
  async createStaff(
    @Body() staffData: {
      userId: string;
      employeeId: string;
      department: string;
      position: string;
      reportingManagerId: string;
      salary: number;
      employmentType: string;
      joinDate: string;
      personalInfo: any;
      workSchedule: any;
      benefits: any;
    },
  ) {
    return this.staffService.createStaff(staffData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update staff member' })
  async updateStaff(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.staffService.updateStaff(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate staff member' })
  async deactivateStaff(
    @Param('id') id: string,
    @Body() deactivationData: { exitDate: string; reason: string },
  ) {
    return this.staffService.deactivateStaff(id, deactivationData.exitDate, deactivationData.reason);
  }

  @Get('departments/list')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all departments' })
  async getDepartments() {
    return this.staffService.getDepartments();
  }

  @Get(':id/performance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get staff performance metrics' })
  async getStaffPerformance(
    @Param('id') id: string,
    @Query('period') period: string = '30d',
  ) {
    return this.staffService.getStaffPerformance(id, period);
  }

  @Post(':id/leave')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Apply for leave' })
  async applyLeave(
    @Param('id') id: string,
    @Body() leaveData: {
      type: string;
      startDate: string;
      endDate: string;
      reason: string;
    },
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.staffService.applyLeave(id, leaveData, currentUserId);
  }

  // Role-based Access Control (REQ-074)
  @Get('roles/list')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all staff roles' })
  async getAllRoles() {
    return this.staffService.getAllRoles();
  }

  @Post('roles')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new staff role' })
  async createRole(
    @Body() roleData: {
      name: string;
      description: string;
      permissions: any;
    },
  ) {
    return this.staffService.createRole(roleData);
  }

  @Put('roles/:roleId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update staff role' })
  async updateRole(
    @Param('roleId') roleId: string,
    @Body() updateData: any,
  ) {
    return this.staffService.updateRole(roleId, updateData);
  }

  @Post(':staffId/roles/:roleId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign role to staff' })
  async assignRole(
    @Param('staffId') staffId: string,
    @Param('roleId') roleId: string,
    @Body() assignmentData: {
      expiryDate?: string;
      notes?: string;
    },
    @CurrentUser('id') assignedBy: string,
  ) {
    return this.staffService.assignRole(staffId, roleId, assignedBy, assignmentData);
  }

  @Delete(':staffId/roles/:roleId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove role from staff' })
  async removeRole(
    @Param('staffId') staffId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.staffService.removeRole(staffId, roleId);
  }

  @Get(':staffId/permissions')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get staff permissions' })
  async getStaffPermissions(@Param('staffId') staffId: string) {
    return this.staffService.getStaffPermissions(staffId);
  }

  @Get('analytics/overview')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get staff analytics overview' })
  async getStaffAnalytics(
    @Query('period') period: string = '30d',
  ) {
    return this.staffService.getStaffAnalytics(period);
  }

  @Get('payroll/summary')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get payroll summary' })
  async getPayrollSummary(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.staffService.getPayrollSummary(month, year);
  }

  @Post('attendance/checkin')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Staff check-in' })
  async checkIn(
    @CurrentUser('id') userId: string,
    @Body() checkInData: {
      location?: string;
      notes?: string;
    },
  ) {
    return this.staffService.checkIn(userId, checkInData);
  }

  @Post('attendance/checkout')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Staff check-out' })
  async checkOut(
    @CurrentUser('id') userId: string,
    @Body() checkOutData: {
      notes?: string;
    },
  ) {
    return this.staffService.checkOut(userId, checkOutData);
  }
}