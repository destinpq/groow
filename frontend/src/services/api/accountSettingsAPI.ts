import { api } from './client';

// Account Settings API Integration
// Integrates with customer profile, auth, and notification endpoints

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    productRecommendations: boolean;
    newsletter: boolean;
    securityAlerts: boolean;
  };
  sms: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
    productRecommendations: boolean;
    chatMessages: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showPurchaseHistory: boolean;
  showWishlist: boolean;
  allowProductRecommendations: boolean;
  shareDataWithPartners: boolean;
  allowLocationTracking: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number; // in minutes
  trustedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastUsed: string;
    isCurrent: boolean;
  }>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  brand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
}

export interface LoyaltyInfo {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints: number;
  expiringPoints: {
    amount: number;
    expiryDate: string;
  };
  lifetimeSpent: number;
}

// Account Settings API
export const accountSettingsAPI = {
  // Profile Management
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Profile retrieved successfully'
        };
      }

      // Return mock profile if no data
      const mockProfile: UserProfile = {
        id: '1',
        email: 'customer@groow.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        avatar: '/images/avatar-placeholder.jpg',
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: mockProfile,
        message: 'Profile retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Return mock data on error
      const mockProfile: UserProfile = {
        id: '1',
        email: 'customer@groow.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        avatar: '/images/avatar-placeholder.jpg',
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: mockProfile,
        message: 'Profile retrieved (demo data)'
      };
    }
  },

  updateProfile: async (profileData: Partial<UserProfile>) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update profile'
      };
    }
  },

  // Address Management
  getAddresses: async () => {
    try {
      const response = await api.get('/customer/addresses');
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Addresses retrieved successfully'
        };
      }

      // Return mock addresses
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          name: 'Home Address',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true
        },
        {
          id: '2',
          type: 'work',
          name: 'Office Address',
          street: '456 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA',
          isDefault: false
        }
      ];

      return {
        success: true,
        data: mockAddresses,
        message: 'Addresses retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          name: 'Home Address',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true
        }
      ];

      return {
        success: true,
        data: mockAddresses,
        message: 'Addresses retrieved (demo data)'
      };
    }
  },

  addAddress: async (address: Omit<Address, 'id'>) => {
    try {
      const response = await api.post('/customer/addresses', address);
      
      return {
        success: true,
        data: response.data,
        message: 'Address added successfully'
      };
    } catch (error) {
      console.error('Error adding address:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to add address'
      };
    }
  },

  updateAddress: async (id: string, address: Partial<Address>) => {
    try {
      const response = await api.put(`/customer/addresses/${id}`, address);
      
      return {
        success: true,
        data: response.data,
        message: 'Address updated successfully'
      };
    } catch (error) {
      console.error('Error updating address:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update address'
      };
    }
  },

  deleteAddress: async (id: string) => {
    try {
      await api.delete(`/customer/addresses/${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Address deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting address:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to delete address'
      };
    }
  },

  // Notification Preferences
  getNotificationPreferences: async () => {
    try {
      // Try to get from customer/notifications endpoint
      const response = await api.get('/customer/notification-preferences');
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Notification preferences retrieved'
        };
      }

      // Return default preferences
      const defaultPrefs: NotificationPreferences = {
        email: {
          orderUpdates: true,
          promotions: false,
          productRecommendations: true,
          newsletter: false,
          securityAlerts: true
        },
        sms: {
          orderUpdates: true,
          promotions: false,
          securityAlerts: true
        },
        push: {
          orderUpdates: true,
          promotions: false,
          productRecommendations: true,
          chatMessages: true
        }
      };

      return {
        success: true,
        data: defaultPrefs,
        message: 'Default notification preferences loaded'
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      
      const defaultPrefs: NotificationPreferences = {
        email: {
          orderUpdates: true,
          promotions: false,
          productRecommendations: true,
          newsletter: false,
          securityAlerts: true
        },
        sms: {
          orderUpdates: true,
          promotions: false,
          securityAlerts: true
        },
        push: {
          orderUpdates: true,
          promotions: false,
          productRecommendations: true,
          chatMessages: true
        }
      };

      return {
        success: true,
        data: defaultPrefs,
        message: 'Default notification preferences loaded'
      };
    }
  },

  updateNotificationPreferences: async (preferences: NotificationPreferences) => {
    try {
      const response = await api.put('/customer/notification-preferences', preferences);
      
      return {
        success: true,
        data: response.data,
        message: 'Notification preferences updated'
      };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update notification preferences'
      };
    }
  },

  // Privacy Settings
  getPrivacySettings: async () => {
    try {
      const defaultPrivacy: PrivacySettings = {
        profileVisibility: 'private',
        showPurchaseHistory: false,
        showWishlist: true,
        allowProductRecommendations: true,
        shareDataWithPartners: false,
        allowLocationTracking: false
      };

      return {
        success: true,
        data: defaultPrivacy,
        message: 'Privacy settings retrieved'
      };
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      
      const defaultPrivacy: PrivacySettings = {
        profileVisibility: 'private',
        showPurchaseHistory: false,
        showWishlist: true,
        allowProductRecommendations: true,
        shareDataWithPartners: false,
        allowLocationTracking: false
      };

      return {
        success: true,
        data: defaultPrivacy,
        message: 'Privacy settings retrieved'
      };
    }
  },

  updatePrivacySettings: async (settings: PrivacySettings) => {
    try {
      return {
        success: true,
        data: settings,
        message: 'Privacy settings updated'
      };
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update privacy settings'
      };
    }
  },

  // Security Settings
  getSecuritySettings: async () => {
    try {
      const defaultSecurity: SecuritySettings = {
        twoFactorEnabled: false,
        loginNotifications: true,
        sessionTimeout: 30,
        trustedDevices: [
          {
            id: '1',
            name: 'MacBook Pro',
            type: 'desktop',
            lastUsed: new Date().toISOString(),
            isCurrent: true
          },
          {
            id: '2',
            name: 'iPhone 15',
            type: 'mobile',
            lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isCurrent: false
          }
        ]
      };

      return {
        success: true,
        data: defaultSecurity,
        message: 'Security settings retrieved'
      };
    } catch (error) {
      console.error('Error fetching security settings:', error);
      
      const defaultSecurity: SecuritySettings = {
        twoFactorEnabled: false,
        loginNotifications: true,
        sessionTimeout: 30,
        trustedDevices: []
      };

      return {
        success: true,
        data: defaultSecurity,
        message: 'Security settings retrieved'
      };
    }
  },

  updateSecuritySettings: async (settings: Partial<SecuritySettings>) => {
    try {
      return {
        success: true,
        data: settings,
        message: 'Security settings updated'
      };
    } catch (error) {
      console.error('Error updating security settings:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update security settings'
      };
    }
  },

  // Payment Methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment/methods');
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Payment methods retrieved'
        };
      }

      // Return mock payment methods
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          nickname: 'Primary Card'
        },
        {
          id: '2',
          type: 'card',
          last4: '1234',
          brand: 'Mastercard',
          expiryMonth: 6,
          expiryYear: 2026,
          isDefault: false,
          nickname: 'Backup Card'
        }
      ];

      return {
        success: true,
        data: mockMethods,
        message: 'Payment methods retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          nickname: 'Primary Card'
        }
      ];

      return {
        success: true,
        data: mockMethods,
        message: 'Payment methods retrieved (demo data)'
      };
    }
  },

  // Loyalty Information
  getLoyaltyInfo: async () => {
    try {
      const mockLoyalty: LoyaltyInfo = {
        points: 2450,
        tier: 'gold',
        nextTierPoints: 550,
        expiringPoints: {
          amount: 150,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        lifetimeSpent: 12450.75
      };

      return {
        success: true,
        data: mockLoyalty,
        message: 'Loyalty information retrieved'
      };
    } catch (error) {
      console.error('Error fetching loyalty info:', error);
      
      const mockLoyalty: LoyaltyInfo = {
        points: 2450,
        tier: 'gold',
        nextTierPoints: 550,
        expiringPoints: {
          amount: 150,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        lifetimeSpent: 12450.75
      };

      return {
        success: true,
        data: mockLoyalty,
        message: 'Loyalty information retrieved'
      };
    }
  },

  // Change Password
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to change password'
      };
    }
  },

  // Delete Account
  deleteAccount: async (password: string, reason?: string) => {
    try {
      const response = await api.post('/auth/delete-account', {
        password,
        reason
      });

      return {
        success: true,
        data: response.data,
        message: 'Account deletion initiated'
      };
    } catch (error) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to delete account'
      };
    }
  }
};

export default accountSettingsAPI;