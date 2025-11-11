/**
 * User Management API Services
 * Admin functionality for managing customers, vendors, and staff
 */
import { api } from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin' | 'staff';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  permissions?: string[];
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: string;
  company?: string;
  jobTitle?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    marketing: boolean;
    sms: boolean;
    language: string;
    currency: string;
    timezone: string;
  };
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'vendor' | 'staff';
  password?: string;
  sendWelcomeEmail?: boolean;
  permissions?: string[];
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'customer' | 'vendor' | 'staff';
  status?: 'active' | 'inactive' | 'suspended' | 'banned';
  permissions?: string[];
  profile?: Partial<UserProfile>;
}

export interface UserFilter {
  role?: 'customer' | 'vendor' | 'admin' | 'staff';
  status?: 'active' | 'inactive' | 'suspended' | 'banned';
  emailVerified?: boolean;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  search?: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  verifiedUsers: number;
  twoFactorUsers: number;
}

export const userManagementAPI = {
  /**
   * Get users with filtering and pagination
   */
  getUsers: async (
    page: number = 1,
    limit: number = 20,
    filters: UserFilter = {}
  ): Promise<UserListResponse> => {
    const { data } = await api.get('/admin/users', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
  },

  /**
   * Create new user
   */
  createUser: async (userData: CreateUserData): Promise<User> => {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },

  /**
   * Update user
   */
  updateUser: async (userId: string, updateData: UpdateUserData): Promise<User> => {
    const { data } = await api.put(`/admin/users/${userId}`, updateData);
    return data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  /**
   * Suspend user
   */
  suspendUser: async (userId: string, reason: string, duration?: number): Promise<User> => {
    const { data } = await api.post(`/admin/users/${userId}/suspend`, {
      reason,
      duration,
    });
    return data;
  },

  /**
   * Unsuspend user
   */
  unsuspendUser: async (userId: string): Promise<User> => {
    const { data } = await api.post(`/admin/users/${userId}/unsuspend`);
    return data;
  },

  /**
   * Ban user
   */
  banUser: async (userId: string, reason: string): Promise<User> => {
    const { data } = await api.post(`/admin/users/${userId}/ban`, { reason });
    return data;
  },

  /**
   * Unban user
   */
  unbanUser: async (userId: string): Promise<User> => {
    const { data } = await api.post(`/admin/users/${userId}/unban`);
    return data;
  },

  /**
   * Reset user password
   */
  resetPassword: async (userId: string, sendEmail: boolean = true) => {
    const { data } = await api.post(`/admin/users/${userId}/reset-password`, {
      sendEmail,
    });
    return data;
  },

  /**
   * Force email verification
   */
  verifyEmail: async (userId: string): Promise<User> => {
    const { data } = await api.post(`/admin/users/${userId}/verify-email`);
    return data;
  },

  /**
   * Get user activity log
   */
  getUserActivity: async (userId: string, limit: number = 50): Promise<UserActivity[]> => {
    const { data } = await api.get(`/admin/users/${userId}/activity`, {
      params: { limit },
    });
    return data;
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<UserStats> => {
    const { data } = await api.get('/admin/users/stats');
    return data;
  },

  /**
   * Search users
   */
  searchUsers: async (query: string, limit: number = 10): Promise<User[]> => {
    const { data } = await api.get('/admin/users/search', {
      params: { query, limit },
    });
    return data;
  },

  /**
   * Export users
   */
  exportUsers: async (format: 'csv' | 'xlsx', filters: UserFilter = {}) => {
    const { data } = await api.get('/admin/users/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Bulk update users
   */
  bulkUpdateUsers: async (userIds: string[], updateData: Partial<UpdateUserData>) => {
    const { data } = await api.put('/admin/users/bulk-update', {
      userIds,
      updateData,
    });
    return data;
  },

  /**
   * Bulk delete users
   */
  bulkDeleteUsers: async (userIds: string[]): Promise<void> => {
    await api.post('/admin/users/bulk-delete', { userIds });
  },

  /**
   * Send message to user
   */
  sendMessage: async (userId: string, subject: string, message: string) => {
    const { data } = await api.post(`/admin/users/${userId}/message`, {
      subject,
      message,
    });
    return data;
  },

  /**
   * Get user permissions
   */
  getUserPermissions: async (userId: string): Promise<string[]> => {
    const { data } = await api.get(`/admin/users/${userId}/permissions`);
    return data;
  },

  /**
   * Update user permissions
   */
  updateUserPermissions: async (userId: string, permissions: string[]): Promise<void> => {
    await api.put(`/admin/users/${userId}/permissions`, { permissions });
  },

  /**
   * Get user sessions
   */
  getUserSessions: async (userId: string) => {
    const { data } = await api.get(`/admin/users/${userId}/sessions`);
    return data;
  },

  /**
   * Terminate user session
   */
  terminateSession: async (userId: string, sessionId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}/sessions/${sessionId}`);
  },

  /**
   * Get user orders
   */
  getUserOrders: async (userId: string, page: number = 1, limit: number = 10) => {
    const { data } = await api.get(`/admin/users/${userId}/orders`, {
      params: { page, limit },
    });
    return data;
  },
};

export default userManagementAPI;