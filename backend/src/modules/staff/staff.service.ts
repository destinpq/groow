import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { StaffRole } from './entities/staff-role.entity';
import { StaffRoleAssignment } from './entities/staff-role-assignment.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { NotificationService } from '@/modules/notification/notification.service';
import { parsePaginationParams, calculateSkip, createPaginationResult } from '@/common/utils/pagination.util';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(StaffRole)
    private roleRepository: Repository<StaffRole>,
    @InjectRepository(StaffRoleAssignment)
    private roleAssignmentRepository: Repository<StaffRoleAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
  ) {}

  // Staff HRMS (REQ-073)
  async getAllStaff(filters: any) {
    const { page, limit, search, department, status, role } = filters;
    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    
    const queryBuilder = this.staffRepository.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.user', 'user')
      .leftJoinAndSelect('staff.roleAssignments', 'roleAssignments')
      .leftJoinAndSelect('roleAssignments.role', 'role');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR staff.employeeId LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (department) {
      queryBuilder.andWhere('staff.department = :department', { department });
    }

    if (status) {
      queryBuilder.andWhere('staff.status = :status', { status });
    }

    if (role) {
      queryBuilder.andWhere('role.id = :role', { role });
    }

    const [staff, total] = await queryBuilder
      .orderBy('staff.createdAt', 'DESC')
      .skip(calculateSkip(pageNum, limitNum))
      .take(limitNum)
      .getManyAndCount();

    return {
      success: true,
      data: staff,
      pagination: createPaginationResult(total, pageNum, limitNum),
    };
  }

  async getStaffById(staffId: string) {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
      relations: ['user', 'roleAssignments', 'roleAssignments.role'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return {
      success: true,
      data: staff,
    };
  }

  async createStaff(staffData: any) {
    // Check if user exists
    let user = await this.userRepository.findOne({
      where: { email: staffData.email },
    });

    if (!user) {
      // Create new user account
      user = this.userRepository.create({
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        phone: staffData.phone,
        password: 'temp123!', // TODO: Generate random password and send via email
        role: 'STAFF' as any, // Using UserRole enum
        status: 'ACTIVE' as any, // Using UserStatus enum
        emailVerified: true,
      });
      await this.userRepository.save(user);
    }

    // Check if staff record already exists for this user
    const existingStaff = await this.staffRepository.findOne({
      where: { userId: user.id },
    });

    if (existingStaff) {
      throw new ConflictException('Staff record already exists for this user');
    }

    // Generate employee ID
    const employeeId = await this.generateEmployeeId(staffData.department);

    const staff = this.staffRepository.create({
      userId: user.id,
      employeeId,
      department: staffData.department,
      position: staffData.position,
      joinDate: staffData.joinDate || new Date(),
      status: 'active',
      salary: staffData.salary,
      employmentType: staffData.employmentType || 'full-time',
      reportingManagerId: staffData.reportingManagerId || '',
      benefits: staffData.benefits || {
        healthInsurance: true,
        paidLeave: 15,
        sickLeave: 10,
        bonus: false,
      },
      personalInfo: staffData.personalInfo || {
        address: staffData.address || '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        emergencyContact: staffData.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
        },
      },
      workSchedule: staffData.workSchedule || {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '17:00',
        timezone: 'UTC',
      },
      notes: staffData.notes,
    });

    await this.staffRepository.save(staff);

    // Assign default role if provided
    if (staffData.roleId) {
      await this.assignRole(staff.id, staffData.roleId, 'system');
    }

    // Send welcome notification
    await this.notificationService.sendPushNotification(
      user.id,
      'Welcome to the Team!',
      `Welcome to ${staffData.department}! Your employee ID is ${employeeId}.`
    );

    return {
      success: true,
      data: staff,
      message: 'Staff member created successfully',
    };
  }

  async updateStaff(staffId: string, updateData: any) {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
      relations: ['user'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Update user data if provided
    if (updateData.firstName || updateData.lastName || updateData.email || updateData.phone) {
      Object.assign(staff.user, {
        firstName: updateData.firstName || staff.user.firstName,
        lastName: updateData.lastName || staff.user.lastName,
        email: updateData.email || staff.user.email,
        phone: updateData.phone || staff.user.phone,
      });
      await this.userRepository.save(staff.user);
    }

    // Update staff data
    Object.assign(staff, {
      department: updateData.department || staff.department,
      position: updateData.position || staff.position,
      salary: updateData.salary || staff.salary,
      employmentType: updateData.employmentType || staff.employmentType,
      benefits: updateData.benefits || staff.benefits,
      personalInfo: updateData.personalInfo || staff.personalInfo,
      workSchedule: updateData.workSchedule || staff.workSchedule,
      notes: updateData.notes || staff.notes,
      status: updateData.status || staff.status,
    });

    if (updateData.exitDate) {
      staff.exitDate = updateData.exitDate;
      staff.status = 'terminated';
    }

    await this.staffRepository.save(staff);

    return {
      success: true,
      data: staff,
      message: 'Staff member updated successfully',
    };
  }

  async deleteStaff(staffId: string) {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Soft delete by marking as terminated
    staff.status = 'terminated';
    staff.exitDate = new Date();
    await this.staffRepository.save(staff);

    return {
      success: true,
      message: 'Staff member terminated successfully',
    };
  }

  async recordAttendance(staffId: string, attendanceData: any) {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = staff.attendance || {};
    
    if (!attendance[today]) {
      attendance[today] = {
        date: today,
        status: 'absent',
      };
    }

    attendance[today] = {
      ...attendance[today],
      ...attendanceData,
      date: today,
    };

    staff.attendance = attendance;
    await this.staffRepository.save(staff);

    return {
      success: true,
      data: attendance[today],
      message: 'Attendance recorded successfully',
    };
  }

  async getAttendanceReport(staffId: string, startDate: string, endDate: string) {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const attendance = staff.attendance || {};
    const attendanceData = [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      attendanceData.push({
        date: dateStr,
        ...(attendance[dateStr] || { status: 'absent' }),
      });
    }

    return {
      success: true,
      data: attendanceData,
    };
  }

  async updatePerformance(staffId: string, performanceData: any) {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const performance = staff.performance || {};
    const year = performanceData.year || new Date().getFullYear().toString();

    if (!performance[year]) {
      performance[year] = {
        year,
        rating: 0,
        goals: [],
        achievements: [],
        feedback: '',
        reviewer: '',
        reviewDate: '',
        updatedAt: new Date().toISOString(),
      };
    }

    performance[year] = {
      ...performance[year],
      ...performanceData,
      year,
      updatedAt: new Date().toISOString(),
    };

    staff.performance = performance;
    await this.staffRepository.save(staff);

    return {
      success: true,
      data: performance[year],
      message: 'Performance updated successfully',
    };
  }

  async getPayrollData(staffId: string, month: string, year: string) {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Calculate payroll based on salary and attendance
    const attendanceReport = await this.getAttendanceReport(
      staffId,
      `${year}-${month.padStart(2, '0')}-01`,
      `${year}-${month.padStart(2, '0')}-31`
    );

    const workingDays = attendanceReport.data.filter(
      day => day.status === 'present' || day.status === 'half-day'
    ).length;

    const halfDays = attendanceReport.data.filter(day => day.status === 'half-day').length;
    const totalDays = attendanceReport.data.length;
    const actualWorkingDays = workingDays - (halfDays * 0.5);

    const baseSalary = staff.salary || 0;
    const dailySalary = baseSalary / 30; // Assuming 30 days per month
    const grossSalary = dailySalary * actualWorkingDays;

    // Calculate deductions (mock calculations)
    const deductions = {
      tax: grossSalary * 0.1, // 10% tax
      insurance: grossSalary * 0.02, // 2% insurance
      other: 0,
    };

    const totalDeductions = Object.values(deductions).reduce((sum, amount) => sum + amount, 0);
    const netSalary = grossSalary - totalDeductions;

    const payroll = {
      staffId,
      month,
      year,
      baseSalary,
      workingDays: actualWorkingDays,
      totalDays,
      grossSalary,
      deductions,
      totalDeductions,
      netSalary,
      benefits: staff.benefits,
      generatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: payroll,
    };
  }

  async generatePayslip(staffId: string, month: string, year: string) {
    const payrollData = await this.getPayrollData(staffId, month, year);
    const staff = await this.getStaffById(staffId);

    const payslip = {
      ...payrollData.data,
      employeeDetails: {
        name: `${staff.data.user.firstName} ${staff.data.user.lastName}`,
        employeeId: staff.data.employeeId,
        department: staff.data.department,
        position: staff.data.position,
      },
    };

    return {
      success: true,
      data: payslip,
      message: 'Payslip generated successfully',
    };
  }

  // Role-Based Access Control (REQ-074)
  async getAllRoles() {
    const roles = await this.roleRepository.find({
      order: { name: 'ASC' },
    });

    return {
      success: true,
      data: roles,
    };
  }

  async createRole(roleData: any) {
    const existingRole = await this.roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.roleRepository.create({
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions || {},
      isActive: true,
    });

    await this.roleRepository.save(role);

    return {
      success: true,
      data: role,
      message: 'Role created successfully',
    };
  }

  async updateRole(roleId: string, updateData: any) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    Object.assign(role, {
      name: updateData.name || role.name,
      description: updateData.description || role.description,
      permissions: updateData.permissions || role.permissions,
      isActive: updateData.isActive !== undefined ? updateData.isActive : role.isActive,
    });

    await this.roleRepository.save(role);

    return {
      success: true,
      data: role,
      message: 'Role updated successfully',
    };
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if role is assigned to any staff
    const assignments = await this.roleAssignmentRepository.count({
      where: { roleId },
    });

    if (assignments > 0) {
      throw new BadRequestException('Cannot delete role that is assigned to staff members');
    }

    await this.roleRepository.remove(role);

    return {
      success: true,
      message: 'Role deleted successfully',
    };
  }

  async assignRole(staffId: string, roleId: string, assignedBy: string) {
    const [staff, role] = await Promise.all([
      this.staffRepository.findOne({ where: { id: staffId } }),
      this.roleRepository.findOne({ where: { id: roleId } }),
    ]);

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if assignment already exists
    const existingAssignment = await this.roleAssignmentRepository.findOne({
      where: { staffId, roleId },
    });

    if (existingAssignment) {
      throw new ConflictException('Role already assigned to this staff member');
    }

    const assignment = this.roleAssignmentRepository.create({
      staffId,
      roleId,
      assignedBy,
      assignedAt: new Date(),
      isActive: true,
    });

    await this.roleAssignmentRepository.save(assignment);

    return {
      success: true,
      data: assignment,
      message: 'Role assigned successfully',
    };
  }

  async revokeRole(staffId: string, roleId: string, revokedBy: string) {
    const assignment = await this.roleAssignmentRepository.findOne({
      where: { staffId, roleId, isActive: true },
    });

    if (!assignment) {
      throw new NotFoundException('Role assignment not found');
    }

    assignment.isActive = false;
    assignment.revokedBy = revokedBy;
    assignment.revokedAt = new Date();

    await this.roleAssignmentRepository.save(assignment);

    return {
      success: true,
      message: 'Role revoked successfully',
    };
  }

  async getStaffRoles(staffId: string) {
    const assignments = await this.roleAssignmentRepository.find({
      where: { staffId, isActive: true },
      relations: ['role'],
    });

    const roles = assignments.map(assignment => assignment.role);

    return {
      success: true,
      data: roles,
    };
  }

  async checkPermission(staffId: string, permission: string): Promise<boolean> {
    const roles = await this.getStaffRoles(staffId);
    
    return roles.data.some(role => 
      role.permissions && role.permissions[permission] === true
    );
  }

  async getStaffPermissions(staffId: string) {
    const roles = await this.getStaffRoles(staffId);
    const permissions = new Set<string>();

    roles.data.forEach(role => {
      if (role.permissions) {
        Object.keys(role.permissions).forEach(permission => {
          if (role.permissions[permission] === true) {
            permissions.add(permission);
          }
        });
      }
    });

    return {
      success: true,
      data: Array.from(permissions),
    };
  }

  // HRMS Analytics
  async getHRMSAnalytics(period: string) {
    const dateRange = this.getDateRange(period);
    
    // Staff statistics
    const staffStats = await this.staffRepository
      .createQueryBuilder('staff')
      .select([
        'COUNT(*) as totalStaff',
        'COUNT(CASE WHEN staff.status = :active THEN 1 END) as activeStaff',
        'COUNT(CASE WHEN staff.hireDate BETWEEN :start AND :end THEN 1 END) as newHires',
        'COUNT(CASE WHEN staff.terminationDate BETWEEN :start AND :end THEN 1 END) as terminations',
      ])
      .setParameters({
        active: 'active',
        start: dateRange.start,
        end: dateRange.end,
      })
      .getRawOne();

    // Department distribution
    const departmentStats = await this.staffRepository
      .createQueryBuilder('staff')
      .select(['staff.department as department', 'COUNT(*) as count'])
      .where('staff.status = :status', { status: 'active' })
      .groupBy('staff.department')
      .getRawMany();

    // Attendance overview (mock data for active staff)
    const activeStaff = await this.staffRepository.find({
      where: { status: 'active' },
    });

    let totalPresent = 0;
    let totalAbsent = 0;
    const today = new Date().toISOString().split('T')[0];

    activeStaff.forEach(staff => {
      const attendance = staff.attendance || {};
      const todayAttendance = attendance[today];
      
      if (todayAttendance?.status === 'present' || todayAttendance?.status === 'half-day') {
        totalPresent++;
      } else {
        totalAbsent++;
      }
    });

    return {
      success: true,
      data: {
        staff: staffStats,
        departments: departmentStats,
        attendance: {
          present: totalPresent,
          absent: totalAbsent,
          totalStaff: activeStaff.length,
          attendanceRate: activeStaff.length > 0 ? ((totalPresent / activeStaff.length) * 100).toFixed(1) : 0,
        },
        period,
      },
    };
  }

  async getDepartmentList() {
    const departments = [
      { id: 'admin', name: 'Administration', description: 'Administrative staff' },
      { id: 'customer_service', name: 'Customer Service', description: 'Customer support and service' },
      { id: 'finance', name: 'Finance & Accounting', description: 'Financial operations' },
      { id: 'it', name: 'Information Technology', description: 'IT support and development' },
      { id: 'marketing', name: 'Marketing', description: 'Marketing and promotions' },
      { id: 'operations', name: 'Operations', description: 'Business operations' },
      { id: 'warehouse', name: 'Warehouse', description: 'Inventory and logistics' },
      { id: 'hr', name: 'Human Resources', description: 'HR management' },
    ];

    return {
      success: true,
      data: departments,
    };
  }

  async getPositionList() {
    const positions = [
      { id: 'manager', name: 'Manager', level: 'senior' },
      { id: 'supervisor', name: 'Supervisor', level: 'mid' },
      { id: 'specialist', name: 'Specialist', level: 'mid' },
      { id: 'coordinator', name: 'Coordinator', level: 'mid' },
      { id: 'associate', name: 'Associate', level: 'junior' },
      { id: 'assistant', name: 'Assistant', level: 'junior' },
      { id: 'intern', name: 'Intern', level: 'entry' },
    ];

    return {
      success: true,
      data: positions,
    };
  }

  async getBenefitsTemplates() {
    const templates = [
      {
        id: 'standard',
        name: 'Standard Package',
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          visionInsurance: false,
          lifeInsurance: true,
          retirementPlan: true,
          paidTimeOff: 15,
          sickLeave: 10,
          parentalLeave: 12,
        },
      },
      {
        id: 'senior',
        name: 'Senior Package',
        benefits: {
          healthInsurance: true,
          dentalInsurance: true,
          visionInsurance: true,
          lifeInsurance: true,
          retirementPlan: true,
          paidTimeOff: 20,
          sickLeave: 15,
          parentalLeave: 16,
          carAllowance: true,
        },
      },
    ];

    return {
      success: true,
      data: templates,
    };
  }

  async exportStaffData(filters: any) {
    const staff = await this.getAllStaff({ ...filters, page: 1, limit: 10000 });
    
    // Format data for export
    const exportData = staff.data.map(member => ({
      employeeId: member.employeeId,
      name: `${member.user.firstName} ${member.user.lastName}`,
      email: member.user.email,
      department: member.department,
      position: member.position,
      joinDate: member.joinDate,
      status: member.status,
      salary: member.salary,
    }));

    return {
      success: true,
      data: exportData,
      message: 'Staff data exported successfully',
    };
  }

  private async generateEmployeeId(department: string): Promise<string> {
    const prefix = this.getDepartmentPrefix(department);
    const count = await this.staffRepository.count({
      where: { department },
    });

    return `${prefix}${String(count + 1).padStart(4, '0')}`;
  }

  private getDepartmentPrefix(department: string): string {
    const prefixes = {
      admin: 'ADM',
      customer_service: 'CS',
      finance: 'FIN',
      it: 'IT',
      marketing: 'MKT',
      operations: 'OPS',
      warehouse: 'WH',
      hr: 'HR',
    };

    return prefixes[department] || 'EMP';
  }

  private getDateRange(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start: startDate, end: now };
  }
}