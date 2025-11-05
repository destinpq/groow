import apiClient from './client';

// ============================================================================
// Interfaces
// ============================================================================

export interface ReturnRequest {
  id: string;
  rmaNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  reasonCategory: 'defective' | 'wrong-item' | 'not-as-described' | 'damaged' | 'unwanted' | 'other';
  condition: 'unopened' | 'opened' | 'defective' | 'damaged';
  refundAmount: number;
  restockingFee?: number;
  status: 'pending' | 'approved' | 'rejected' | 'received' | 'inspected' | 'refunded' | 'completed' | 'cancelled';
  requestDate: string;
  approvedDate?: string;
  receivedDate?: string;
  inspectedDate?: string;
  refundedDate?: string;
  completedDate?: string;
  refundMethod: 'original-payment' | 'store-credit' | 'exchange' | 'bank-transfer';
  notes?: string;
  adminNotes?: string;
  images?: string[];
  trackingNumber?: string;
  approvedBy?: string;
  inspectedBy?: string;
  refundedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnRequestDto {
  orderId: string;
  productId: string;
  quantity: number;
  reason: string;
  reasonCategory: ReturnRequest['reasonCategory'];
  condition: ReturnRequest['condition'];
  refundMethod: ReturnRequest['refundMethod'];
  notes?: string;
  images?: string[];
}

export interface UpdateReturnRequestDto {
  status?: ReturnRequest['status'];
  refundAmount?: number;
  restockingFee?: number;
  refundMethod?: ReturnRequest['refundMethod'];
  notes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  approvedBy?: string;
  inspectedBy?: string;
  refundedBy?: string;
}

export interface ReturnFilters {
  status?: ReturnRequest['status'];
  reasonCategory?: ReturnRequest['reasonCategory'];
  refundMethod?: ReturnRequest['refundMethod'];
  customerId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReturnStats {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  completedReturns: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
  returnRate: number; // percentage
  topReturnReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
}

export interface ReturnTimeline {
  id: string;
  returnId: string;
  action: string;
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

export interface RefundDto {
  returnId: string;
  refundAmount: number;
  refundMethod: ReturnRequest['refundMethod'];
  notes?: string;
  refundedBy: string;
}

export interface InspectionDto {
  returnId: string;
  condition: ReturnRequest['condition'];
  approved: boolean;
  refundAmount: number;
  restockingFee?: number;
  notes: string;
  inspectedBy: string;
}

// ============================================================================
// Returns API
// ============================================================================

export const returnsAPI = {
  // Return Requests CRUD
  getReturnRequests: (filters?: ReturnFilters) => {
    return apiClient.get<{
      returns: ReturnRequest[];
      total: number;
      page: number;
      limit: number;
    }>('/returns', { params: filters });
  },

  getReturnRequestById: (id: string) => {
    return apiClient.get<ReturnRequest>(`/returns/${id}`);
  },

  getReturnByRmaNumber: (rmaNumber: string) => {
    return apiClient.get<ReturnRequest>(`/returns/rma/${rmaNumber}`);
  },

  createReturnRequest: (data: CreateReturnRequestDto) => {
    return apiClient.post<ReturnRequest>('/returns', data);
  },

  updateReturnRequest: (id: string, data: UpdateReturnRequestDto) => {
    return apiClient.patch<ReturnRequest>(`/returns/${id}`, data);
  },

  deleteReturnRequest: (id: string) => {
    return apiClient.delete(`/returns/${id}`);
  },

  // Return Status Management
  approveReturn: (id: string, approvedBy: string, notes?: string) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/approve`, { approvedBy, notes });
  },

  rejectReturn: (id: string, reason: string, rejectedBy: string) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/reject`, { reason, rejectedBy });
  },

  markAsReceived: (id: string, receivedBy: string, trackingNumber?: string) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/received`, { receivedBy, trackingNumber });
  },

  inspectReturn: (id: string, data: InspectionDto) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/inspect`, data);
  },

  processRefund: (data: RefundDto) => {
    return apiClient.post<ReturnRequest>(`/returns/${data.returnId}/refund`, data);
  },

  completeReturn: (id: string, completedBy: string) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/complete`, { completedBy });
  },

  cancelReturn: (id: string, reason: string, cancelledBy: string) => {
    return apiClient.post<ReturnRequest>(`/returns/${id}/cancel`, { reason, cancelledBy });
  },

  // Return Timeline
  getReturnTimeline: (returnId: string) => {
    return apiClient.get<ReturnTimeline[]>(`/returns/${returnId}/timeline`);
  },

  // Statistics
  getReturnStats: (startDate?: string, endDate?: string) => {
    return apiClient.get<ReturnStats>('/returns/stats', {
      params: { startDate, endDate },
    });
  },

  // Customer Returns
  getCustomerReturns: (customerId: string) => {
    return apiClient.get<ReturnRequest[]>(`/returns/customer/${customerId}`);
  },

  // Bulk Operations
  bulkApproveReturns: (ids: string[], approvedBy: string) => {
    return apiClient.post('/returns/bulk/approve', { ids, approvedBy });
  },

  bulkRejectReturns: (ids: string[], reason: string, rejectedBy: string) => {
    return apiClient.post('/returns/bulk/reject', { ids, reason, rejectedBy });
  },

  bulkDeleteReturns: (ids: string[]) => {
    return apiClient.delete('/returns/bulk', { data: { ids } });
  },

  // RMA Label
  generateRmaLabel: (returnId: string) => {
    return apiClient.get(`/returns/${returnId}/label`, {
      responseType: 'blob',
    });
  },

  // Export
  exportReturns: (filters?: ReturnFilters, format: 'csv' | 'xlsx' = 'csv') => {
    return apiClient.post('/returns/export', { ...filters, format }, {
      responseType: 'blob',
    });
  },

  // Search
  searchReturns: (query: string) => {
    return apiClient.get<ReturnRequest[]>('/returns/search', {
      params: { query },
    });
  },
};
