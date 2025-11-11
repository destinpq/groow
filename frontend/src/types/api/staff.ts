import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse,
  UserRole 
} from './common';

// ================================
// STAFF ENTITY TYPES  
// ================================

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended'
}

export enum PermissionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve'
}

export enum DepartmentType {
  CUSTOMER_SERVICE = 'customer_service',
  SALES = 'sales',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  FINANCE = 'finance',
  IT = 'it',
  HR = 'hr'
}

export interface Permission extends BaseEntity {
  id: string;
  name: string;
  code: string;
  resource: string;
  action: PermissionType;
  description?: string;
  category: string;
  isActive: boolean;
}

export interface Role extends BaseEntity {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
  isDefault: boolean;
  level: number; // hierarchy level
  createdBy?: string;
  userCount?: number;
}

export interface Department extends BaseEntity {
  id: string;
  name: string;
  code: string;
  type: DepartmentType;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  isActive: boolean;
  manager?: StaffMember;
  staffCount: number;
  budget?: number;
}

export interface StaffMember extends BaseEntity {
  id: string;
  employeeId: string;
  userId: string;
  email: string;
  name: string;
  status: StaffStatus;
  roleId: string;
  departmentId?: string;
  managerId?: string;
  joinDate: Date;
  lastLoginAt?: Date;
  profile: {
    phone?: string;
    avatar?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  employment: {
    position: string;
    level: string;
    salary?: number;
    type: 'full_time' | 'part_time' | 'contract' | 'intern';
    reportingTo?: string;
  };
  performance: {
    rating?: number;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    goals?: string[];
  };
  role?: Role;
  department?: Department;
  manager?: StaffMember;
  isOnline: boolean;
  lastActiveAt?: Date;
}

export interface StaffSchedule extends BaseEntity {
  id: string;
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  status: 'scheduled' | 'working' | 'break' | 'completed' | 'absent';
  totalHours: number;
  actualHours?: number;
  overtime?: number;
  notes?: string;
}

export interface StaffAttendance extends BaseEntity {
  id: string;
  staffId: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  workHours?: number;
  overtime?: number;
  notes?: string;
  approvedBy?: string;
}

export interface LeaveRequest extends BaseEntity {
  id: string;
  staffId: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  documents?: string[];
  staff?: StaffMember;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  period: string;
  metrics: {
    tasksCompleted: number;
    ticketsResolved: number;
    customerRating: number;
    responseTime: number;
    accuracy: number;
    productivity: number;
  };
  goals: {
    target: string;
    progress: number;
    status: 'on_track' | 'behind' | 'ahead' | 'completed';
  }[];
  feedback: {
    strengths: string[];
    improvements: string[];
    overallRating: number;
  };
}

export interface StaffAnalytics {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  departments: {
    name: string;
    count: number;
    activeCount: number;
  }[];
  attendance: {
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
  };
  performance: {
    averageRating: number;
    topPerformers: { name: string; rating: number }[];
    improvement: { name: string; rating: number }[];
  };
  workload: {
    totalHours: number;
    overtime: number;
    averageHoursPerStaff: number;
  };
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateStaffRequest {
  employeeId: string;
  email: string;
  name: string;
  roleId: string;
  departmentId?: string;
  managerId?: string;
  joinDate: Date;
  profile: {
    phone?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  employment: {
    position: string;
    level: string;
    salary?: number;
    type: 'full_time' | 'part_time' | 'contract' | 'intern';
  };
}

export interface CreateStaffResponse {
  staff: StaffMember;
  credentials?: {
    email: string;
    temporaryPassword: string;
  };
  message: string;
}

export interface GetStaffResponse {
  staff: PaginatedResponse<StaffMember>;
  summary?: {
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
  };
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  permissionIds: string[];
  level?: number;
}

export interface CreateRoleResponse {
  role: Role;
  message: string;
}

export interface GetRolesResponse {
  roles: Role[];
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  type: DepartmentType;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
}

export interface CreateDepartmentResponse {
  department: Department;
  message: string;
}

export interface GetDepartmentsResponse {
  departments: Department[];
}

export interface CreateLeaveRequestRequest {
  staffId?: string; // optional for self-requests
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface CreateLeaveRequestResponse {
  leaveRequest: LeaveRequest;
  message: string;
}

export interface GetLeaveRequestsResponse {
  leaveRequests: PaginatedResponse<LeaveRequest>;
}

export interface ApproveLeaveRequest {
  approved: boolean;
  notes?: string;
}

export interface ApproveLeaveResponse {
  leaveRequest: LeaveRequest;
  message: string;
}

export interface RecordAttendanceRequest {
  staffId: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes?: string;
}

export interface RecordAttendanceResponse {
  attendance: StaffAttendance;
  message: string;
}

export interface GetAttendanceResponse {
  attendance: PaginatedResponse<StaffAttendance>;
  summary?: {
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
  };
}

export interface CreateScheduleRequest {
  staffId: string;
  schedules: {
    date: Date;
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
  }[];
}

export interface CreateScheduleResponse {
  schedules: StaffSchedule[];
  message: string;
}

// ================================
// FILTER TYPES
// ================================

export interface StaffFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: StaffStatus | StaffStatus[];
  departmentId?: string;
  roleId?: string;
  managerId?: string;
  search?: string;
  joinDateFrom?: Date;
  joinDateTo?: Date;
  isOnline?: boolean;
}

export interface AttendanceFilter {
  page?: number;
  limit?: number;
  staffId?: string;
  departmentId?: string;
  status?: ('present' | 'absent' | 'late' | 'half_day' | 'on_leave')[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface LeaveRequestFilter {
  page?: number;
  limit?: number;
  staffId?: string;
  type?: ('sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'emergency')[];
  status?: ('pending' | 'approved' | 'rejected')[];
  startDate?: Date;
  endDate?: Date;
  approvedBy?: string;
}

// ================================
// STAFF API INTERFACE
// ================================

export interface StaffAPI {
  // Staff Management
  createStaff(request: CreateStaffRequest): Promise<ApiResponse<CreateStaffResponse>>;
  getAllStaff(filter?: StaffFilter): Promise<ApiResponse<GetStaffResponse>>;
  getStaffById(id: string): Promise<ApiResponse<{ staff: StaffMember }>>;
  updateStaff(id: string, updates: Partial<CreateStaffRequest>): Promise<ApiResponse<CreateStaffResponse>>;
  deleteStaff(id: string): Promise<ApiResponse<{ message: string }>>;
  suspendStaff(id: string, reason: string): Promise<ApiResponse<{ staff: StaffMember }>>;
  activateStaff(id: string): Promise<ApiResponse<{ staff: StaffMember }>>;
  
  // Role Management
  createRole(request: CreateRoleRequest): Promise<ApiResponse<CreateRoleResponse>>;
  getAllRoles(): Promise<ApiResponse<GetRolesResponse>>;
  getRoleById(id: string): Promise<ApiResponse<{ role: Role }>>;
  updateRole(id: string, updates: Partial<CreateRoleRequest>): Promise<ApiResponse<CreateRoleResponse>>;
  deleteRole(id: string): Promise<ApiResponse<{ message: string }>>;
  assignRole(staffId: string, roleId: string): Promise<ApiResponse<{ staff: StaffMember }>>;
  
  // Permission Management
  getAllPermissions(): Promise<ApiResponse<{ permissions: Permission[] }>>;
  getPermissionsByCategory(): Promise<ApiResponse<{ categories: { [key: string]: Permission[] } }>>;
  
  // Department Management
  createDepartment(request: CreateDepartmentRequest): Promise<ApiResponse<CreateDepartmentResponse>>;
  getAllDepartments(): Promise<ApiResponse<GetDepartmentsResponse>>;
  getDepartmentById(id: string): Promise<ApiResponse<{ department: Department }>>;
  updateDepartment(id: string, updates: Partial<CreateDepartmentRequest>): Promise<ApiResponse<CreateDepartmentResponse>>;
  deleteDepartment(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Attendance Management
  recordAttendance(request: RecordAttendanceRequest): Promise<ApiResponse<RecordAttendanceResponse>>;
  getAttendance(filter?: AttendanceFilter): Promise<ApiResponse<GetAttendanceResponse>>;
  bulkRecordAttendance(attendanceRecords: RecordAttendanceRequest[]): Promise<ApiResponse<{ recorded: number; failed: number }>>;
  generateAttendanceReport(filter: AttendanceFilter): Promise<ApiResponse<{ reportUrl: string }>>;
  
  // Schedule Management
  createSchedule(request: CreateScheduleRequest): Promise<ApiResponse<CreateScheduleResponse>>;
  getSchedule(staffId: string, dateFrom: Date, dateTo: Date): Promise<ApiResponse<{ schedules: StaffSchedule[] }>>;
  updateSchedule(scheduleId: string, updates: Partial<StaffSchedule>): Promise<ApiResponse<{ schedule: StaffSchedule }>>;
  deleteSchedule(scheduleId: string): Promise<ApiResponse<{ message: string }>>;
  
  // Leave Management
  createLeaveRequest(request: CreateLeaveRequestRequest): Promise<ApiResponse<CreateLeaveRequestResponse>>;
  getLeaveRequests(filter?: LeaveRequestFilter): Promise<ApiResponse<GetLeaveRequestsResponse>>;
  getMyLeaveRequests(): Promise<ApiResponse<GetLeaveRequestsResponse>>;
  approveLeaveRequest(id: string, request: ApproveLeaveRequest): Promise<ApiResponse<ApproveLeaveResponse>>;
  cancelLeaveRequest(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Performance Management
  getStaffPerformance(staffId: string, period?: string): Promise<ApiResponse<{ performance: StaffPerformance }>>;
  updatePerformanceGoals(staffId: string, goals: string[]): Promise<ApiResponse<{ staff: StaffMember }>>;
  submitPerformanceReview(staffId: string, review: Partial<StaffPerformance>): Promise<ApiResponse<{ review: StaffPerformance }>>;
  
  // Analytics & Reports
  getStaffAnalytics(period?: string): Promise<ApiResponse<StaffAnalytics>>;
  getDepartmentAnalytics(departmentId?: string): Promise<ApiResponse<{
    department: Department;
    staffCount: number;
    attendanceRate: number;
    averagePerformance: number;
    workload: number;
  }>>;
  
  // Staff Directory
  getStaffDirectory(): Promise<ApiResponse<{
    staff: {
      id: string;
      name: string;
      position: string;
      department: string;
      email: string;
      phone?: string;
      isOnline: boolean;
    }[];
  }>>;
  
  // Organizational Chart
  getOrganizationalChart(): Promise<ApiResponse<{
    chart: {
      id: string;
      name: string;
      position: string;
      department: string;
      managerId?: string;
      subordinates: string[];
    }[];
  }>>;
}