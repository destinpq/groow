import request from '@/utils/request';

// ============================================
// DIGITAL DOWNLOADS API
// Comprehensive API service for digital product downloads
// ============================================

// Type Definitions
export type DigitalProductType = 'software' | 'ebook' | 'music' | 'video' | 'course' | 'template' | 'plugin' | 'theme';
export type DownloadStatus = 'available' | 'expired' | 'limit_reached' | 'pending';
export type LicenseStatus = 'active' | 'expired' | 'revoked' | 'suspended';

export interface DigitalProduct {
  id: number;
  name: string;
  type: DigitalProductType;
  description?: string;
  orderId: number;
  orderDate: string;
  purchasePrice: number;
  
  // Download Information
  downloadLimit: number;
  downloadCount: number;
  downloadUrl: string;
  fileSize: string;
  fileName: string;
  
  // Version Information
  version: string;
  latestVersion?: string;
  updateAvailable: boolean;
  
  // License Information
  licenseKey?: string;
  licenseType?: 'single' | 'multi' | 'unlimited' | 'subscription';
  activationLimit?: number;
  activationCount?: number;
  
  // Expiry Information
  expiryDate?: string;
  isLifetime: boolean;
  daysRemaining?: number;
  
  // Status
  status: DownloadStatus;
  licenseStatus?: LicenseStatus;
  
  // Additional Information
  documentation?: string;
  supportUrl?: string;
  changelogUrl?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface DownloadHistory {
  id: number;
  productId: number;
  productName: string;
  downloadDate: string;
  ipAddress: string;
  userAgent: string;
  fileVersion: string;
  downloadSize: string;
  downloadDuration?: number;
  status: 'completed' | 'failed' | 'cancelled';
}

export interface LicenseActivation {
  id: number;
  productId: number;
  productName: string;
  licenseKey: string;
  activationDate: string;
  deviceName?: string;
  deviceId?: string;
  ipAddress: string;
  status: 'active' | 'deactivated';
  lastUsed?: string;
}

export interface DownloadStats {
  totalProducts: number;
  totalDownloads: number;
  totalSize: string;
  activeProducts: number;
  expiredProducts: number;
  expiringProducts: number;
  availableDownloads: number;
}

export interface ProductUpdate {
  productId: number;
  productName: string;
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  changelogUrl?: string;
  downloadUrl: string;
  fileSize: string;
  isCritical: boolean;
}

export interface CreateDownloadRequest {
  productId: number;
  version?: string;
  reason?: string;
}

export interface VerifyLicenseRequest {
  licenseKey: string;
  productId?: number;
}

export interface ActivateLicenseRequest {
  productId: number;
  licenseKey: string;
  deviceName?: string;
  deviceId?: string;
}

export interface DeactivateLicenseRequest {
  activationId: number;
  reason?: string;
}

// API Service
export const digitalDownloadsAPI = {
  // Get all digital products for the current user
  getMyDigitalProducts: async (): Promise<DigitalProduct[]> => {
    const response = await request.get('/customer/digital-products');
    return response.data;
  },

  // Get a specific digital product by ID
  getDigitalProduct: async (id: number): Promise<DigitalProduct> => {
    const response = await request.get(`/customer/digital-products/${id}`);
    return response.data;
  },

  // Get digital products by order ID
  getProductsByOrder: async (orderId: number): Promise<DigitalProduct[]> => {
    const response = await request.get(`/customer/orders/${orderId}/digital-products`);
    return response.data;
  },

  // Create a new download (initiate download process)
  createDownload: async (data: CreateDownloadRequest): Promise<{ downloadUrl: string; expiresAt: string }> => {
    const response = await request.post('/customer/digital-products/download', data);
    return response.data;
  },

  // Get download history
  getDownloadHistory: async (productId?: number): Promise<DownloadHistory[]> => {
    const url = productId 
      ? `/customer/digital-products/download-history?productId=${productId}`
      : '/customer/digital-products/download-history';
    const response = await request.get(url);
    return response.data;
  },

  // Get download statistics
  getDownloadStats: async (): Promise<DownloadStats> => {
    const response = await request.get('/customer/digital-products/stats');
    return response.data;
  },

  // Verify license key
  verifyLicense: async (data: VerifyLicenseRequest): Promise<{ valid: boolean; product?: DigitalProduct; message: string }> => {
    const response = await request.post('/customer/digital-products/verify-license', data);
    return response.data;
  },

  // Activate license on a device
  activateLicense: async (data: ActivateLicenseRequest): Promise<LicenseActivation> => {
    const response = await request.post('/customer/digital-products/activate-license', data);
    return response.data;
  },

  // Deactivate license from a device
  deactivateLicense: async (data: DeactivateLicenseRequest): Promise<{ success: boolean }> => {
    const response = await request.post('/customer/digital-products/deactivate-license', data);
    return response.data;
  },

  // Get license activations for a product
  getLicenseActivations: async (productId: number): Promise<LicenseActivation[]> => {
    const response = await request.get(`/customer/digital-products/${productId}/activations`);
    return response.data;
  },

  // Check for product updates
  checkForUpdates: async (productId?: number): Promise<ProductUpdate[]> => {
    const url = productId
      ? `/customer/digital-products/updates?productId=${productId}`
      : '/customer/digital-products/updates';
    const response = await request.get(url);
    return response.data;
  },

  // Download product update
  downloadUpdate: async (productId: number, version: string): Promise<{ downloadUrl: string; expiresAt: string }> => {
    const response = await request.post(`/customer/digital-products/${productId}/update`, { version });
    return response.data;
  },

  // Request product support
  requestSupport: async (productId: number, message: string): Promise<{ ticketId: number }> => {
    const response = await request.post(`/customer/digital-products/${productId}/support`, { message });
    return response.data;
  },

  // Report download issue
  reportIssue: async (productId: number, issue: string, details: string): Promise<{ reportId: number }> => {
    const response = await request.post(`/customer/digital-products/${productId}/report-issue`, { issue, details });
    return response.data;
  },

  // Get product documentation
  getDocumentation: async (productId: number): Promise<{ url: string; content?: string }> => {
    const response = await request.get(`/customer/digital-products/${productId}/documentation`);
    return response.data;
  },

  // Get product changelog
  getChangelog: async (productId: number): Promise<Array<{ version: string; releaseDate: string; changes: string[] }>> => {
    const response = await request.get(`/customer/digital-products/${productId}/changelog`);
    return response.data;
  },

  // Resend license key via email
  resendLicenseKey: async (productId: number): Promise<{ success: boolean; message: string }> => {
    const response = await request.post(`/customer/digital-products/${productId}/resend-license`);
    return response.data;
  },

  // Get product by license key
  getProductByLicense: async (licenseKey: string): Promise<DigitalProduct> => {
    const response = await request.get(`/customer/digital-products/by-license/${licenseKey}`);
    return response.data;
  },

  // Refresh download links (for expired links)
  refreshDownloadLink: async (productId: number): Promise<{ downloadUrl: string; expiresAt: string }> => {
    const response = await request.post(`/customer/digital-products/${productId}/refresh-link`);
    return response.data;
  },
};

export default digitalDownloadsAPI;
